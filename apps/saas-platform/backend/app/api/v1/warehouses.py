"""
Warehouse Management API
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models import (
    User, Company, Warehouse, InventoryItem, StockMovement,
    WarehouseStatus, StockMovementType, Product, ImportProcess, ExportProcess
)
from pydantic import BaseModel
from decimal import Decimal

router = APIRouter()

# Schemas
class WarehouseCreate(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    total_capacity: Optional[Decimal] = None

class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    status: Optional[WarehouseStatus] = None
    total_capacity: Optional[Decimal] = None

class WarehouseResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    status: str
    total_capacity: Optional[Decimal] = None
    used_capacity: Decimal = Decimal(0)
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        # Ignorar campos extras que não estão no schema
        extra = "ignore"

class InventoryItemCreate(BaseModel):
    product_id: Optional[int] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    quantity: Decimal
    unit: Optional[str] = None
    location: Optional[str] = None
    batch_number: Optional[str] = None
    expiration_date: Optional[datetime] = None

class InventoryItemResponse(BaseModel):
    id: int
    warehouse_id: int
    product_id: Optional[int] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    quantity: Decimal
    unit: Optional[str] = None
    location: Optional[str] = None
    batch_number: Optional[str] = None
    is_available: bool = True
    is_reserved: bool = False
    entry_date: datetime
    expiration_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class StockMovementCreate(BaseModel):
    movement_type: StockMovementType
    inventory_item_id: Optional[int] = None
    product_id: Optional[int] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    quantity: Decimal
    unit: Optional[str] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None

class StockMovementResponse(BaseModel):
    id: int
    movement_type: str
    warehouse_id: int
    inventory_item_id: Optional[int] = None
    product_id: Optional[int] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    quantity: Decimal
    unit: Optional[str] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None
    movement_date: datetime
    created_at: datetime
    
    class Config:
        orm_mode = True

@router.get("/", response_model=List[WarehouseResponse])
async def list_warehouses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[WarehouseStatus] = None
):
    """Listar armazéns"""
    company_id = current_user.company_id
    
    query = db.query(Warehouse).filter(
        Warehouse.company_id == company_id
    )
    
    if status:
        query = query.filter(Warehouse.status == status)
    
    warehouses = query.order_by(Warehouse.created_at.desc()).all()
    return warehouses

@router.post("/", response_model=WarehouseResponse)
async def create_warehouse(
    warehouse_data: WarehouseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar novo armazém"""
    company_id = current_user.company_id
    
    # Verificar se código já existe
    existing = db.query(Warehouse).filter(
        Warehouse.code == warehouse_data.code
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Código de armazém já existe")
    
    new_warehouse = Warehouse(
        code=warehouse_data.code,
        name=warehouse_data.name,
        description=warehouse_data.description,
        address=warehouse_data.address,
        city=warehouse_data.city,
        state=warehouse_data.state,
        country=warehouse_data.country,
        postal_code=warehouse_data.postal_code,
        latitude=warehouse_data.latitude,
        longitude=warehouse_data.longitude,
        total_capacity=warehouse_data.total_capacity,
        used_capacity=Decimal(0),
        status=WarehouseStatus.active,
        company_id=company_id
    )
    
    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)
    
    return WarehouseResponse.from_orm(new_warehouse)

@router.get("/{warehouse_id}", response_model=WarehouseResponse)
async def get_warehouse(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um armazém"""
    company_id = current_user.company_id
    
    warehouse = db.query(Warehouse).filter(
        and_(
            Warehouse.id == warehouse_id,
            Warehouse.company_id == company_id
        )
    ).first()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail="Armazém não encontrado")
    
    return WarehouseResponse.from_orm(warehouse)

@router.get("/{warehouse_id}/inventory", response_model=List[InventoryItemResponse])
async def get_warehouse_inventory(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter inventário de um armazém"""
    company_id = current_user.company_id
    
    warehouse = db.query(Warehouse).filter(
        and_(
            Warehouse.id == warehouse_id,
            Warehouse.company_id == company_id
        )
    ).first()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail="Armazém não encontrado")
    
    items = db.query(InventoryItem).filter(
        and_(
            InventoryItem.warehouse_id == warehouse_id,
            InventoryItem.is_available == True
        )
    ).all()
    
    return items

@router.post("/{warehouse_id}/inventory", response_model=InventoryItemResponse)
async def add_inventory_item(
    warehouse_id: int,
    item_data: InventoryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Adicionar item ao inventário"""
    company_id = current_user.company_id
    
    warehouse = db.query(Warehouse).filter(
        and_(
            Warehouse.id == warehouse_id,
            Warehouse.company_id == company_id
        )
    ).first()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail="Armazém não encontrado")
    
    # Validar processos se fornecidos
    if item_data.import_process_id:
        process = db.query(ImportProcess).filter(
            and_(
                ImportProcess.id == item_data.import_process_id,
                ImportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de importação não encontrado")
    
    if item_data.export_process_id:
        process = db.query(ExportProcess).filter(
            and_(
                ExportProcess.id == item_data.export_process_id,
                ExportProcess.company_id == company_id
            )
        ).first()
        if not process:
            raise HTTPException(status_code=404, detail="Processo de exportação não encontrado")
    
    new_item = InventoryItem(
        warehouse_id=warehouse_id,
        product_id=item_data.product_id,
        import_process_id=item_data.import_process_id,
        export_process_id=item_data.export_process_id,
        quantity=item_data.quantity,
        unit=item_data.unit,
        location=item_data.location,
        batch_number=item_data.batch_number,
        expiration_date=item_data.expiration_date,
        is_available=True,
        is_reserved=False
    )
    
    db.add(new_item)
    
    # Atualizar capacidade utilizada
    warehouse.used_capacity = (warehouse.used_capacity or Decimal(0)) + item_data.quantity
    
    db.commit()
    db.refresh(new_item)
    
    return new_item

@router.post("/{warehouse_id}/movements", response_model=StockMovementResponse)
async def create_stock_movement(
    warehouse_id: int,
    movement_data: StockMovementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar movimentação de estoque"""
    company_id = current_user.company_id
    
    warehouse = db.query(Warehouse).filter(
        and_(
            Warehouse.id == warehouse_id,
            Warehouse.company_id == company_id
        )
    ).first()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail="Armazém não encontrado")
    
    # Validar item de inventário se fornecido
    if movement_data.inventory_item_id:
        item = db.query(InventoryItem).filter(
            InventoryItem.id == movement_data.inventory_item_id
        ).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item de inventário não encontrado")
        
        # Atualizar quantidade do item
        if movement_data.movement_type == StockMovementType.entry:
            item.quantity = (item.quantity or Decimal(0)) + movement_data.quantity
        elif movement_data.movement_type == StockMovementType.exit:
            if (item.quantity or Decimal(0)) < movement_data.quantity:
                raise HTTPException(status_code=400, detail="Quantidade insuficiente em estoque")
            item.quantity = (item.quantity or Decimal(0)) - movement_data.quantity
    
    new_movement = StockMovement(
        movement_type=movement_data.movement_type,
        warehouse_id=warehouse_id,
        inventory_item_id=movement_data.inventory_item_id,
        product_id=movement_data.product_id,
        import_process_id=movement_data.import_process_id,
        export_process_id=movement_data.export_process_id,
        quantity=movement_data.quantity,
        unit=movement_data.unit,
        reference_number=movement_data.reference_number,
        notes=movement_data.notes,
        created_by=current_user.id,
        movement_date=datetime.utcnow()
    )
    
    db.add(new_movement)
    db.commit()
    db.refresh(new_movement)
    
    return new_movement

@router.get("/{warehouse_id}/movements", response_model=List[StockMovementResponse])
async def get_warehouse_movements(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    movement_type: Optional[StockMovementType] = None,
    limit: int = Query(50, le=100)
):
    """Obter movimentações de um armazém"""
    company_id = current_user.company_id
    
    warehouse = db.query(Warehouse).filter(
        and_(
            Warehouse.id == warehouse_id,
            Warehouse.company_id == company_id
        )
    ).first()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail="Armazém não encontrado")
    
    query = db.query(StockMovement).filter(
        StockMovement.warehouse_id == warehouse_id
    )
    
    if movement_type:
        query = query.filter(StockMovement.movement_type == movement_type)
    
    movements = query.order_by(StockMovement.movement_date.desc()).limit(limit).all()
    return movements

