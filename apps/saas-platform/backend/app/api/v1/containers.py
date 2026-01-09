from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from app.models import User, Company, ImportProcess, ExportProcess, Supplier, Client, Payment, ExchangeRate, Container, PurchaseOrder, Workflow, Approval, AccessRequest
from app.schemas import *
from app.core.security import authenticate_user, get_current_user, create_access_token, get_password_hash
from app.core.database import get_db
from app.core.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Container)
def create_container(
    container: schemas.ContainerCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar novo container"""
    # Verificar se o número do container já existe
    existing = db.query(models.Container).filter(
        models.Container.container_number == container.container_number,
        models.Container.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Número do container já existe")
    
    db_container = models.Container(
        **container.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_container)
    db.commit()
    db.refresh(db_container)
    return db_container

@router.get("/", response_model=List[schemas.Container])
def list_containers(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[schemas.ContainerStatus] = None,
    container_type: Optional[schemas.ContainerType] = None,
    port: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar containers com filtros"""
    query = db.query(models.Container).filter(
        models.Container.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(models.Container.status == status)
    
    if container_type:
        query = query.filter(models.Container.container_type == container_type)
    
    if port:
        query = query.filter(models.Container.port.ilike(f"%{port}%"))
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            models.Container.container_number.ilike(search_filter) |
            models.Container.shipping_line.ilike(search_filter) |
            models.Container.port.ilike(search_filter)
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/{container_id}", response_model=schemas.Container)
def get_container(
    container_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de um container"""
    container = db.query(models.Container).filter(
        models.Container.id == container_id,
        models.Container.company_id == current_user.company_id
    ).first()
    
    if not container:
        raise HTTPException(status_code=404, detail="Container não encontrado")
    
    return container

@router.put("/{container_id}", response_model=schemas.Container)
def update_container(
    container_id: int,
    container_update: schemas.ContainerUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar container"""
    db_container = db.query(models.Container).filter(
        models.Container.id == container_id,
        models.Container.company_id == current_user.company_id
    ).first()
    
    if not db_container:
        raise HTTPException(status_code=404, detail="Container não encontrado")
    
    # Atualizar apenas campos fornecidos
    update_data = container_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_container, field, value)
    
    db_container.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_container)
    return db_container

@router.delete("/{container_id}")
def delete_container(
    container_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir container"""
    container = db.query(models.Container).filter(
        models.Container.id == container_id,
        models.Container.company_id == current_user.company_id
    ).first()
    
    if not container:
        raise HTTPException(status_code=404, detail="Container não encontrado")
    
    db.delete(container)
    db.commit()
    return {"message": "Container excluído com sucesso"}

@router.put("/{container_id}/track")
def update_container_tracking(
    container_id: int,
    tracking_update: schemas.ContainerTrackingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar informações de rastreamento do container"""
    container = db.query(models.Container).filter(
        models.Container.id == container_id,
        models.Container.company_id == current_user.company_id
    ).first()
    
    if not container:
        raise HTTPException(status_code=404, detail="Container não encontrado")
    
    # Atualizar campos de rastreamento
    if tracking_update.current_location:
        container.current_location = tracking_update.current_location
    
    if tracking_update.status:
        container.status = tracking_update.status
    
    if tracking_update.estimated_arrival:
        container.estimated_arrival = tracking_update.estimated_arrival
    
    if tracking_update.actual_arrival:
        container.actual_arrival = tracking_update.actual_arrival
    
    if tracking_update.notes:
        container.notes = tracking_update.notes
    
    container.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Rastreamento atualizado com sucesso"}

@router.get("/stats/summary")
def get_container_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas resumidas de containers"""
    total = db.query(models.Container).filter(
        models.Container.company_id == current_user.company_id
    ).count()
    
    in_transit = db.query(models.Container).filter(
        models.Container.company_id == current_user.company_id,
        models.Container.status == models.ContainerStatus.in_transit
    ).count()
    
    at_port = db.query(models.Container).filter(
        models.Container.company_id == current_user.company_id,
        models.Container.status == models.ContainerStatus.at_port
    ).count()
    
    delivered = db.query(models.Container).filter(
        models.Container.company_id == current_user.company_id,
        models.Container.status == models.ContainerStatus.delivered
    ).count()
    
    return {
        "total": total,
        "in_transit": in_transit,
        "at_port": at_port,
        "delivered": delivered,
        "other": total - in_transit - at_port - delivered
    }

@router.get("/stats/by-type")
def get_container_type_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de containers por tipo"""
    from sqlalchemy import func
    
    stats = db.query(
        models.Container.container_type,
        func.count(models.Container.id).label('count')
    ).filter(
        models.Container.company_id == current_user.company_id
    ).group_by(models.Container.container_type).all()
    
    return [{"container_type": container_type, "count": count} for container_type, count in stats]

@router.get("/stats/ports")
def get_container_port_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de containers por porto"""
    from sqlalchemy import func
    
    ports = db.query(
        models.Container.port,
        func.count(models.Container.id).label('count')
    ).filter(
        models.Container.company_id == current_user.company_id
    ).group_by(models.Container.port).all()
    
    return [{"port": port, "count": count} for port, count in ports]

@router.get("/tracking/{container_number}")
def get_container_tracking(
    container_number: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter informações de rastreamento por número do container"""
    container = db.query(models.Container).filter(
        models.Container.container_number == container_number,
        models.Container.company_id == current_user.company_id
    ).first()
    
    if not container:
        raise HTTPException(status_code=404, detail="Container não encontrado")
    
    return {
        "container_number": container.container_number,
        "status": container.status,
        "current_location": container.current_location,
        "estimated_arrival": container.estimated_arrival,
        "actual_arrival": container.actual_arrival,
        "shipping_line": container.shipping_line,
        "port": container.port,
        "notes": container.notes
    } 