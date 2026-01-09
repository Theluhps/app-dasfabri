from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models import User, Company, ImportProcess, ExportProcess, Supplier, Client, Payment, ExchangeRate, Container, PurchaseOrder, Workflow, Approval, AccessRequest
from app.schemas import *
from app.core.security import authenticate_user, get_current_user, create_access_token, get_password_hash
from app.core.database import get_db
from app.core.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Approval)
def create_approval(
    approval: schemas.ApprovalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar nova aprovação"""
    db_approval = models.Approval(
        **approval.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_approval)
    db.commit()
    db.refresh(db_approval)
    return db_approval

@router.get("/", response_model=List[schemas.Approval])
def list_approvals(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[schemas.ApprovalStatus] = None,
    approval_type: Optional[schemas.ApprovalType] = None,
    assigned_to: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar aprovações com filtros"""
    query = db.query(models.Approval).filter(
        models.Approval.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(models.Approval.status == status)
    
    if approval_type:
        query = query.filter(models.Approval.approval_type == approval_type)
    
    if assigned_to:
        query = query.filter(models.Approval.assigned_to == assigned_to)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            models.Approval.title.ilike(search_filter) |
            models.Approval.description.ilike(search_filter)
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/my-pending", response_model=List[schemas.Approval])
def get_my_pending_approvals(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar aprovações pendentes do usuário atual"""
    approvals = db.query(models.Approval).filter(
        models.Approval.company_id == current_user.company_id,
        models.Approval.assigned_to == current_user.id,
        models.Approval.status == models.ApprovalStatus.pending
    ).all()
    
    return approvals

@router.get("/{approval_id}", response_model=schemas.Approval)
def get_approval(
    approval_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de uma aprovação"""
    approval = db.query(models.Approval).filter(
        models.Approval.id == approval_id,
        models.Approval.company_id == current_user.company_id
    ).first()
    
    if not approval:
        raise HTTPException(status_code=404, detail="Aprovação não encontrada")
    
    return approval

@router.put("/{approval_id}", response_model=schemas.Approval)
def update_approval(
    approval_id: int,
    approval_update: schemas.ApprovalUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar aprovação"""
    db_approval = db.query(models.Approval).filter(
        models.Approval.id == approval_id,
        models.Approval.company_id == current_user.company_id
    ).first()
    
    if not db_approval:
        raise HTTPException(status_code=404, detail="Aprovação não encontrada")
    
    # Atualizar apenas campos fornecidos
    update_data = approval_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_approval, field, value)
    
    db_approval.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_approval)
    return db_approval

@router.delete("/{approval_id}")
def delete_approval(
    approval_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir aprovação"""
    approval = db.query(models.Approval).filter(
        models.Approval.id == approval_id,
        models.Approval.company_id == current_user.company_id
    ).first()
    
    if not approval:
        raise HTTPException(status_code=404, detail="Aprovação não encontrada")
    
    db.delete(approval)
    db.commit()
    return {"message": "Aprovação excluída com sucesso"}

@router.put("/{approval_id}/approve")
def approve_request(
    approval_id: int,
    comments: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Aprovar solicitação"""
    approval = db.query(models.Approval).filter(
        models.Approval.id == approval_id,
        models.Approval.company_id == current_user.company_id
    ).first()
    
    if not approval:
        raise HTTPException(status_code=404, detail="Aprovação não encontrada")
    
    if approval.status != models.ApprovalStatus.pending:
        raise HTTPException(status_code=400, detail="Apenas aprovações pendentes podem ser aprovadas")
    
    if approval.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para aprovar esta solicitação")
    
    approval.status = models.ApprovalStatus.approved
    approval.approved_by = current_user.id
    approval.approved_at = datetime.utcnow()
    approval.comments = comments
    approval.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Solicitação aprovada com sucesso"}

@router.put("/{approval_id}/reject")
def reject_request(
    approval_id: int,
    rejection_reason: str,
    comments: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Rejeitar solicitação"""
    approval = db.query(models.Approval).filter(
        models.Approval.id == approval_id,
        models.Approval.company_id == current_user.company_id
    ).first()
    
    if not approval:
        raise HTTPException(status_code=404, detail="Aprovação não encontrada")
    
    if approval.status != models.ApprovalStatus.pending:
        raise HTTPException(status_code=400, detail="Apenas aprovações pendentes podem ser rejeitadas")
    
    if approval.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para rejeitar esta solicitação")
    
    approval.status = models.ApprovalStatus.rejected
    approval.rejected_by = current_user.id
    approval.rejected_at = datetime.utcnow()
    approval.rejection_reason = rejection_reason
    approval.comments = comments
    approval.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Solicitação rejeitada com sucesso"}

@router.put("/{approval_id}/reassign")
def reassign_approval(
    approval_id: int,
    new_assignee_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Reatribuir aprovação para outro usuário"""
    approval = db.query(models.Approval).filter(
        models.Approval.id == approval_id,
        models.Approval.company_id == current_user.company_id
    ).first()
    
    if not approval:
        raise HTTPException(status_code=404, detail="Aprovação não encontrada")
    
    # Verificar se o novo usuário existe e pertence à mesma empresa
    new_assignee = db.query(models.User).filter(
        models.User.id == new_assignee_id,
        models.User.company_id == current_user.company_id
    ).first()
    
    if not new_assignee:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    approval.assigned_to = new_assignee_id
    approval.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Aprovação reatribuída com sucesso"}

@router.get("/stats/summary")
def get_approval_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas resumidas de aprovações"""
    total = db.query(models.Approval).filter(
        models.Approval.company_id == current_user.company_id
    ).count()
    
    pending = db.query(models.Approval).filter(
        models.Approval.company_id == current_user.company_id,
        models.Approval.status == models.ApprovalStatus.pending
    ).count()
    
    approved = db.query(models.Approval).filter(
        models.Approval.company_id == current_user.company_id,
        models.Approval.status == models.ApprovalStatus.approved
    ).count()
    
    rejected = db.query(models.Approval).filter(
        models.Approval.company_id == current_user.company_id,
        models.Approval.status == models.ApprovalStatus.rejected
    ).count()
    
    # Aprovações pendentes do usuário atual
    my_pending = db.query(models.Approval).filter(
        models.Approval.company_id == current_user.company_id,
        models.Approval.assigned_to == current_user.id,
        models.Approval.status == models.ApprovalStatus.pending
    ).count()
    
    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "my_pending": my_pending
    }

@router.get("/stats/by-type")
def get_approval_type_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de aprovações por tipo"""
    from sqlalchemy import func
    
    stats = db.query(
        models.Approval.approval_type,
        func.count(models.Approval.id).label('count')
    ).filter(
        models.Approval.company_id == current_user.company_id
    ).group_by(models.Approval.approval_type).all()
    
    return [{"approval_type": approval_type, "count": count} for approval_type, count in stats] 