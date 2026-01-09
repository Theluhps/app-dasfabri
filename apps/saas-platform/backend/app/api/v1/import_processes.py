from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.models import User, Company, ImportProcess as ImportProcessModel, ExportProcess, Supplier, Client, Payment, ExchangeRate, Container, PurchaseOrder, Workflow, Approval, AccessRequest, ImportStatus, ImportDocument, ImportType, ShippingMethod, Incoterm
from app.schemas import ImportDocument, ImportDocumentCreate
from app.core.security import get_current_user
from app.core.database import get_db
from app.core.exceptions import NotFoundError, ConflictError, BusinessLogicError
from app.core.logging_config import logger
import csv
import io

router = APIRouter()

# Schemas Pydantic para ImportProcess
class ImportProcessCreate(BaseModel):
    """Schema para criação de processo de importação"""
    reference_number: str
    client: str
    product: str
    origin: str
    destination: str
    supplier: str
    description: Optional[str] = None
    ncm: Optional[str] = None
    invoice_value: Optional[float] = None
    currency: str = "USD"
    import_type: Optional[ImportType] = ImportType.direct
    shipping_method: Optional[ShippingMethod] = ShippingMethod.sea
    incoterm: Optional[Incoterm] = Incoterm.FOB
    customs_broker: Optional[str] = None
    freight_forwarder: Optional[str] = None
    estimated_arrival: Optional[datetime] = None
    supplier_country: Optional[str] = None
    status: Optional[ImportStatus] = ImportStatus.draft

class ImportProcessUpdate(BaseModel):
    """Schema para atualização de processo de importação"""
    client: Optional[str] = None
    product: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    supplier: Optional[str] = None
    description: Optional[str] = None
    ncm: Optional[str] = None
    invoice_value: Optional[float] = None
    currency: Optional[str] = None
    import_type: Optional[ImportType] = None
    shipping_method: Optional[ShippingMethod] = None
    incoterm: Optional[Incoterm] = None
    customs_broker: Optional[str] = None
    freight_forwarder: Optional[str] = None
    estimated_arrival: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    customs_clearance_date: Optional[datetime] = None
    status: Optional[ImportStatus] = None
    current_step: Optional[str] = None
    supplier_country: Optional[str] = None

class ImportProcessResponse(BaseModel):
    """Schema de resposta para ImportProcess"""
    id: int
    reference_number: str
    client: str
    product: str
    origin: str
    destination: str
    supplier: str
    description: Optional[str] = None
    ncm: Optional[str] = None
    invoice_value: Optional[float] = None
    currency: str
    status: ImportStatus
    is_favorite: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

@router.post("/", response_model=ImportProcessResponse)
def create_import_process(
    process: ImportProcessCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar novo processo de importação"""
    logger.info(f"Usuário {current_user.id} criando processo de importação: {process.reference_number}")
    
    # Verificar se o número de referência já existe
    existing = db.query(ImportProcessModel).filter(
        ImportProcessModel.reference_number == process.reference_number,
        ImportProcessModel.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise ConflictError(
            detail=f"Número de referência '{process.reference_number}' já existe",
            resource="Processo de importação"
        )
    
    try:
        db_process = ImportProcessModel(
            **process.dict(),
            company_id=current_user.company_id,
            created_by=current_user.id
        )
        
        db.add(db_process)
        db.commit()
        db.refresh(db_process)
        
        logger.info(f"Processo de importação criado com sucesso: ID {db_process.id}")
        return ImportProcessResponse.from_orm(db_process)
    except Exception as e:
        db.rollback()
        logger.error(f"Erro ao criar processo de importação: {e}")
        raise BusinessLogicError(detail=f"Erro ao criar processo: {str(e)}")

@router.get("/", response_model=List[ImportProcessResponse])
def list_import_processes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[ImportStatus] = None,
    search: Optional[str] = None,
    favorites_only: bool = Query(False, description="Listar apenas processos favoritos"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar processos de importação com filtros"""
    logger.debug(f"Listando processos de importação - skip={skip}, limit={limit}, status={status}, favorites_only={favorites_only}")
    
    query = db.query(ImportProcessModel).filter(
        ImportProcessModel.company_id == current_user.company_id
    )
    
    if favorites_only:
        query = query.filter(ImportProcessModel.is_favorite == 1)
    
    if status:
        query = query.filter(ImportProcessModel.status == status)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            ImportProcessModel.reference_number.ilike(search_filter) |
            ImportProcessModel.client.ilike(search_filter) |
            ImportProcessModel.product.ilike(search_filter) |
            ImportProcessModel.supplier.ilike(search_filter)
        )
    
    processes = query.offset(skip).limit(limit).all()
    logger.debug(f"Encontrados {len(processes)} processos de importação")
    return [ImportProcessResponse.from_orm(p) for p in processes]

@router.get("/favorites", response_model=List[ImportProcessResponse])
def list_favorites(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar processos de importação favoritos"""
    processes = db.query(ImportProcessModel).filter(
        ImportProcessModel.company_id == current_user.company_id,
        ImportProcessModel.is_favorite == 1
    ).offset(skip).limit(limit).all()
    
    logger.debug(f"Encontrados {len(processes)} processos favoritos")
    return [ImportProcessResponse.from_orm(p) for p in processes]

@router.get("/{process_id}", response_model=ImportProcessResponse)
def get_import_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um processo de importação"""
    process = db.query(ImportProcessModel).filter(
        ImportProcessModel.id == process_id,
        ImportProcessModel.company_id == current_user.company_id
    ).first()
    
    if not process:
        raise NotFoundError("Processo de importação", process_id)
    
    return ImportProcessResponse.from_orm(process)

@router.put("/{process_id}", response_model=ImportProcessResponse)
def update_import_process(
    process_id: int,
    process_update: ImportProcessUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar processo de importação"""
    db_process = db.query(ImportProcessModel).filter(
        ImportProcessModel.id == process_id,
        ImportProcessModel.company_id == current_user.company_id
    ).first()
    
    if not db_process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    
    # Atualizar apenas campos fornecidos
    update_data = process_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_process, field, value)
    
    db_process.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_process)
    return ImportProcessResponse.from_orm(db_process)

@router.delete("/{process_id}")
def delete_import_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Excluir processo de importação"""
    process = db.query(ImportProcessModel).filter(
        ImportProcessModel.id == process_id,
        ImportProcessModel.company_id == current_user.company_id
    ).first()
    
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    
    db.delete(process)
    db.commit()
    return {"message": "Processo excluído com sucesso"}

@router.get("/{process_id}/documents", response_model=List[ImportDocument])
def get_process_documents(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar documentos de um processo de importação"""
    # Verificar se o processo existe e pertence à empresa
    process = db.query(ImportProcessModel).filter(
        ImportProcessModel.id == process_id,
        ImportProcessModel.company_id == current_user.company_id
    ).first()
    
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    
    from app.models import ImportDocument
    documents = db.query(ImportDocument).filter(
        ImportDocument.import_process_id == process_id,
        ImportDocument.company_id == current_user.company_id
    ).all()
    
    return [ImportDocument.from_orm(doc) for doc in documents]

@router.get("/stats/summary")
def get_import_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter estatísticas resumidas de importação"""
    total = db.query(ImportProcessModel).filter(
        ImportProcessModel.company_id == current_user.company_id
    ).count()
    
    pending = db.query(ImportProcessModel).filter(
        ImportProcessModel.company_id == current_user.company_id,
        ImportProcessModel.status == ImportStatus.pending
    ).count()
    
    in_progress = db.query(ImportProcessModel).filter(
        ImportProcessModel.company_id == current_user.company_id,
        ImportProcessModel.status == ImportStatus.in_progress
    ).count()
    
    completed = db.query(ImportProcessModel).filter(
        ImportProcessModel.company_id == current_user.company_id,
        ImportProcessModel.status == ImportStatus.completed
    ).count()
    
    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "completed": completed,
        "cancelled": total - pending - in_progress - completed
    }

@router.post("/{process_id}/toggle-favorite")
def toggle_favorite(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Alternar status de favorito de um processo de importação"""
    process = db.query(ImportProcessModel).filter(
        ImportProcessModel.id == process_id,
        ImportProcessModel.company_id == current_user.company_id
    ).first()
    
    if not process:
        raise NotFoundError("Processo de importação", process_id)
    
    # Toggle favorite status
    process.is_favorite = 1 if process.is_favorite == 0 else 0
    process.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(process)
    
    logger.info(f"Processo {process_id} {'adicionado aos' if process.is_favorite == 1 else 'removido dos'} favoritos pelo usuário {current_user.id}")
    
    return {
        "process_id": process_id,
        "is_favorite": bool(process.is_favorite),
        "message": "Favorito atualizado com sucesso"
    }

@router.post("/import-csv")
async def import_processes_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Importar processos de importação via CSV
    Formato esperado: reference_number, client, product, origin, destination, supplier, invoice_value, currency, status
    """
    logger.info(f"Importação CSV de processos iniciada pelo usuário {current_user.id}")
    
    # Validar tipo de arquivo
    if not file.filename.endswith('.csv'):
        raise BusinessLogicError(detail="Arquivo deve ser CSV (.csv)")
    
    # Ler conteúdo do arquivo
    content = await file.read()
    content_str = content.decode('utf-8-sig')  # utf-8-sig para lidar com BOM
    
    # Processar CSV
    csv_reader = csv.DictReader(io.StringIO(content_str))
    
    # Headers obrigatórios
    required_headers = ['reference_number', 'client', 'product', 'origin', 'destination']
    
    # Validar headers
    if not csv_reader.fieldnames:
        raise BusinessLogicError(detail="CSV vazio ou sem headers")
    
    missing_headers = [h for h in required_headers if h not in csv_reader.fieldnames]
    if missing_headers:
        raise BusinessLogicError(
            detail=f"Headers obrigatórios faltando: {', '.join(missing_headers)}"
        )
    
    # Processar linhas
    imported = []
    errors = []
    skipped = []
    
    for row_num, row in enumerate(csv_reader, start=2):  # start=2 porque linha 1 é header
        try:
            # Validar campos obrigatórios
            if not all(row.get(h) for h in required_headers):
                skipped.append({
                    "row": row_num,
                    "reference_number": row.get('reference_number', 'N/A'),
                    "reason": "Campos obrigatórios faltando"
                })
                continue
            
            # Verificar se processo já existe
            existing = db.query(ImportProcessModel).filter(
                ImportProcessModel.reference_number == row['reference_number'],
                ImportProcessModel.company_id == current_user.company_id
            ).first()
            
            if existing:
                skipped.append({
                    "row": row_num,
                    "reference_number": row['reference_number'],
                    "reason": "Processo já existe"
                })
                continue
            
            # Converter valores
            process_data = {
                'reference_number': row['reference_number'].strip(),
                'client': row['client'].strip(),
                'product': row['product'].strip(),
                'origin': row['origin'].strip(),
                'destination': row['destination'].strip(),
                'supplier': row.get('supplier', '').strip() or "N/A",
                'invoice_value': float(row['invoice_value']) if row.get('invoice_value') else None,
                'currency': row.get('currency', 'USD').strip(),
                'status': row.get('status', 'draft').strip(),
                'description': row.get('description', '').strip() or None,
                'ncm': row.get('ncm', '').strip() or None,
                'company_id': current_user.company_id,
                'created_by': current_user.id
            }
            
            # Criar processo
            new_process = ImportProcessModel(**process_data)
            db.add(new_process)
            db.flush()  # Para obter o ID sem commit
            
            imported.append({
                "row": row_num,
                "id": new_process.id,
                "reference_number": new_process.reference_number,
                "client": new_process.client
            })
            
        except ValueError as e:
            errors.append({
                "row": row_num,
                "reference_number": row.get('reference_number', 'N/A'),
                "error": f"Erro de conversão: {str(e)}"
            })
        except Exception as e:
            errors.append({
                "row": row_num,
                "reference_number": row.get('reference_number', 'N/A'),
                "error": str(e)
            })
    
    # Commit todas as importações
    try:
        db.commit()
        logger.info(f"Importação CSV concluída: {len(imported)} importados, {len(errors)} erros, {len(skipped)} ignorados")
    except Exception as e:
        db.rollback()
        raise BusinessLogicError(detail=f"Erro ao salvar processos: {str(e)}")
    
    return {
        "total_rows": len(imported) + len(errors) + len(skipped),
        "imported": len(imported),
        "errors": len(errors),
        "skipped": len(skipped),
        "imported_items": imported,
        "errors_details": errors,
        "skipped_details": skipped
    }

class BulkApproveRequest(BaseModel):
    process_ids: List[int]

@router.post("/bulk-approve")
async def bulk_approve_processes(
    request: BulkApproveRequest = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Aprovar múltiplos processos de importação
    """
    process_ids = request.process_ids
    logger.info(f"Usuário {current_user.id} aprovando {len(process_ids)} processos")
    
    approved = []
    errors = []
    
    for process_id in process_ids:
        try:
            process = db.query(ImportProcessModel).filter(
                ImportProcessModel.id == process_id,
                ImportProcessModel.company_id == current_user.company_id
            ).first()
            
            if not process:
                errors.append({
                    "process_id": process_id,
                    "error": "Processo não encontrado"
                })
                continue
            
            # Aprovar processo (mudar status)
            process.status = ImportStatus.in_progress
            process.updated_at = datetime.utcnow()
            
            approved.append({
                "process_id": process_id,
                "reference_number": process.reference_number
            })
            
        except Exception as e:
            errors.append({
                "process_id": process_id,
                "error": str(e)
            })
    
    try:
        db.commit()
        logger.info(f"Bulk approve concluído: {len(approved)} aprovados, {len(errors)} erros")
    except Exception as e:
        db.rollback()
        raise BusinessLogicError(detail=f"Erro ao aprovar processos: {str(e)}")
    
    return {
        "approved": len(approved),
        "errors": len(errors),
        "approved_items": approved,
        "errors_details": errors
    }

@router.post("/bulk-update")
async def bulk_update_processes(
    process_ids: List[int],
    update_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualizar múltiplos processos de importação
    """
    logger.info(f"Usuário {current_user.id} atualizando {len(process_ids)} processos")
    
    updated = []
    errors = []
    
    for process_id in process_ids:
        try:
            process = db.query(ImportProcessModel).filter(
                ImportProcessModel.id == process_id,
                ImportProcessModel.company_id == current_user.company_id
            ).first()
            
            if not process:
                errors.append({
                    "process_id": process_id,
                    "error": "Processo não encontrado"
                })
                continue
            
            # Atualizar campos permitidos
            for field, value in update_data.items():
                if hasattr(process, field):
                    setattr(process, field, value)
            
            process.updated_at = datetime.utcnow()
            
            updated.append({
                "process_id": process_id,
                "reference_number": process.reference_number
            })
            
        except Exception as e:
            errors.append({
                "process_id": process_id,
                "error": str(e)
            })
    
    try:
        db.commit()
        logger.info(f"Bulk update concluído: {len(updated)} atualizados, {len(errors)} erros")
    except Exception as e:
        db.rollback()
        raise BusinessLogicError(detail=f"Erro ao atualizar processos: {str(e)}")
    
    return {
        "updated": len(updated),
        "errors": len(errors),
        "updated_items": updated,
        "errors_details": errors
    } 