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

@router.post("/", response_model=schemas.ExchangeRate)
def create_exchange_rate(
    rate: schemas.ExchangeRateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar nova taxa de câmbio"""
    # Verificar se já existe taxa para a mesma data e moedas
    existing = db.query(models.ExchangeRate).filter(
        models.ExchangeRate.from_currency == rate.from_currency,
        models.ExchangeRate.to_currency == rate.to_currency,
        models.ExchangeRate.rate_date == rate.rate_date,
        models.ExchangeRate.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Taxa de câmbio já existe para esta data")
    
    db_rate = models.ExchangeRate(
        **rate.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_rate)
    db.commit()
    db.refresh(db_rate)
    return db_rate

@router.get("/", response_model=List[schemas.ExchangeRate])
def list_exchange_rates(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    from_currency: Optional[str] = None,
    to_currency: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar taxas de câmbio com filtros"""
    query = db.query(models.ExchangeRate).filter(
        models.ExchangeRate.company_id == current_user.company_id
    )
    
    if from_currency:
        query = query.filter(models.ExchangeRate.from_currency == from_currency)
    
    if to_currency:
        query = query.filter(models.ExchangeRate.to_currency == to_currency)
    
    if date_from:
        query = query.filter(models.ExchangeRate.rate_date >= date_from)
    
    if date_to:
        query = query.filter(models.ExchangeRate.rate_date <= date_to)
    
    return query.order_by(models.ExchangeRate.rate_date.desc()).offset(skip).limit(limit).all()

@router.get("/{rate_id}", response_model=schemas.ExchangeRate)
def get_exchange_rate(
    rate_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de uma taxa de câmbio"""
    rate = db.query(models.ExchangeRate).filter(
        models.ExchangeRate.id == rate_id,
        models.ExchangeRate.company_id == current_user.company_id
    ).first()
    
    if not rate:
        raise HTTPException(status_code=404, detail="Taxa de câmbio não encontrada")
    
    return rate

@router.put("/{rate_id}", response_model=schemas.ExchangeRate)
def update_exchange_rate(
    rate_id: int,
    rate_update: schemas.ExchangeRateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar taxa de câmbio"""
    db_rate = db.query(models.ExchangeRate).filter(
        models.ExchangeRate.id == rate_id,
        models.ExchangeRate.company_id == current_user.company_id
    ).first()
    
    if not db_rate:
        raise HTTPException(status_code=404, detail="Taxa de câmbio não encontrada")
    
    # Atualizar campos
    for field, value in rate_update.dict().items():
        setattr(db_rate, field, value)
    
    db_rate.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_rate)
    return db_rate

@router.delete("/{rate_id}")
def delete_exchange_rate(
    rate_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir taxa de câmbio"""
    rate = db.query(models.ExchangeRate).filter(
        models.ExchangeRate.id == rate_id,
        models.ExchangeRate.company_id == current_user.company_id
    ).first()
    
    if not rate:
        raise HTTPException(status_code=404, detail="Taxa de câmbio não encontrada")
    
    db.delete(rate)
    db.commit()
    return {"message": "Taxa de câmbio excluída com sucesso"}

@router.get("/current/{from_currency}/{to_currency}")
def get_current_rate(
    from_currency: str,
    to_currency: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter taxa de câmbio atual"""
    rate = db.query(models.ExchangeRate).filter(
        models.ExchangeRate.from_currency == from_currency,
        models.ExchangeRate.to_currency == to_currency,
        models.ExchangeRate.company_id == current_user.company_id
    ).order_by(models.ExchangeRate.rate_date.desc()).first()
    
    if not rate:
        raise HTTPException(status_code=404, detail="Taxa de câmbio não encontrada")
    
    return {
        "from_currency": rate.from_currency,
        "to_currency": rate.to_currency,
        "rate": rate.rate,
        "rate_date": rate.rate_date,
        "source": rate.source
    }

@router.get("/convert")
def convert_currency(
    amount: float,
    from_currency: str,
    to_currency: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Converter valor entre moedas"""
    rate = db.query(models.ExchangeRate).filter(
        models.ExchangeRate.from_currency == from_currency,
        models.ExchangeRate.to_currency == to_currency,
        models.ExchangeRate.company_id == current_user.company_id
    ).order_by(models.ExchangeRate.rate_date.desc()).first()
    
    if not rate:
        raise HTTPException(status_code=404, detail="Taxa de câmbio não encontrada")
    
    converted_amount = amount * rate.rate
    
    return {
        "original_amount": amount,
        "original_currency": from_currency,
        "converted_amount": converted_amount,
        "target_currency": to_currency,
        "rate": rate.rate,
        "rate_date": rate.rate_date
    }

@router.get("/stats/currencies")
def get_currency_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de moedas"""
    from sqlalchemy import func
    
    currencies = db.query(
        models.ExchangeRate.from_currency,
        models.ExchangeRate.to_currency,
        func.count(models.ExchangeRate.id).label('count')
    ).filter(
        models.ExchangeRate.company_id == current_user.company_id
    ).group_by(models.ExchangeRate.from_currency, models.ExchangeRate.to_currency).all()
    
    return [
        {
            "from_currency": from_curr,
            "to_currency": to_curr,
            "count": count
        }
        for from_curr, to_curr, count in currencies
    ]

@router.get("/latest")
def get_latest_rates(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter as taxas mais recentes para cada par de moedas"""
    from sqlalchemy import func
    
    # Subquery para obter a data mais recente para cada par de moedas
    latest_dates = db.query(
        models.ExchangeRate.from_currency,
        models.ExchangeRate.to_currency,
        func.max(models.ExchangeRate.rate_date).label('max_date')
    ).filter(
        models.ExchangeRate.company_id == current_user.company_id
    ).group_by(models.ExchangeRate.from_currency, models.ExchangeRate.to_currency).subquery()
    
    # Query principal para obter as taxas mais recentes
    latest_rates = db.query(models.ExchangeRate).join(
        latest_dates,
        (models.ExchangeRate.from_currency == latest_dates.c.from_currency) &
        (models.ExchangeRate.to_currency == latest_dates.c.to_currency) &
        (models.ExchangeRate.rate_date == latest_dates.c.max_date)
    ).filter(
        models.ExchangeRate.company_id == current_user.company_id
    ).all()
    
    return latest_rates 