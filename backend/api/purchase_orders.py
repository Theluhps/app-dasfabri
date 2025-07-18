from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
import models, schemas, auth
from database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.PurchaseOrder)
def create_purchase_order(
    order: schemas.PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar novo pedido de compra"""
    # Verificar se o número do pedido já existe
    existing = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.po_number == order.po_number,
        models.PurchaseOrder.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Número do pedido já existe")
    
    db_order = models.PurchaseOrder(
        **order.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/", response_model=List[schemas.PurchaseOrder])
def list_purchase_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[schemas.POStatus] = None,
    supplier: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar pedidos de compra com filtros"""
    query = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(models.PurchaseOrder.status == status)
    
    if supplier:
        query = query.filter(models.PurchaseOrder.supplier.ilike(f"%{supplier}%"))
    
    if date_from:
        query = query.filter(models.PurchaseOrder.order_date >= date_from)
    
    if date_to:
        query = query.filter(models.PurchaseOrder.order_date <= date_to)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            models.PurchaseOrder.po_number.ilike(search_filter) |
            models.PurchaseOrder.supplier.ilike(search_filter) |
            models.PurchaseOrder.description.ilike(search_filter)
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/{order_id}", response_model=schemas.PurchaseOrder)
def get_purchase_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de um pedido de compra"""
    order = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.id == order_id,
        models.PurchaseOrder.company_id == current_user.company_id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    return order

@router.put("/{order_id}", response_model=schemas.PurchaseOrder)
def update_purchase_order(
    order_id: int,
    order_update: schemas.PurchaseOrderUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar pedido de compra"""
    db_order = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.id == order_id,
        models.PurchaseOrder.company_id == current_user.company_id
    ).first()
    
    if not db_order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    # Atualizar apenas campos fornecidos
    update_data = order_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_order, field, value)
    
    db_order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_order)
    return db_order

@router.delete("/{order_id}")
def delete_purchase_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir pedido de compra"""
    order = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.id == order_id,
        models.PurchaseOrder.company_id == current_user.company_id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    # Verificar se há itens vinculados
    items_count = db.query(models.POItem).filter(
        models.POItem.purchase_order_id == order_id
    ).count()
    
    if items_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Não é possível excluir o pedido. Existem {items_count} itens vinculados."
        )
    
    db.delete(order)
    db.commit()
    return {"message": "Pedido excluído com sucesso"}

@router.put("/{order_id}/approve")
def approve_purchase_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Aprovar pedido de compra"""
    order = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.id == order_id,
        models.PurchaseOrder.company_id == current_user.company_id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    if order.status != models.POStatus.pending:
        raise HTTPException(status_code=400, detail="Apenas pedidos pendentes podem ser aprovados")
    
    order.status = models.POStatus.approved
    order.approved_by = current_user.id
    order.approved_at = datetime.utcnow()
    order.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Pedido aprovado com sucesso"}

@router.put("/{order_id}/reject")
def reject_purchase_order(
    order_id: int,
    rejection_reason: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Rejeitar pedido de compra"""
    order = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.id == order_id,
        models.PurchaseOrder.company_id == current_user.company_id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    if order.status != models.POStatus.pending:
        raise HTTPException(status_code=400, detail="Apenas pedidos pendentes podem ser rejeitados")
    
    order.status = models.POStatus.rejected
    order.rejection_reason = rejection_reason
    order.rejected_by = current_user.id
    order.rejected_at = datetime.utcnow()
    order.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Pedido rejeitado com sucesso"}

@router.get("/{order_id}/items", response_model=List[schemas.POItem])
def get_order_items(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar itens de um pedido de compra"""
    # Verificar se o pedido existe e pertence à empresa
    order = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.id == order_id,
        models.PurchaseOrder.company_id == current_user.company_id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    items = db.query(models.POItem).filter(
        models.POItem.purchase_order_id == order_id
    ).all()
    
    return items

@router.post("/{order_id}/items", response_model=schemas.POItem)
def add_order_item(
    order_id: int,
    item: schemas.POItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Adicionar item ao pedido de compra"""
    # Verificar se o pedido existe e pertence à empresa
    order = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.id == order_id,
        models.PurchaseOrder.company_id == current_user.company_id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    db_item = models.POItem(
        **item.dict(),
        purchase_order_id=order_id
    )
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/stats/summary")
def get_po_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas resumidas de pedidos de compra"""
    total = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.company_id == current_user.company_id
    ).count()
    
    pending = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.company_id == current_user.company_id,
        models.PurchaseOrder.status == models.POStatus.pending
    ).count()
    
    approved = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.company_id == current_user.company_id,
        models.PurchaseOrder.status == models.POStatus.approved
    ).count()
    
    completed = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.company_id == current_user.company_id,
        models.PurchaseOrder.status == models.POStatus.completed
    ).count()
    
    rejected = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.company_id == current_user.company_id,
        models.PurchaseOrder.status == models.POStatus.rejected
    ).count()
    
    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "completed": completed,
        "rejected": rejected
    }

@router.get("/stats/by-supplier")
def get_po_supplier_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de pedidos por fornecedor"""
    from sqlalchemy import func
    
    suppliers = db.query(
        models.PurchaseOrder.supplier,
        func.count(models.PurchaseOrder.id).label('count')
    ).filter(
        models.PurchaseOrder.company_id == current_user.company_id
    ).group_by(models.PurchaseOrder.supplier).all()
    
    return [{"supplier": supplier, "count": count} for supplier, count in suppliers] 