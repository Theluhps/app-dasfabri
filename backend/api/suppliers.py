from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import models, schemas, auth
from database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Supplier)
def create_supplier(
    supplier: schemas.SupplierCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Criar novo fornecedor"""
    # Verificar se o código já existe
    existing = db.query(models.Supplier).filter(
        models.Supplier.code == supplier.code,
        models.Supplier.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Código do fornecedor já existe")
    
    db_supplier = models.Supplier(
        **supplier.dict(),
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@router.get("/", response_model=List[schemas.Supplier])
def list_suppliers(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[schemas.SupplierStatus] = None,
    country: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar fornecedores com filtros"""
    query = db.query(models.Supplier).filter(
        models.Supplier.company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(models.Supplier.status == status)
    
    if country:
        query = query.filter(models.Supplier.country.ilike(f"%{country}%"))
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            models.Supplier.name.ilike(search_filter) |
            models.Supplier.code.ilike(search_filter) |
            models.Supplier.email.ilike(search_filter) |
            models.Supplier.products.ilike(search_filter)
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/{supplier_id}", response_model=schemas.Supplier)
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter detalhes de um fornecedor"""
    supplier = db.query(models.Supplier).filter(
        models.Supplier.id == supplier_id,
        models.Supplier.company_id == current_user.company_id
    ).first()
    
    if not supplier:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    return supplier

@router.put("/{supplier_id}", response_model=schemas.Supplier)
def update_supplier(
    supplier_id: int,
    supplier_update: schemas.SupplierCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Atualizar fornecedor"""
    db_supplier = db.query(models.Supplier).filter(
        models.Supplier.id == supplier_id,
        models.Supplier.company_id == current_user.company_id
    ).first()
    
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    # Verificar se o novo código já existe (exceto para o próprio fornecedor)
    if supplier_update.code != db_supplier.code:
        existing = db.query(models.Supplier).filter(
            models.Supplier.code == supplier_update.code,
            models.Supplier.company_id == current_user.company_id,
            models.Supplier.id != supplier_id
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Código do fornecedor já existe")
    
    # Atualizar campos
    for field, value in supplier_update.dict().items():
        setattr(db_supplier, field, value)
    
    db_supplier.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@router.delete("/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Excluir fornecedor"""
    supplier = db.query(models.Supplier).filter(
        models.Supplier.id == supplier_id,
        models.Supplier.company_id == current_user.company_id
    ).first()
    
    if not supplier:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    # Verificar se há processos de importação vinculados
    import_processes = db.query(models.ImportProcess).filter(
        models.ImportProcess.supplier == supplier.name,
        models.ImportProcess.company_id == current_user.company_id
    ).count()
    
    if import_processes > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Não é possível excluir o fornecedor. Existem {import_processes} processos de importação vinculados."
        )
    
    db.delete(supplier)
    db.commit()
    return {"message": "Fornecedor excluído com sucesso"}

@router.get("/{supplier_id}/imports", response_model=List[schemas.ImportProcess])
def get_supplier_imports(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Listar processos de importação de um fornecedor"""
    supplier = db.query(models.Supplier).filter(
        models.Supplier.id == supplier_id,
        models.Supplier.company_id == current_user.company_id
    ).first()
    
    if not supplier:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    imports = db.query(models.ImportProcess).filter(
        models.ImportProcess.supplier == supplier.name,
        models.ImportProcess.company_id == current_user.company_id
    ).all()
    
    return imports

@router.get("/stats/countries")
def get_supplier_countries(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de fornecedores por país"""
    from sqlalchemy import func
    
    countries = db.query(
        models.Supplier.country,
        func.count(models.Supplier.id).label('count')
    ).filter(
        models.Supplier.company_id == current_user.company_id
    ).group_by(models.Supplier.country).all()
    
    return [{"country": country, "count": count} for country, count in countries]

@router.get("/stats/status")
def get_supplier_status_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter estatísticas de fornecedores por status"""
    from sqlalchemy import func
    
    stats = db.query(
        models.Supplier.status,
        func.count(models.Supplier.id).label('count')
    ).filter(
        models.Supplier.company_id == current_user.company_id
    ).group_by(models.Supplier.status).all()
    
    return [{"status": status, "count": count} for status, count in stats] 