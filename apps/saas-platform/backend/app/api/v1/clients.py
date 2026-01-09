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

@router.post("/", response_model=schemas.Client)
def create_client(
    client: schemas.ClientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar novo cliente"""
    # Verificar se o código já existe
    existing = db.query(models.Client).filter(
        models.Client.code == client.code,
        models.Client.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Código do cliente já existe")
    
    db_client = models.Client(
        **client.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.get("/", response_model=List[schemas.Client])
def list_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[schemas.ClientStatus] = None,
    country: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar clientes com filtros"""
    query = db.query(models.Client).filter(
        models.Client.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(models.Client.status == status)
    
    if country:
        query = query.filter(models.Client.country.ilike(f"%{country}%"))
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            models.Client.name.ilike(search_filter) |
            models.Client.code.ilike(search_filter) |
            models.Client.email.ilike(search_filter) |
            models.Client.products_interest.ilike(search_filter)
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/{client_id}", response_model=schemas.Client)
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de um cliente"""
    client = db.query(models.Client).filter(
        models.Client.id == client_id,
        models.Client.company_id == current_user.company_id
    ).first()
    
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    return client

@router.put("/{client_id}", response_model=schemas.Client)
def update_client(
    client_id: int,
    client_update: schemas.ClientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar cliente"""
    db_client = db.query(models.Client).filter(
        models.Client.id == client_id,
        models.Client.company_id == current_user.company_id
    ).first()
    
    if not db_client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    # Verificar se o novo código já existe (exceto para o próprio cliente)
    if client_update.code != db_client.code:
        existing = db.query(models.Client).filter(
            models.Client.code == client_update.code,
            models.Client.company_id == current_user.company_id,
            models.Client.id != client_id
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Código do cliente já existe")
    
    # Atualizar campos
    for field, value in client_update.dict().items():
        setattr(db_client, field, value)
    
    db_client.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_client)
    return db_client

@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir cliente"""
    client = db.query(models.Client).filter(
        models.Client.id == client_id,
        models.Client.company_id == current_user.company_id
    ).first()
    
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    # Verificar se há processos de exportação vinculados
    export_processes = db.query(models.ExportProcess).filter(
        models.ExportProcess.client == client.name,
        models.ExportProcess.company_id == current_user.company_id
    ).count()
    
    if export_processes > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Não é possível excluir o cliente. Existem {export_processes} processos de exportação vinculados."
        )
    
    db.delete(client)
    db.commit()
    return {"message": "Cliente excluído com sucesso"}

@router.get("/{client_id}/exports", response_model=List[schemas.ExportProcess])
def get_client_exports(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar processos de exportação de um cliente"""
    client = db.query(models.Client).filter(
        models.Client.id == client_id,
        models.Client.company_id == current_user.company_id
    ).first()
    
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    exports = db.query(models.ExportProcess).filter(
        models.ExportProcess.client == client.name,
        models.ExportProcess.company_id == current_user.company_id
    ).all()
    
    return exports

@router.get("/stats/countries")
def get_client_countries(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de clientes por país"""
    from sqlalchemy import func
    
    countries = db.query(
        models.Client.country,
        func.count(models.Client.id).label('count')
    ).filter(
        models.Client.company_id == current_user.company_id
    ).group_by(models.Client.country).all()
    
    return [{"country": country, "count": count} for country, count in countries]

@router.get("/stats/status")
def get_client_status_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de clientes por status"""
    from sqlalchemy import func
    
    stats = db.query(
        models.Client.status,
        func.count(models.Client.id).label('count')
    ).filter(
        models.Client.company_id == current_user.company_id
    ).group_by(models.Client.status).all()
    
    return [{"status": status, "count": count} for status, count in stats] 