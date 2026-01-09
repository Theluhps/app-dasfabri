"""
Modelo para Warehouse Management
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class WarehouseStatus(str, enum.Enum):
    """Status do armazém"""
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"

class StockMovementType(str, enum.Enum):
    """Tipo de movimentação de estoque"""
    entry = "entry"  # Entrada
    exit = "exit"  # Saída
    transfer = "transfer"  # Transferência
    adjustment = "adjustment"  # Ajuste
    loss = "loss"  # Perda

class Warehouse(Base):
    """Armazém"""
    __tablename__ = 'warehouses'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Identificação
    code = Column(String, nullable=False, unique=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Localização
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    latitude = Column(Numeric(10, 7), nullable=True)
    longitude = Column(Numeric(10, 7), nullable=True)
    
    # Capacidade
    total_capacity = Column(Numeric(15, 2), nullable=True)  # Capacidade total (m³ ou kg)
    used_capacity = Column(Numeric(15, 2), default=0)  # Capacidade utilizada
    
    # Status
    status = Column(Enum(WarehouseStatus), default=WarehouseStatus.active)
    
    # Relacionamentos
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="warehouses")
    inventory_items = relationship("InventoryItem", back_populates="warehouse")
    stock_movements = relationship("StockMovement", back_populates="warehouse")

class InventoryItem(Base):
    """Item de inventário"""
    __tablename__ = 'inventory_items'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relacionamentos
    warehouse_id = Column(Integer, ForeignKey('warehouses.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=True)
    import_process_id = Column(Integer, ForeignKey('import_processes.id'), nullable=True)
    export_process_id = Column(Integer, ForeignKey('export_processes.id'), nullable=True)
    
    # Quantidade
    quantity = Column(Numeric(15, 3), nullable=False, default=0)
    unit = Column(String, nullable=True)
    
    # Localização no armazém
    location = Column(String, nullable=True)  # Ex: "A-12-3" (corredor-prateleira-posição)
    batch_number = Column(String, nullable=True)
    
    # Status
    is_available = Column(Boolean, default=True)
    is_reserved = Column(Boolean, default=False)
    
    # Datas
    entry_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    expiration_date = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    warehouse = relationship("Warehouse", back_populates="inventory_items")
    product = relationship("Product")
    import_process = relationship("ImportProcess")
    export_process = relationship("ExportProcess")
    movements = relationship("StockMovement", back_populates="inventory_item")

class StockMovement(Base):
    """Movimentação de estoque"""
    __tablename__ = 'stock_movements'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Tipo de movimentação
    movement_type = Column(Enum(StockMovementType), nullable=False)
    
    # Relacionamentos
    warehouse_id = Column(Integer, ForeignKey('warehouses.id'), nullable=False)
    inventory_item_id = Column(Integer, ForeignKey('inventory_items.id'), nullable=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=True)
    import_process_id = Column(Integer, ForeignKey('import_processes.id'), nullable=True)
    export_process_id = Column(Integer, ForeignKey('export_processes.id'), nullable=True)
    
    # Quantidade
    quantity = Column(Numeric(15, 3), nullable=False)
    unit = Column(String, nullable=True)
    
    # Informações adicionais
    reference_number = Column(String, nullable=True)  # Número de referência (NF, etc)
    notes = Column(Text, nullable=True)
    
    # Usuário responsável
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    movement_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    warehouse = relationship("Warehouse", back_populates="stock_movements")
    inventory_item = relationship("InventoryItem", back_populates="movements")
    product = relationship("Product")
    import_process = relationship("ImportProcess")
    export_process = relationship("ExportProcess")
    created_by_user = relationship("User")

