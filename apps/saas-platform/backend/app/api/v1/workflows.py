from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models import User, Company, ImportProcess, ExportProcess, Supplier, Client, Payment, ExchangeRate, Container, PurchaseOrder, Workflow, Approval, AccessRequest
from app.schemas import *
from app.core.security import authenticate_user, get_current_user, create_access_token, get_password_hash
from app.core.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Workflow)
def create_workflow(
    workflow: schemas.WorkflowCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar novo workflow"""
    # Verificar se o nome já existe
    existing = db.query(models.Workflow).filter(
        models.Workflow.name == workflow.name,
        models.Workflow.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Nome do workflow já existe")
    
    db_workflow = models.Workflow(
        **workflow.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

@router.get("/", response_model=List[schemas.Workflow])
def list_workflows(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[schemas.WorkflowStatus] = None,
    workflow_type: Optional[schemas.WorkflowType] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar workflows com filtros"""
    query = db.query(models.Workflow).filter(
        models.Workflow.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(models.Workflow.status == status)
    
    if workflow_type:
        query = query.filter(models.Workflow.workflow_type == workflow_type)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            models.Workflow.name.ilike(search_filter) |
            models.Workflow.description.ilike(search_filter)
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/{workflow_id}", response_model=schemas.Workflow)
def get_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de um workflow"""
    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.company_id == current_user.company_id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    
    return workflow

@router.put("/{workflow_id}", response_model=schemas.Workflow)
def update_workflow(
    workflow_id: int,
    workflow_update: schemas.WorkflowUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar workflow"""
    db_workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.company_id == current_user.company_id
    ).first()
    
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    
    # Atualizar apenas campos fornecidos
    update_data = workflow_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_workflow, field, value)
    
    db_workflow.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

@router.delete("/{workflow_id}")
def delete_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir workflow"""
    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.company_id == current_user.company_id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    
    # Verificar se há steps vinculados
    steps_count = db.query(models.WorkflowStep).filter(
        models.WorkflowStep.workflow_id == workflow_id
    ).count()
    
    if steps_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Não é possível excluir o workflow. Existem {steps_count} etapas vinculadas."
        )
    
    db.delete(workflow)
    db.commit()
    return {"message": "Workflow excluído com sucesso"}

@router.get("/{workflow_id}/steps", response_model=List[schemas.WorkflowStep])
def get_workflow_steps(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar etapas de um workflow"""
    # Verificar se o workflow existe e pertence à empresa
    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.company_id == current_user.company_id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    
    steps = db.query(models.WorkflowStep).filter(
        models.WorkflowStep.workflow_id == workflow_id
    ).order_by(models.WorkflowStep.step_order).all()
    
    return steps

@router.post("/{workflow_id}/steps", response_model=schemas.WorkflowStep)
def add_workflow_step(
    workflow_id: int,
    step: schemas.WorkflowStepCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Adicionar etapa ao workflow"""
    # Verificar se o workflow existe e pertence à empresa
    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.company_id == current_user.company_id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    
    # Se não foi especificado o step_order, pegar o próximo número
    if not step.step_order:
        max_order = db.query(models.WorkflowStep.step_order).filter(
            models.WorkflowStep.workflow_id == workflow_id
        ).order_by(models.WorkflowStep.step_order.desc()).first()
        
        step.step_order = (max_order[0] + 1) if max_order else 1
    
    db_step = models.WorkflowStep(
        **step.dict(),
        workflow_id=workflow_id
    )
    
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    return db_step

@router.put("/{workflow_id}/steps/{step_id}", response_model=schemas.WorkflowStep)
def update_workflow_step(
    workflow_id: int,
    step_id: int,
    step_update: schemas.WorkflowStepUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar etapa do workflow"""
    # Verificar se o workflow existe e pertence à empresa
    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.company_id == current_user.company_id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    
    # Verificar se a etapa existe
    step = db.query(models.WorkflowStep).filter(
        models.WorkflowStep.id == step_id,
        models.WorkflowStep.workflow_id == workflow_id
    ).first()
    
    if not step:
        raise HTTPException(status_code=404, detail="Etapa não encontrada")
    
    # Atualizar apenas campos fornecidos
    update_data = step_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(step, field, value)
    
    step.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(step)
    return step

@router.delete("/{workflow_id}/steps/{step_id}")
def delete_workflow_step(
    workflow_id: int,
    step_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir etapa do workflow"""
    # Verificar se o workflow existe e pertence à empresa
    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.company_id == current_user.company_id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    
    # Verificar se a etapa existe
    step = db.query(models.WorkflowStep).filter(
        models.WorkflowStep.id == step_id,
        models.WorkflowStep.workflow_id == workflow_id
    ).first()
    
    if not step:
        raise HTTPException(status_code=404, detail="Etapa não encontrada")
    
    db.delete(step)
    db.commit()
    return {"message": "Etapa excluída com sucesso"}

@router.get("/stats/summary")
def get_workflow_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas resumidas de workflows"""
    total = db.query(models.Workflow).filter(
        models.Workflow.company_id == current_user.company_id
    ).count()
    
    active = db.query(models.Workflow).filter(
        models.Workflow.company_id == current_user.company_id,
        models.Workflow.status == models.WorkflowStatus.active
    ).count()
    
    inactive = db.query(models.Workflow).filter(
        models.Workflow.company_id == current_user.company_id,
        models.Workflow.status == models.WorkflowStatus.inactive
    ).count()
    
    return {
        "total": total,
        "active": active,
        "inactive": inactive
    }

@router.get("/stats/by-type")
def get_workflow_type_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de workflows por tipo"""
    from sqlalchemy import func
    
    stats = db.query(
        models.Workflow.workflow_type,
        func.count(models.Workflow.id).label('count')
    ).filter(
        models.Workflow.company_id == current_user.company_id
    ).group_by(models.Workflow.workflow_type).all()
    
    return [{"workflow_type": workflow_type, "count": count} for workflow_type, count in stats] 