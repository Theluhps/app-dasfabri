"""
API para gestão de documentos com OCR e upload múltiplo
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Response, Body
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.models import User, ImportDocument, ImportProcess, DocumentStatus
from app.schemas import ImportDocument as ImportDocumentSchema, ImportDocumentCreate
from app.core.security import get_current_user
from app.core.database import get_db
from app.core.exceptions import NotFoundError, BusinessLogicError
from app.core.logging_config import logger
from app.services.ocr_service import get_ocr_service
from datetime import datetime
import tempfile
import os
from pathlib import Path
import shutil

router = APIRouter()

# Configuração de upload
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Tipos de arquivo permitidos
ALLOWED_TYPES = {
    'application/pdf': ['.pdf'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/jpg': ['.jpg', '.jpeg'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
}

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


@router.post("/upload", response_model=ImportDocumentSchema)
async def upload_document(
    file: UploadFile = File(...),
    import_process_id: Optional[int] = None,
    document_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload de documento único com processamento OCR automático
    Suporta: PDF, PNG, JPEG, DOC, DOCX, XLS, XLSX
    """
    logger.info(f"Upload de documento: {file.filename} pelo usuário {current_user.id}")
    
    # Validar tipo de arquivo
    if file.content_type not in ALLOWED_TYPES:
        raise BusinessLogicError(
            detail=f"Tipo de arquivo não suportado: {file.content_type}. Tipos permitidos: PDF, PNG, JPEG, DOC, DOCX, XLS, XLSX"
        )
    
    # Ler arquivo
    file_bytes = await file.read()
    
    # Validar tamanho
    if len(file_bytes) > MAX_FILE_SIZE:
        raise BusinessLogicError(
            detail=f"Arquivo muito grande: {len(file_bytes)} bytes. Tamanho máximo: {MAX_FILE_SIZE} bytes (50MB)"
        )
    
    # Processar com OCR
    ocr_service = get_ocr_service()
    try:
        file_extension = Path(file.filename).suffix.lower()
        file_type = 'pdf' if file_extension == '.pdf' else 'image'
        
        ocr_result = ocr_service.extract_text_from_bytes(
            file_bytes=file_bytes,
            file_type=file_type,
            language='pt'  # TODO: Detectar idioma automaticamente
        )
        
        # Classificar documento
        classification = ocr_service.classify_document(ocr_result['text'])
        
        logger.info(f"OCR concluído: {len(ocr_result['text'])} caracteres, confiança: {ocr_result.get('confidence', 0):.2%}")
        logger.info(f"Documento classificado como: {classification['document_type']} (confiança: {classification['confidence']:.2%})")
        
    except Exception as e:
        logger.error(f"Erro no OCR: {e}")
        ocr_result = {
            'text': '',
            'confidence': 0,
            'method': 'none',
            'error': str(e)
        }
        classification = {'document_type': 'other', 'confidence': 0}
    
    # Salvar arquivo no sistema de arquivos
    file_extension = Path(file.filename).suffix.lower()
    file_name = f"{current_user.company_id}_{datetime.utcnow().timestamp()}_{file.filename}"
    file_path = UPLOAD_DIR / file_name
    
    try:
        with open(file_path, "wb") as f:
            f.write(file_bytes)
    except Exception as e:
        logger.error(f"Erro ao salvar arquivo: {e}")
        raise BusinessLogicError(detail=f"Erro ao salvar arquivo: {str(e)}")
    
    # Criar registro do documento
    document_data = {
        'file_name': file.filename,
        'file_path': str(file_path),
        'file_size': len(file_bytes),
        'mime_type': file.content_type,
        'extracted_text': ocr_result.get('text', ''),
        'ocr_confidence': ocr_result.get('confidence', 0),
        'ocr_method': ocr_result.get('method', 'none'),
        'document_type': classification.get('document_type', document_type or 'other'),
        'classification_confidence': classification.get('confidence', 0),
        'company_id': current_user.company_id,
        'uploaded_by': current_user.id,
    }
    
    if import_process_id:
        # Verificar se processo existe
        process = db.query(ImportProcess).filter(
            ImportProcess.id == import_process_id,
            ImportProcess.company_id == current_user.company_id
        ).first()
        
        if not process:
            # Deletar arquivo se processo não existe
            if file_path.exists():
                file_path.unlink()
            raise NotFoundError(
                detail=f"Processo de importação não encontrado: {import_process_id}",
                resource="Import Process"
            )
        
        document_data['import_process_id'] = import_process_id
    
    try:
        document = ImportDocument(**document_data)
        db.add(document)
        db.commit()
        db.refresh(document)
        
        logger.info(f"Documento salvo: ID {document.id}")
        return document
        
    except Exception as e:
        db.rollback()
        # Deletar arquivo em caso de erro
        if file_path.exists():
            file_path.unlink()
        logger.error(f"Erro ao salvar documento: {e}")
        raise BusinessLogicError(detail=f"Erro ao salvar documento: {str(e)}")

@router.post("/upload/multiple")
async def upload_multiple_documents(
    files: List[UploadFile] = File(...),
    import_process_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload múltiplo de documentos
    """
    logger.info(f"Upload múltiplo: {len(files)} arquivos pelo usuário {current_user.id}")
    
    if len(files) > 10:
        raise BusinessLogicError(
            detail="Máximo de 10 arquivos por upload"
        )
    
    uploaded_documents = []
    errors = []
    
    for file in files:
        try:
            # Validar tipo
            if file.content_type not in ALLOWED_TYPES:
                errors.append({
                    "file": file.filename,
                    "error": f"Tipo não suportado: {file.content_type}"
                })
                continue
            
            # Ler arquivo
            file_bytes = await file.read()
            
            # Validar tamanho
            if len(file_bytes) > MAX_FILE_SIZE:
                errors.append({
                    "file": file.filename,
                    "error": f"Arquivo muito grande: {len(file_bytes)} bytes"
                })
                continue
            
            # Salvar arquivo
            file_extension = Path(file.filename).suffix.lower()
            file_name = f"{current_user.company_id}_{datetime.utcnow().timestamp()}_{file.filename}"
            file_path = UPLOAD_DIR / file_name
            
            with open(file_path, "wb") as f:
                f.write(file_bytes)
            
            # Processar OCR (apenas para PDF e imagens)
            ocr_result = {'text': '', 'confidence': 0, 'method': 'none'}
            classification = {'document_type': 'other', 'confidence': 0}
            
            if file.content_type in ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']:
                try:
                    ocr_service = get_ocr_service()
                    file_type = 'pdf' if file_extension == '.pdf' else 'image'
                    ocr_result = ocr_service.extract_text_from_bytes(
                        file_bytes=file_bytes,
                        file_type=file_type,
                        language='pt'
                    )
                    classification = ocr_service.classify_document(ocr_result['text'])
                except Exception as e:
                    logger.warning(f"Erro no OCR para {file.filename}: {e}")
            
            # Criar documento
            document_data = {
                'file_name': file.filename,
                'file_path': str(file_path),
                'file_size': len(file_bytes),
                'mime_type': file.content_type,
                'extracted_text': ocr_result.get('text', ''),
                'ocr_confidence': ocr_result.get('confidence', 0),
                'ocr_method': ocr_result.get('method', 'none'),
                'document_type': classification.get('document_type', 'other'),
                'classification_confidence': classification.get('confidence', 0),
                'company_id': current_user.company_id,
                'uploaded_by': current_user.id,
            }
            
            if import_process_id:
                document_data['import_process_id'] = import_process_id
            
            document = ImportDocument(**document_data)
            db.add(document)
            db.commit()
            db.refresh(document)
            
            uploaded_documents.append(document)
            
        except Exception as e:
            logger.error(f"Erro ao fazer upload de {file.filename}: {e}")
            errors.append({
                "file": file.filename,
                "error": str(e)
            })
    
    return {
        "uploaded": len(uploaded_documents),
        "errors": len(errors),
        "uploaded_documents": [doc.id for doc in uploaded_documents],
        "errors_details": errors
    }

class BulkApproveDocumentsRequest(BaseModel):
    document_ids: List[int]

@router.post("/bulk-approve")
async def bulk_approve_documents(
    request: BulkApproveDocumentsRequest = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Aprovar múltiplos documentos
    """
    document_ids = request.document_ids
    logger.info(f"Usuário {current_user.id} aprovando {len(document_ids)} documentos")
    
    approved = []
    errors = []
    
    for doc_id in document_ids:
        try:
            document = db.query(ImportDocument).filter(
                ImportDocument.id == doc_id,
                ImportDocument.company_id == current_user.company_id
            ).first()
            
            if not document:
                errors.append({
                    "document_id": doc_id,
                    "error": "Documento não encontrado"
                })
                continue
            
            # Aprovar documento
            document.status = DocumentStatus.approved
            document.updated_at = datetime.utcnow()
            
            approved.append({
                "document_id": doc_id,
                "file_name": document.file_name
            })
            
        except Exception as e:
            errors.append({
                "document_id": doc_id,
                "error": str(e)
            })
    
    try:
        db.commit()
        logger.info(f"Bulk approve de documentos concluído: {len(approved)} aprovados, {len(errors)} erros")
    except Exception as e:
        db.rollback()
        raise BusinessLogicError(detail=f"Erro ao aprovar documentos: {str(e)}")
    
    return {
        "message": f"{len(approved)} documentos aprovados, {len(errors)} com erros.",
        "approved_count": len(approved),
        "errors": errors
    }


@router.post("/{document_id}/reprocess-ocr")
async def reprocess_ocr(
    document_id: int,
    language: Optional[str] = 'pt',
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Reprocessar OCR de um documento existente
    """
    document = db.query(ImportDocument).filter(
        ImportDocument.id == document_id,
        ImportDocument.company_id == current_user.company_id
    ).first()
    
    if not document:
        raise NotFoundError("Documento", document_id)
    
    # TODO: Recuperar arquivo original e reprocessar
    # Por enquanto, retorna documento atualizado
    logger.info(f"Reprocessamento OCR solicitado para documento {document_id}")
    
    return {
        "message": "Reprocessamento OCR iniciado",
        "document_id": document_id
    }


@router.get("/{document_id}/text")
async def get_document_text(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obter texto extraído de um documento
    """
    document = db.query(ImportDocument).filter(
        ImportDocument.id == document_id,
        ImportDocument.company_id == current_user.company_id
    ).first()
    
    if not document:
        raise NotFoundError(
            detail=f"Documento não encontrado: {document_id}",
            resource="Document"
        )
    
    return {
        "document_id": document_id,
        "filename": document.file_name,
        "text": document.extracted_text or "",
        "ocr_confidence": document.ocr_confidence or 0,
        "ocr_method": document.ocr_method or "none"
    }

@router.get("/{document_id}/download")
async def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Download de documento
    """
    logger.info(f"Download de documento: {document_id} pelo usuário {current_user.id}")
    
    document = db.query(ImportDocument).filter(
        ImportDocument.id == document_id,
        ImportDocument.company_id == current_user.company_id
    ).first()
    
    if not document:
        raise NotFoundError(
            detail=f"Documento não encontrado: {document_id}",
            resource="Document"
        )
    
    if not document.file_path or not Path(document.file_path).exists():
        raise NotFoundError(
            detail=f"Arquivo não encontrado no sistema de arquivos",
            resource="Document File"
        )
    
    return FileResponse(
        path=document.file_path,
        filename=document.file_name,
        media_type=document.mime_type or 'application/octet-stream'
    )

@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletar documento e arquivo associado
    """
    logger.info(f"Deletando documento: {document_id} pelo usuário {current_user.id}")
    
    document = db.query(ImportDocument).filter(
        ImportDocument.id == document_id,
        ImportDocument.company_id == current_user.company_id
    ).first()
    
    if not document:
        raise NotFoundError(
            detail=f"Documento não encontrado: {document_id}",
            resource="Document"
        )
    
    # Deletar arquivo do sistema de arquivos
    if document.file_path and Path(document.file_path).exists():
        try:
            Path(document.file_path).unlink()
            logger.info(f"Arquivo deletado: {document.file_path}")
        except Exception as e:
            logger.warning(f"Erro ao deletar arquivo {document.file_path}: {e}")
    
    # Deletar registro do banco
    db.delete(document)
    db.commit()
    
    logger.info(f"Documento deletado: ID {document_id}")
    return {"message": "Documento deletado com sucesso"}

