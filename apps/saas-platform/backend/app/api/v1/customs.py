"""
Advanced Customs API - Módulo de Alfândega Avançado
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models import (
    User, Company, ImportProcess, ExportProcess, ImportDocument,
    ComplianceCheck, ComplianceStatus
)
from pydantic import BaseModel

router = APIRouter()

# Schemas
class CustomsClearanceStatus(BaseModel):
    """Status de desembaraço"""
    process_id: int
    process_type: str  # import or export
    duimp_number: Optional[str] = None
    status: str  # pending, in_analysis, approved, rejected
    customs_broker: Optional[str] = None
    submitted_at: Optional[datetime] = None
    cleared_at: Optional[datetime] = None
    issues: List[str] = []

class CustomsValidation(BaseModel):
    """Validação aduaneira"""
    is_valid: bool
    errors: List[str] = []
    warnings: List[str] = []
    required_documents: List[str] = []
    missing_documents: List[str] = []

class SiscomexIntegration(BaseModel):
    """Integração com Siscomex"""
    duimp_number: str
    status: str
    last_update: datetime
    details: dict

@router.get("/processes/{process_id}/status", response_model=CustomsClearanceStatus)
async def get_customs_status(
    process_id: int,
    process_type: str = Query(..., description="Tipo: 'import' ou 'export'"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter status de desembaraço de um processo"""
    company_id = current_user.company_id
    
    if process_type == "import":
        process = db.query(ImportProcess).filter(
            and_(
                ImportProcess.id == process_id,
                ImportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de importação não encontrado")
        
        # Mock de status de desembaraço
        status = "pending"
        if process.customs_clearance_date:
            status = "approved"
        elif process.status == "in_progress":
            status = "in_analysis"
        
        return CustomsClearanceStatus(
            process_id=process.id,
            process_type="import",
            duimp_number=f"DUIMP-{process.id:08d}",  # Mock
            status=status,
            customs_broker=process.customs_broker,
            submitted_at=process.created_at,
            cleared_at=process.customs_clearance_date,
            issues=[]
        )
    
    elif process_type == "export":
        process = db.query(ExportProcess).filter(
            and_(
                ExportProcess.id == process_id,
                ExportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de exportação não encontrado")
        
        # Mock de status
        status = "pending"
        if process.status == "shipped":
            status = "approved"
        
        return CustomsClearanceStatus(
            process_id=process.id,
            process_type="export",
            duimp_number=None,  # Exportações não usam DUIMP
            status=status,
            customs_broker=process.customs_broker,
            submitted_at=process.created_at,
            cleared_at=None,
            issues=[]
        )
    
    else:
        raise HTTPException(status_code=400, detail="Tipo de processo inválido")

@router.post("/processes/{process_id}/validate", response_model=CustomsValidation)
async def validate_customs_documents(
    process_id: int,
    process_type: str = Query(..., description="Tipo: 'import' ou 'export'"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Validar documentos aduaneiros de um processo"""
    company_id = current_user.company_id
    
    if process_type == "import":
        process = db.query(ImportProcess).filter(
            and_(
                ImportProcess.id == process_id,
                ImportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de importação não encontrado")
        
        # Documentos obrigatórios para importação (usando valores do enum DocumentType)
        from app.models.import_document import DocumentType
        required_docs = [
            DocumentType.commercial_invoice,  # "Invoice"
            DocumentType.bill_of_lading,      # "Bill of Lading"
            DocumentType.packing_list,        # "Packing List"
            DocumentType.certificate_of_origin  # "Certificate of Origin"
        ]
        
    elif process_type == "export":
        process = db.query(ExportProcess).filter(
            and_(
                ExportProcess.id == process_id,
                ExportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de exportação não encontrado")
        
        # Documentos obrigatórios para exportação (usando valores do enum DocumentType)
        from app.models.import_document import DocumentType
        required_docs = [
            DocumentType.commercial_invoice,  # "Commercial Invoice"
            DocumentType.packing_list,        # "Packing List"
            DocumentType.import_license       # "Export License" (usando import_license como proxy)
        ]
    
    else:
        raise HTTPException(status_code=400, detail="Tipo de processo inválido")
    
    # Verificar documentos existentes
    documents = db.query(ImportDocument).filter(
        ImportDocument.import_process_id == process_id
    ).all()
    
    existing_doc_types = [doc.document_type for doc in documents]
    missing_docs = [doc for doc in required_docs if doc not in existing_doc_types]
    
    # Verificar compliance
    compliance_checks = db.query(ComplianceCheck).filter(
        and_(
            ComplianceCheck.import_process_id == process_id if process_type == "import" else False,
            ComplianceCheck.export_process_id == process_id if process_type == "export" else False
        )
    ).all()
    
    errors = []
    warnings = []
    
    for check in compliance_checks:
        if check.status == ComplianceStatus.non_compliant and check.required:
            errors.append(check.name)
        elif check.status == ComplianceStatus.warning:
            warnings.append(check.name)
    
    is_valid = len(missing_docs) == 0 and len(errors) == 0
    
    # Converter enums para strings para a resposta
    required_docs_str = [doc.value if hasattr(doc, 'value') else str(doc) for doc in required_docs]
    missing_docs_str = [doc.value if hasattr(doc, 'value') else str(doc) for doc in missing_docs]
    
    return CustomsValidation(
        is_valid=is_valid,
        errors=errors,
        warnings=warnings,
        required_documents=required_docs_str,
        missing_documents=missing_docs_str
    )

@router.post("/processes/{process_id}/submit")
async def submit_to_customs(
    process_id: int,
    process_type: str = Query(..., description="Tipo: 'import' ou 'export'"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submeter processo para desembaraço aduaneiro"""
    company_id = current_user.company_id
    
    # Validar documentos primeiro
    validation = await validate_customs_documents(process_id, process_type, db, current_user)
    
    if not validation.is_valid:
        raise HTTPException(
            status_code=400,
            detail=f"Processo não pode ser submetido. Erros: {', '.join(validation.errors)}. Documentos faltando: {', '.join(validation.missing_documents)}"
        )
    
    if process_type == "import":
        process = db.query(ImportProcess).filter(
            and_(
                ImportProcess.id == process_id,
                ImportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de importação não encontrado")
        
        # Atualizar status
        process.status = "in_progress"
        db.commit()
        
        return {
            "message": "Processo submetido para desembaraço com sucesso",
            "duimp_number": f"DUIMP-{process.id:08d}",
            "process_id": process_id
        }
    
    elif process_type == "export":
        process = db.query(ExportProcess).filter(
            and_(
                ExportProcess.id == process_id,
                ExportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de exportação não encontrado")
        
        # Atualizar status
        process.status = "in_progress"
        db.commit()
        
        return {
            "message": "Processo submetido para desembaraço com sucesso",
            "process_id": process_id
        }
    
    else:
        raise HTTPException(status_code=400, detail="Tipo de processo inválido")

@router.get("/siscomex/{duimp_number}", response_model=SiscomexIntegration)
async def get_siscomex_status(
    duimp_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter status do Siscomex para uma DUIMP"""
    # Mock de integração com Siscomex
    # Em produção, fazer chamada real à API do Siscomex
    
    return SiscomexIntegration(
        duimp_number=duimp_number,
        status="Em análise",
        last_update=datetime.utcnow(),
        details={
            "numero_duimp": duimp_number,
            "situacao": "Em análise",
            "data_entrada": datetime.utcnow().isoformat(),
            "despachante": "Nome do Despachante",
            "observacoes": []
        }
    )

@router.post("/siscomex/sync")
async def sync_siscomex(
    process_id: int,
    process_type: str = Query(..., description="Tipo: 'import' ou 'export'"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Sincronizar status com Siscomex"""
    company_id = current_user.company_id
    
    if process_type == "import":
        process = db.query(ImportProcess).filter(
            and_(
                ImportProcess.id == process_id,
                ImportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de importação não encontrado")
        
        # Mock de sincronização
        # Em produção, buscar status real do Siscomex e atualizar processo
        
        return {
            "message": "Status sincronizado com Siscomex",
            "process_id": process_id,
            "last_sync": datetime.utcnow().isoformat()
        }
    
    else:
        raise HTTPException(status_code=400, detail="Sincronização Siscomex disponível apenas para importações")

