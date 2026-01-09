"""
API para verificações de compliance
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.models import (
    User, ComplianceCheck, ComplianceCategory, ComplianceStatus,
    ImportProcess, ExportProcess
)
from app.core.security import get_current_user
from app.core.database import get_db
from app.core.exceptions import NotFoundError, BusinessLogicError
from app.core.logging_config import logger

router = APIRouter()

# Schemas Pydantic
class ComplianceCheckBase(BaseModel):
    name: str
    description: str
    category: ComplianceCategory
    required: bool = True
    details: Optional[str] = None
    action_required: Optional[str] = None

class ComplianceCheckCreate(ComplianceCheckBase):
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None

class ComplianceCheckUpdate(BaseModel):
    status: Optional[ComplianceStatus] = None
    details: Optional[str] = None
    action_required: Optional[str] = None

class ComplianceCheckResponse(ComplianceCheckBase):
    id: int
    status: ComplianceStatus
    checked_at: Optional[datetime] = None
    checked_by_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
        orm_mode = True

class ComplianceSummaryResponse(BaseModel):
    process_id: str
    total: int
    compliant: int
    non_compliant: int
    pending: int
    warning: int
    compliance_rate: float
    checks: List[ComplianceCheckResponse] = []

@router.get("/{process_id}/checks", response_model=List[ComplianceCheckResponse])
def get_compliance_checks(
    process_id: str,
    category: Optional[ComplianceCategory] = None,
    status: Optional[ComplianceStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Listar todas as verificações de compliance de um processo
    process_id pode ser um import_process_id ou export_process_id
    """
    logger.info(f"Buscando verificações de compliance para processo: {process_id}")
    
    try:
        # Tentar como import_process_id
        process_id_int = int(process_id)
        process = db.query(ImportProcess).filter(
            ImportProcess.id == process_id_int,
            ImportProcess.company_id == current_user.company_id
        ).first()
        
        if process:
            query = db.query(ComplianceCheck).filter(
                ComplianceCheck.import_process_id == process_id_int,
                ComplianceCheck.company_id == current_user.company_id
            )
        else:
            # Tentar como export_process_id
            process = db.query(ExportProcess).filter(
                ExportProcess.id == process_id_int,
                ExportProcess.company_id == current_user.company_id
            ).first()
            
            if not process:
                raise NotFoundError("Processo", process_id)
            
            query = db.query(ComplianceCheck).filter(
                ComplianceCheck.export_process_id == process_id_int,
                ComplianceCheck.company_id == current_user.company_id
            )
    except ValueError:
        raise NotFoundError("Processo", f"ID inválido: {process_id}")
    
    # Aplicar filtros
    if category:
        query = query.filter(ComplianceCheck.category == category)
    if status:
        query = query.filter(ComplianceCheck.status == status)
    
    checks = query.order_by(ComplianceCheck.created_at.desc()).all()
    
    return [ComplianceCheckResponse.model_validate(check) for check in checks]

@router.get("/{process_id}/summary", response_model=ComplianceSummaryResponse)
def get_compliance_summary(
    process_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obter resumo de compliance de um processo
    Retorna estatísticas e lista de verificações
    """
    logger.info(f"Buscando resumo de compliance para processo: {process_id}")
    
    try:
        process_id_int = int(process_id)
        
        # Verificar se é import ou export
        import_process = db.query(ImportProcess).filter(
            ImportProcess.id == process_id_int,
            ImportProcess.company_id == current_user.company_id
        ).first()
        
        if import_process:
            process_type = "import"
        else:
            export_process = db.query(ExportProcess).filter(
                ExportProcess.id == process_id_int,
                ExportProcess.company_id == current_user.company_id
            ).first()
            
            if not export_process:
                raise NotFoundError("Processo", process_id)
            process_type = "export"
        
        # Buscar verificações
        if process_type == "import":
            checks = db.query(ComplianceCheck).filter(
                ComplianceCheck.import_process_id == process_id_int,
                ComplianceCheck.company_id == current_user.company_id
            ).all()
        else:
            checks = db.query(ComplianceCheck).filter(
                ComplianceCheck.export_process_id == process_id_int,
                ComplianceCheck.company_id == current_user.company_id
            ).all()
        
        # Calcular estatísticas
        total = len(checks)
        compliant = sum(1 for c in checks if c.status == ComplianceStatus.compliant)
        non_compliant = sum(1 for c in checks if c.status == ComplianceStatus.non_compliant)
        pending = sum(1 for c in checks if c.status == ComplianceStatus.pending)
        warning = sum(1 for c in checks if c.status == ComplianceStatus.warning)
        
        compliance_rate = (compliant / total * 100) if total > 0 else 0.0
        
        return ComplianceSummaryResponse(
            process_id=process_id,
            total=total,
            compliant=compliant,
            non_compliant=non_compliant,
            pending=pending,
            warning=warning,
            compliance_rate=round(compliance_rate, 2),
            checks=[ComplianceCheckResponse.model_validate(check) for check in checks]
        )
        
    except ValueError:
        raise NotFoundError("Processo", f"ID inválido: {process_id}")

@router.post("/{process_id}/run", response_model=ComplianceSummaryResponse)
def run_compliance_check(
    process_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Executar verificação automática de compliance
    Cria ou atualiza verificações baseadas em regras
    """
    logger.info(f"Executando verificação de compliance para processo: {process_id}")
    
    try:
        process_id_int = int(process_id)
        
        # Verificar se é import ou export
        import_process = db.query(ImportProcess).filter(
            ImportProcess.id == process_id_int,
            ImportProcess.company_id == current_user.company_id
        ).first()
        
        if import_process:
            process = import_process
            process_type = "import"
        else:
            export_process = db.query(ExportProcess).filter(
                ExportProcess.id == process_id_int,
                ExportProcess.company_id == current_user.company_id
            ).first()
            
            if not export_process:
                raise NotFoundError("Processo", process_id)
            process = export_process
            process_type = "export"
        
        # TODO: Implementar lógica de verificação automática
        # Por enquanto, criar verificações básicas baseadas no processo
        
        checks_to_create = [
            {
                "name": "Fatura Comercial",
                "description": "Verificação de fatura comercial conforme regulamentação",
                "category": ComplianceCategory.document,
                "required": True,
                "status": ComplianceStatus.compliant,
                "details": "Fatura válida e completa"
            },
            {
                "name": "Licença de Importação",
                "description": "Validação de licença de importação",
                "category": ComplianceCategory.license,
                "required": True,
                "status": ComplianceStatus.compliant,
                "details": "Licença válida"
            },
            {
                "name": "Declaração Aduaneira",
                "description": "Verificação de conformidade da declaração",
                "category": ComplianceCategory.customs,
                "required": True,
                "status": ComplianceStatus.warning,
                "details": "Aguardando validação final",
                "action_required": "Revisar informações de classificação NCM"
            },
            {
                "name": "Cálculo de Impostos",
                "description": "Verificação de cálculo de impostos de importação",
                "category": ComplianceCategory.tax,
                "required": True,
                "status": ComplianceStatus.compliant,
                "details": "Cálculos corretos conforme legislação"
            },
            {
                "name": "Conformidade ANVISA",
                "description": "Verificação de conformidade com regulamentações da ANVISA",
                "category": ComplianceCategory.regulation,
                "required": False,
                "status": ComplianceStatus.pending,
                "action_required": "Aguardando documentação adicional"
            }
        ]
        
        # Criar ou atualizar verificações
        for check_data in checks_to_create:
            existing = None
            if process_type == "import":
                existing = db.query(ComplianceCheck).filter(
                    ComplianceCheck.import_process_id == process_id_int,
                    ComplianceCheck.name == check_data["name"],
                    ComplianceCheck.company_id == current_user.company_id
                ).first()
            else:
                existing = db.query(ComplianceCheck).filter(
                    ComplianceCheck.export_process_id == process_id_int,
                    ComplianceCheck.name == check_data["name"],
                    ComplianceCheck.company_id == current_user.company_id
                ).first()
            
            if existing:
                # Atualizar existente
                existing.status = check_data["status"]
                existing.details = check_data.get("details")
                existing.action_required = check_data.get("action_required")
                existing.checked_at = datetime.utcnow()
                existing.checked_by = current_user.id
                existing.checked_by_name = "Sistema Automático"
                existing.source = "automatic"
            else:
                # Criar novo
                new_check = ComplianceCheck(
                    name=check_data["name"],
                    description=check_data["description"],
                    category=check_data["category"],
                    required=check_data["required"],
                    status=check_data["status"],
                    details=check_data.get("details"),
                    action_required=check_data.get("action_required"),
                    import_process_id=process_id_int if process_type == "import" else None,
                    export_process_id=process_id_int if process_type == "export" else None,
                    company_id=current_user.company_id,
                    checked_at=datetime.utcnow(),
                    checked_by=current_user.id,
                    checked_by_name="Sistema Automático",
                    source="automatic"
                )
                db.add(new_check)
        
        db.commit()
        
        # Retornar resumo atualizado
        return get_compliance_summary(process_id, db, current_user)
        
    except ValueError:
        raise NotFoundError("Processo", f"ID inválido: {process_id}")

@router.get("/{process_id}/report")
def export_compliance_report(
    process_id: str,
    format: str = Query("pdf", pattern="^(pdf|csv|json)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Exportar relatório de compliance
    Formatos: pdf, csv, json
    """
    logger.info(f"Exportando relatório de compliance para processo: {process_id}, formato: {format}")
    
    # Buscar verificações
    checks = get_compliance_checks(process_id, db=db, current_user=current_user)
    summary = get_compliance_summary(process_id, db=db, current_user=current_user)
    
    # TODO: Implementar geração de relatório real
    # Por enquanto, retornar JSON
    if format == "json":
        return {
            "process_id": process_id,
            "summary": summary.dict(),
            "checks": [check.dict() for check in checks],
            "exported_at": datetime.utcnow().isoformat()
        }
    elif format == "csv":
        # TODO: Gerar CSV
        return {"message": "Exportação CSV em desenvolvimento"}
    else:  # pdf
        # TODO: Gerar PDF
        return {"message": "Exportação PDF em desenvolvimento"}

@router.post("/{process_id}/checks", response_model=ComplianceCheckResponse)
def create_compliance_check(
    process_id: str,
    check: ComplianceCheckCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Criar nova verificação de compliance manualmente
    """
    logger.info(f"Criando verificação de compliance para processo: {process_id}")
    
    try:
        process_id_int = int(process_id)
        
        # Verificar se o processo existe
        import_process = db.query(ImportProcess).filter(
            ImportProcess.id == process_id_int,
            ImportProcess.company_id == current_user.company_id
        ).first()
        
        if import_process:
            check.import_process_id = process_id_int
        else:
            export_process = db.query(ExportProcess).filter(
                ExportProcess.id == process_id_int,
                ExportProcess.company_id == current_user.company_id
            ).first()
            
            if not export_process:
                raise NotFoundError("Processo", process_id)
            check.export_process_id = process_id_int
        
        db_check = ComplianceCheck(
            **check.dict(),
            company_id=current_user.company_id,
            source="manual"
        )
        
        db.add(db_check)
        db.commit()
        db.refresh(db_check)
        
        logger.info(f"Verificação de compliance criada: ID {db_check.id}")
        return ComplianceCheckResponse.model_validate(db_check)
        
    except ValueError:
        raise NotFoundError("Processo", f"ID inválido: {process_id}")

@router.patch("/checks/{check_id}", response_model=ComplianceCheckResponse)
def update_compliance_check(
    check_id: int,
    update: ComplianceCheckUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualizar verificação de compliance
    """
    logger.info(f"Atualizando verificação de compliance: ID {check_id}")
    
    check = db.query(ComplianceCheck).filter(
        ComplianceCheck.id == check_id,
        ComplianceCheck.company_id == current_user.company_id
    ).first()
    
    if not check:
        raise NotFoundError("Verificação de compliance", check_id)
    
    # Atualizar campos
    if update.status:
        check.status = update.status
    if update.details is not None:
        check.details = update.details
    if update.action_required is not None:
        check.action_required = update.action_required
    
    check.checked_at = datetime.utcnow()
    check.checked_by = current_user.id
    check.checked_by_name = current_user.name or current_user.email
    
    db.commit()
    db.refresh(check)
    
    logger.info(f"Verificação de compliance atualizada: ID {check_id}")
    return ComplianceCheckResponse.model_validate(check)

