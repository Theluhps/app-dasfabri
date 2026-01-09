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

@router.post("/", response_model=schemas.ExportProcess)
def create_export_process(
    process: schemas.ExportProcessCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar novo processo de exportação"""
    # Verificar se o número de referência já existe
    existing = db.query(models.ExportProcess).filter(
        models.ExportProcess.reference_number == process.reference_number,
        models.ExportProcess.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Número de referência já existe")
    
    db_process = models.ExportProcess(
        **process.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_process)
    db.commit()
    db.refresh(db_process)
    return db_process

@router.get("/", response_model=List[schemas.ExportProcess])
def list_export_processes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[schemas.ExportStatus] = None,
    destination_country: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar processos de exportação com filtros"""
    query = db.query(models.ExportProcess).filter(
        models.ExportProcess.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(models.ExportProcess.status == status)
    
    if destination_country:
        query = query.filter(models.ExportProcess.destination_country.ilike(f"%{destination_country}%"))
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            models.ExportProcess.reference_number.ilike(search_filter) |
            models.ExportProcess.client.ilike(search_filter) |
            models.ExportProcess.product.ilike(search_filter) |
            models.ExportProcess.destination.ilike(search_filter)
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/{process_id}", response_model=schemas.ExportProcess)
def get_export_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de um processo de exportação"""
    process = db.query(models.ExportProcess).filter(
        models.ExportProcess.id == process_id,
        models.ExportProcess.company_id == current_user.company_id
    ).first()
    
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    
    return process

@router.put("/{process_id}", response_model=schemas.ExportProcess)
def update_export_process(
    process_id: int,
    process_update: schemas.ExportProcessUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar processo de exportação"""
    db_process = db.query(models.ExportProcess).filter(
        models.ExportProcess.id == process_id,
        models.ExportProcess.company_id == current_user.company_id
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
def delete_export_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir processo de exportação"""
    process = db.query(models.ExportProcess).filter(
        models.ExportProcess.id == process_id,
        models.ExportProcess.company_id == current_user.company_id
    ).first()
    
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    
    db.delete(process)
    db.commit()
    return {"message": "Processo excluído com sucesso"}

@router.get("/stats/summary")
def get_export_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas resumidas de exportação"""
    total = db.query(models.ExportProcess).filter(
        models.ExportProcess.company_id == current_user.company_id
    ).count()
    
    pending = db.query(models.ExportProcess).filter(
        models.ExportProcess.company_id == current_user.company_id,
        models.ExportProcess.status == models.ExportStatus.pending
    ).count()
    
    in_progress = db.query(models.ExportProcess).filter(
        models.ExportProcess.company_id == current_user.company_id,
        models.ExportProcess.status == models.ExportStatus.in_progress
    ).count()
    
    shipped = db.query(models.ExportProcess).filter(
        models.ExportProcess.company_id == current_user.company_id,
        models.ExportProcess.status == models.ExportStatus.shipped
    ).count()
    
    delivered = db.query(models.ExportProcess).filter(
        models.ExportProcess.company_id == current_user.company_id,
        models.ExportProcess.status == models.ExportStatus.delivered
    ).count()
    
    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "shipped": shipped,
        "delivered": delivered,
        "cancelled": total - pending - in_progress - shipped - delivered
    }

@router.get("/stats/destinations")
def get_export_destinations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de exportação por destino"""
    from sqlalchemy import func
    
    destinations = db.query(
        models.ExportProcess.destination_country,
        func.count(models.ExportProcess.id).label('count')
    ).filter(
        models.ExportProcess.company_id == current_user.company_id
    ).group_by(models.ExportProcess.destination_country).all()
    
    return [{"country": country, "count": count} for country, count in destinations] 