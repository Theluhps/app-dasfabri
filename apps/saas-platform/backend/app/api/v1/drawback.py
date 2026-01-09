"""
Drawback API - Gestão de Drawback
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models import (
    User, Company, ImportProcess, ExportProcess,
    DrawbackAct, DrawbackCredit, DrawbackActStatus, DrawbackActType
)
from pydantic import BaseModel
from decimal import Decimal

router = APIRouter()

# Schemas
class DrawbackActCreate(BaseModel):
    act_type: DrawbackActType
    description: str
    total_value: Decimal
    currency: str = "BRL"
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    expiration_date: Optional[datetime] = None
    notes: Optional[str] = None

class DrawbackActUpdate(BaseModel):
    description: Optional[str] = None
    total_value: Optional[Decimal] = None
    status: Optional[DrawbackActStatus] = None
    expiration_date: Optional[datetime] = None
    notes: Optional[str] = None
    rejection_reason: Optional[str] = None

class DrawbackActResponse(BaseModel):
    id: int
    act_number: str
    act_type: str
    status: str
    description: str
    total_value: Decimal
    currency: str
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    expiration_date: Optional[datetime] = None
    notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        # Ignorar campos extras que não estão no schema
        extra = "ignore"

class DrawbackCreditResponse(BaseModel):
    id: int
    credit_number: str
    value: Decimal
    currency: str
    used_value: Decimal
    available_value: Decimal
    is_active: bool
    is_used: bool
    generated_at: datetime
    expiration_date: Optional[datetime]
    
    class Config:
        orm_mode = True

@router.get("/acts", response_model=List[DrawbackActResponse])
async def list_drawback_acts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[DrawbackActStatus] = None,
    act_type: Optional[DrawbackActType] = None
):
    """Listar atos de drawback"""
    company_id = current_user.company_id
    
    query = db.query(DrawbackAct).filter(
        DrawbackAct.company_id == company_id
    )
    
    if status:
        query = query.filter(DrawbackAct.status == status)
    if act_type:
        query = query.filter(DrawbackAct.act_type == act_type)
    
    acts = query.order_by(DrawbackAct.created_at.desc()).all()
    return acts

@router.post("/acts", response_model=DrawbackActResponse)
async def create_drawback_act(
    act_data: DrawbackActCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar novo ato de drawback"""
    company_id = current_user.company_id
    
    # Validar processos
    if act_data.import_process_id:
        process = db.query(ImportProcess).filter(
            and_(
                ImportProcess.id == act_data.import_process_id,
                ImportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de importação não encontrado")
    
    if act_data.export_process_id:
        process = db.query(ExportProcess).filter(
            and_(
                ExportProcess.id == act_data.export_process_id,
                ExportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de exportação não encontrado")
    
    # Gerar número do ato
    act_count = db.query(DrawbackAct).filter(
        DrawbackAct.company_id == company_id
    ).count()
    act_number = f"DB-{company_id}-{act_count + 1:06d}"
    
    # Criar ato
    new_act = DrawbackAct(
        act_number=act_number,
        act_type=act_data.act_type,
        status=DrawbackActStatus.draft,
        description=act_data.description,
        total_value=act_data.total_value,
        currency=act_data.currency,
        company_id=company_id,
        import_process_id=act_data.import_process_id,
        export_process_id=act_data.export_process_id,
        expiration_date=act_data.expiration_date,
        created_by=current_user.id,
        notes=act_data.notes
    )
    
    db.add(new_act)
    db.commit()
    db.refresh(new_act)
    
    return DrawbackActResponse.from_orm(new_act)

@router.get("/acts/{act_id}", response_model=DrawbackActResponse)
async def get_drawback_act(
    act_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um ato de drawback"""
    company_id = current_user.company_id
    
    act = db.query(DrawbackAct).filter(
        and_(
            DrawbackAct.id == act_id,
            DrawbackAct.company_id == company_id
        )
    ).first()
    
    if not act:
        raise HTTPException(status_code=404, detail="Ato de drawback não encontrado")
    
    return DrawbackActResponse.from_orm(act)

@router.patch("/acts/{act_id}", response_model=DrawbackActResponse)
async def update_drawback_act(
    act_id: int,
    act_data: DrawbackActUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar ato de drawback"""
    company_id = current_user.company_id
    
    act = db.query(DrawbackAct).filter(
        and_(
            DrawbackAct.id == act_id,
            DrawbackAct.company_id == company_id
        )
    ).first()
    
    if not act:
        raise HTTPException(status_code=404, detail="Ato de drawback não encontrado")
    
    # Atualizar campos
    if act_data.description is not None:
        act.description = act_data.description
    if act_data.total_value is not None:
        act.total_value = act_data.total_value
    if act_data.status is not None:
        act.status = act_data.status
        if act_data.status == DrawbackActStatus.submitted:
            act.submitted_at = datetime.utcnow()
        elif act_data.status == DrawbackActStatus.approved:
            act.approved_at = datetime.utcnow()
            act.approved_by = current_user.id
    if act_data.expiration_date is not None:
        act.expiration_date = act_data.expiration_date
    if act_data.notes is not None:
        act.notes = act_data.notes
    if act_data.rejection_reason is not None:
        act.rejection_reason = act_data.rejection_reason
    
    db.commit()
    db.refresh(act)
    
    return DrawbackActResponse.from_orm(act)

@router.post("/acts/{act_id}/submit")
async def submit_drawback_act(
    act_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submeter ato de drawback para aprovação"""
    company_id = current_user.company_id
    
    act = db.query(DrawbackAct).filter(
        and_(
            DrawbackAct.id == act_id,
            DrawbackAct.company_id == company_id
        )
    ).first()
    
    if not act:
        raise HTTPException(status_code=404, detail="Ato de drawback não encontrado")
    
    if act.status != DrawbackActStatus.draft:
        raise HTTPException(status_code=400, detail="Apenas atos em rascunho podem ser submetidos")
    
    act.status = DrawbackActStatus.submitted
    act.submitted_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Ato submetido com sucesso", "act_id": act_id}

@router.post("/acts/{act_id}/approve")
async def approve_drawback_act(
    act_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Aprovar ato de drawback e gerar créditos"""
    company_id = current_user.company_id
    
    act = db.query(DrawbackAct).filter(
        and_(
            DrawbackAct.id == act_id,
            DrawbackAct.company_id == company_id
        )
    ).first()
    
    if not act:
        raise HTTPException(status_code=404, detail="Ato de drawback não encontrado")
    
    if act.status != DrawbackActStatus.submitted:
        raise HTTPException(status_code=400, detail="Apenas atos submetidos podem ser aprovados")
    
    # Aprovar ato
    act.status = DrawbackActStatus.approved
    act.approved_at = datetime.utcnow()
    act.approved_by = current_user.id
    
    # Gerar crédito
    credit_count = db.query(DrawbackCredit).filter(
        DrawbackCredit.company_id == company_id
    ).count()
    credit_number = f"DC-{company_id}-{credit_count + 1:06d}"
    
    new_credit = DrawbackCredit(
        credit_number=credit_number,
        value=act.total_value,
        currency=act.currency,
        used_value=Decimal(0),
        available_value=act.total_value,
        is_active=True,
        is_used=False,
        act_id=act.id,
        company_id=company_id,
        generated_at=datetime.utcnow(),
        expiration_date=act.expiration_date
    )
    
    db.add(new_credit)
    db.commit()
    
    return {
        "message": "Ato aprovado e crédito gerado com sucesso",
        "act_id": act_id,
        "credit_id": new_credit.id,
        "credit_number": new_credit.credit_number
    }

@router.get("/credits", response_model=List[DrawbackCreditResponse])
async def list_drawback_credits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    is_active: Optional[bool] = None
):
    """Listar créditos de drawback"""
    company_id = current_user.company_id
    
    query = db.query(DrawbackCredit).filter(
        DrawbackCredit.company_id == company_id
    )
    
    if is_active is not None:
        query = query.filter(DrawbackCredit.is_active == is_active)
    
    credits = query.order_by(DrawbackCredit.generated_at.desc()).all()
    return credits

@router.get("/credits/{credit_id}", response_model=DrawbackCreditResponse)
async def get_drawback_credit(
    credit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um crédito de drawback"""
    company_id = current_user.company_id
    
    credit = db.query(DrawbackCredit).filter(
        and_(
            DrawbackCredit.id == credit_id,
            DrawbackCredit.company_id == company_id
        )
    ).first()
    
    if not credit:
        raise HTTPException(status_code=404, detail="Crédito de drawback não encontrado")
    
    return credit

