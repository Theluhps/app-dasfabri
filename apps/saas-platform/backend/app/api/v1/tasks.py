"""
Tasks API - Task Management
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.security import get_current_user
from app.models import (
    User, Company, Task, TaskStatus, TaskPriority, TaskType, ImportProcess
)
from app.core.exceptions import NotFoundError, BusinessLogicError
from app.core.logging_config import logger
from pydantic import BaseModel

router = APIRouter()

# Schemas
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.medium
    task_type: TaskType = TaskType.other
    due_date: datetime
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    assigned_to: Optional[int] = None
    notes: Optional[str] = None
    is_urgent: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    task_type: Optional[TaskType] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None
    notes: Optional[str] = None
    is_urgent: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    task_type: str
    due_date: datetime
    completed_at: Optional[datetime] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    assigned_to: Optional[int] = None
    created_by: int
    company_id: int
    notes: Optional[str] = None
    is_urgent: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar nova tarefa"""
    logger.info(f"Usuário {current_user.id} criando tarefa: {task_data.title}")
    
    # Validar import_process_id ou export_process_id se fornecido
    if task_data.import_process_id:
        process = db.query(ImportProcess).filter(
            ImportProcess.id == task_data.import_process_id,
            ImportProcess.company_id == current_user.company_id
        ).first()
        if not process:
            raise NotFoundError("Processo de Importação", task_data.import_process_id)
    if task_data.export_process_id:
        from app.models import ExportProcess
        process = db.query(ExportProcess).filter(
            ExportProcess.id == task_data.export_process_id,
            ExportProcess.company_id == current_user.company_id
        ).first()
        if not process:
            raise NotFoundError("Processo de Exportação", task_data.export_process_id)
    
    # Validar assigned_to se fornecido
    if task_data.assigned_to:
        assigned_user = db.query(User).filter(
            User.id == task_data.assigned_to,
            User.company_id == current_user.company_id
        ).first()
        if not assigned_user:
            raise NotFoundError("Usuário", task_data.assigned_to)
    
    try:
        new_task = Task(
            **task_data.dict(),
            company_id=current_user.company_id,
            created_by=current_user.id
        )
        
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        
        logger.info(f"Tarefa criada com sucesso: ID {new_task.id}")
        return TaskResponse.from_orm(new_task)
    except Exception as e:
        db.rollback()
        logger.error(f"Erro ao criar tarefa: {e}")
        raise BusinessLogicError(detail=f"Erro ao criar tarefa: {str(e)}")

@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    assigned_to: Optional[int] = None,
    import_process_id: Optional[int] = None,
    export_process_id: Optional[int] = None,
    pending_only: bool = Query(False, description="Listar apenas tarefas pendentes"),
    overdue_only: bool = Query(False, description="Listar apenas tarefas atrasadas"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar tarefas com filtros"""
    query = db.query(Task).filter(
        Task.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(Task.status == status)
    
    if priority:
        query = query.filter(Task.priority == priority)
    
    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)
    elif assigned_to is None and current_user.role != "admin":
        # Se não especificado, mostrar apenas tarefas do usuário ou não atribuídas
        query = query.filter(
            or_(
                Task.assigned_to == current_user.id,
                Task.assigned_to.is_(None)
            )
        )
    
    if import_process_id:
        query = query.filter(Task.import_process_id == import_process_id)
    if export_process_id:
        query = query.filter(Task.export_process_id == export_process_id)
    
    if pending_only:
        query = query.filter(Task.status == TaskStatus.pending)
    
    if overdue_only:
        now = datetime.utcnow()
        query = query.filter(
            and_(
                Task.due_date < now,
                Task.status != TaskStatus.completed
            )
        )
    
    tasks = query.order_by(Task.due_date.asc()).offset(skip).limit(limit).all()
    
    # Marcar tarefas atrasadas
    now = datetime.utcnow()
    for task in tasks:
        if task.due_date < now and task.status != TaskStatus.completed:
            task.status = TaskStatus.overdue
    
    return [TaskResponse.from_orm(task) for task in tasks]

@router.get("/pending", response_model=List[TaskResponse])
async def list_pending_tasks(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar tarefas pendentes"""
    now = datetime.utcnow()
    tasks = db.query(Task).filter(
        Task.company_id == current_user.company_id,
        Task.status == TaskStatus.pending,
        or_(
            Task.assigned_to == current_user.id,
            Task.assigned_to.is_(None)
        )
    ).order_by(
        Task.is_urgent.desc(),
        Task.priority.desc(),
        Task.due_date.asc()
    ).limit(limit).all()
    
    # Marcar tarefas atrasadas
    for task in tasks:
        if task.due_date < now:
            task.status = TaskStatus.overdue
    
    return [TaskResponse.from_orm(task) for task in tasks]

@router.get("/overdue", response_model=List[TaskResponse])
async def list_overdue_tasks(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar tarefas atrasadas"""
    now = datetime.utcnow()
    tasks = db.query(Task).filter(
        Task.company_id == current_user.company_id,
        Task.due_date < now,
        Task.status != TaskStatus.completed
    ).order_by(Task.due_date.asc()).limit(limit).all()
    
    return [TaskResponse.from_orm(task) for task in tasks]

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de uma tarefa"""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.company_id == current_user.company_id
    ).first()
    
    if not task:
        raise NotFoundError("Tarefa", task_id)
    
    return TaskResponse.from_orm(task)

@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar tarefa"""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.company_id == current_user.company_id
    ).first()
    
    if not task:
        raise NotFoundError("Tarefa", task_id)
    
    # Atualizar campos
    update_data = task_update.dict(exclude_unset=True)
    
    # Se status mudou para completed, definir completed_at
    if 'status' in update_data and update_data['status'] == TaskStatus.completed:
        update_data['completed_at'] = datetime.utcnow()
    elif 'status' in update_data and update_data['status'] != TaskStatus.completed:
        update_data['completed_at'] = None
    
    for field, value in update_data.items():
        setattr(task, field, value)
    
    task.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(task)
    
    logger.info(f"Tarefa {task_id} atualizada pelo usuário {current_user.id}")
    return TaskResponse.from_orm(task)

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Excluir tarefa"""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.company_id == current_user.company_id
    ).first()
    
    if not task:
        raise NotFoundError("Tarefa", task_id)
    
    db.delete(task)
    db.commit()
    
    logger.info(f"Tarefa {task_id} excluída pelo usuário {current_user.id}")
    return {"message": "Tarefa excluída com sucesso"}

@router.post("/{task_id}/complete")
async def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Marcar tarefa como concluída"""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.company_id == current_user.company_id
    ).first()
    
    if not task:
        raise NotFoundError("Tarefa", task_id)
    
    task.status = TaskStatus.completed
    task.completed_at = datetime.utcnow()
    task.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(task)
    
    logger.info(f"Tarefa {task_id} marcada como concluída pelo usuário {current_user.id}")
    return TaskResponse.from_orm(task)

