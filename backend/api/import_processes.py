from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import models, schemas, auth
from database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.ImportProcess)
def create_import_process(
    process: schemas.ImportProcessCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar novo processo de importação"""
    # Verificar se o número de referência já existe
    existing = db.query(models.ImportProcess).filter(
        models.ImportProcess.reference_number == process.reference_number,
        models.ImportProcess.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Número de referência já existe")
    
    db_process = models.ImportProcess(
        **process.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_process)
    db.commit()
    db.refresh(db_process)
    return db_process

@router.get("/", response_model=List[schemas.ImportProcess])
def list_import_processes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[schemas.ImportStatus] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar processos de importação com filtros"""
    query = db.query(models.ImportProcess).filter(
        models.ImportProcess.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(models.ImportProcess.status == status)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            models.ImportProcess.reference_number.ilike(search_filter) |
            models.ImportProcess.client.ilike(search_filter) |
            models.ImportProcess.product.ilike(search_filter) |
            models.ImportProcess.supplier.ilike(search_filter)
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/{process_id}", response_model=schemas.ImportProcess)
def get_import_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de um processo de importação"""
    process = db.query(models.ImportProcess).filter(
        models.ImportProcess.id == process_id,
        models.ImportProcess.company_id == current_user.company_id
    ).first()
    
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    
    return process

@router.put("/{process_id}", response_model=schemas.ImportProcess)
def update_import_process(
    process_id: int,
    process_update: schemas.ImportProcessUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar processo de importação"""
    db_process = db.query(models.ImportProcess).filter(
        models.ImportProcess.id == process_id,
        models.ImportProcess.company_id == current_user.company_id
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
    return db_process

@router.delete("/{process_id}")
def delete_import_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir processo de importação"""
    process = db.query(models.ImportProcess).filter(
        models.ImportProcess.id == process_id,
        models.ImportProcess.company_id == current_user.company_id
    ).first()
    
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    
    db.delete(process)
    db.commit()
    return {"message": "Processo excluído com sucesso"}

@router.get("/{process_id}/documents", response_model=List[schemas.ImportDocument])
def get_process_documents(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar documentos de um processo de importação"""
    # Verificar se o processo existe e pertence à empresa
    process = db.query(models.ImportProcess).filter(
        models.ImportProcess.id == process_id,
        models.ImportProcess.company_id == current_user.company_id
    ).first()
    
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    
    documents = db.query(models.ImportDocument).filter(
        models.ImportDocument.import_process_id == process_id,
        models.ImportDocument.company_id == current_user.company_id
    ).all()
    
    return documents

@router.get("/stats/summary")
def get_import_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas resumidas de importação"""
    total = db.query(models.ImportProcess).filter(
        models.ImportProcess.company_id == current_user.company_id
    ).count()
    
    pending = db.query(models.ImportProcess).filter(
        models.ImportProcess.company_id == current_user.company_id,
        models.ImportProcess.status == models.ImportStatus.pending
    ).count()
    
    in_progress = db.query(models.ImportProcess).filter(
        models.ImportProcess.company_id == current_user.company_id,
        models.ImportProcess.status == models.ImportStatus.in_progress
    ).count()
    
    completed = db.query(models.ImportProcess).filter(
        models.ImportProcess.company_id == current_user.company_id,
        models.ImportProcess.status == models.ImportStatus.completed
    ).count()
    
    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "completed": completed,
        "cancelled": total - pending - in_progress - completed
    } 