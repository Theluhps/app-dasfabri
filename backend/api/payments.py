from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
import models, schemas, auth
from database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Payment)
def create_payment(
    payment: schemas.PaymentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar novo pagamento"""
    # Verificar se o número do pagamento já existe
    existing = db.query(models.Payment).filter(
        models.Payment.payment_number == payment.payment_number,
        models.Payment.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Número do pagamento já existe")
    
    db_payment = models.Payment(
        **payment.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/", response_model=List[schemas.Payment])
def list_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[schemas.PaymentStatus] = None,
    payment_type: Optional[schemas.PaymentType] = None,
    currency: Optional[str] = None,
    due_date_from: Optional[date] = None,
    due_date_to: Optional[date] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar pagamentos com filtros"""
    query = db.query(models.Payment).filter(
        models.Payment.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(models.Payment.status == status)
    
    if payment_type:
        query = query.filter(models.Payment.payment_type == payment_type)
    
    if currency:
        query = query.filter(models.Payment.currency == currency)
    
    if due_date_from:
        query = query.filter(models.Payment.due_date >= due_date_from)
    
    if due_date_to:
        query = query.filter(models.Payment.due_date <= due_date_to)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            models.Payment.payment_number.ilike(search_filter) |
            models.Payment.description.ilike(search_filter)
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/{payment_id}", response_model=schemas.Payment)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de um pagamento"""
    payment = db.query(models.Payment).filter(
        models.Payment.id == payment_id,
        models.Payment.company_id == current_user.company_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    
    return payment

@router.put("/{payment_id}", response_model=schemas.Payment)
def update_payment(
    payment_id: int,
    payment_update: schemas.PaymentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar pagamento"""
    db_payment = db.query(models.Payment).filter(
        models.Payment.id == payment_id,
        models.Payment.company_id == current_user.company_id
    ).first()
    
    if not db_payment:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    
    # Atualizar apenas campos fornecidos
    update_data = payment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_payment, field, value)
    
    db_payment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.delete("/{payment_id}")
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir pagamento"""
    payment = db.query(models.Payment).filter(
        models.Payment.id == payment_id,
        models.Payment.company_id == current_user.company_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    
    db.delete(payment)
    db.commit()
    return {"message": "Pagamento excluído com sucesso"}

@router.put("/{payment_id}/mark-paid")
def mark_payment_as_paid(
    payment_id: int,
    payment_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Marcar pagamento como pago"""
    payment = db.query(models.Payment).filter(
        models.Payment.id == payment_id,
        models.Payment.company_id == current_user.company_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    
    payment.status = models.PaymentStatus.paid
    payment.payment_date = payment_date or datetime.utcnow()
    payment.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Pagamento marcado como pago"}

@router.get("/stats/summary")
def get_payment_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas resumidas de pagamentos"""
    total = db.query(models.Payment).filter(
        models.Payment.company_id == current_user.company_id
    ).count()
    
    pending = db.query(models.Payment).filter(
        models.Payment.company_id == current_user.company_id,
        models.Payment.status == models.PaymentStatus.pending
    ).count()
    
    paid = db.query(models.Payment).filter(
        models.Payment.company_id == current_user.company_id,
        models.Payment.status == models.PaymentStatus.paid
    ).count()
    
    overdue = db.query(models.Payment).filter(
        models.Payment.company_id == current_user.company_id,
        models.Payment.status == models.PaymentStatus.overdue
    ).count()
    
    # Calcular valores totais
    total_amount = db.query(models.Payment.amount).filter(
        models.Payment.company_id == current_user.company_id
    ).all()
    total_value = sum([amount[0] for amount in total_amount]) if total_amount else 0
    
    pending_amount = db.query(models.Payment.amount).filter(
        models.Payment.company_id == current_user.company_id,
        models.Payment.status == models.PaymentStatus.pending
    ).all()
    pending_value = sum([amount[0] for amount in pending_amount]) if pending_amount else 0
    
    return {
        "total": total,
        "pending": pending,
        "paid": paid,
        "overdue": overdue,
        "total_value": total_value,
        "pending_value": pending_value
    }

@router.get("/stats/by-type")
def get_payment_type_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de pagamentos por tipo"""
    from sqlalchemy import func
    
    stats = db.query(
        models.Payment.payment_type,
        func.count(models.Payment.id).label('count'),
        func.sum(models.Payment.amount).label('total_amount')
    ).filter(
        models.Payment.company_id == current_user.company_id
    ).group_by(models.Payment.payment_type).all()
    
    return [
        {
            "payment_type": payment_type,
            "count": count,
            "total_amount": float(total_amount) if total_amount else 0
        }
        for payment_type, count, total_amount in stats
    ]

@router.get("/overdue")
def get_overdue_payments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar pagamentos vencidos"""
    overdue_payments = db.query(models.Payment).filter(
        models.Payment.company_id == current_user.company_id,
        models.Payment.status == models.PaymentStatus.pending,
        models.Payment.due_date < datetime.utcnow().date()
    ).all()
    
    return overdue_payments 