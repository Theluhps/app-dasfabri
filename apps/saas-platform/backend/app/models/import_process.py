from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class ImportStatus(str, enum.Enum):
    draft = "draft"
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class ImportType(str, enum.Enum):
    direct = "direct"
    indirect = "indirect"
    temporary = "temporary"

class ShippingMethod(str, enum.Enum):
    sea = "sea"
    air = "air"
    land = "land"

class Incoterm(str, enum.Enum):
    EXW = "EXW"
    FCA = "FCA"
    CPT = "CPT"
    CIP = "CIP"
    DAP = "DAP"
    DPU = "DPU"
    DDP = "DDP"
    FAS = "FAS"
    FOB = "FOB"
    CFR = "CFR"
    CIF = "CIF"

class ImportProcess(Base):
    __tablename__ = 'import_processes'
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    reference_number = Column(String, unique=True, nullable=False, index=True)
    client = Column(String, nullable=False)
    product = Column(String, nullable=False)
    description = Column(Text)
    
    # Origin and Destination
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    
    # Supplier Information
    supplier = Column(String, nullable=False)
    supplier_country = Column(String)
    
    # Technical Information
    ncm = Column(String)  # Nomenclatura Comum do Mercosul
    product_id = Column(Integer, ForeignKey('products.id'), nullable=True)  # Referência ao catálogo
    invoice_value = Column(Float)
    currency = Column(String, default="USD")
    
    # Import Details
    import_type = Column(Enum(ImportType), default=ImportType.direct)
    shipping_method = Column(Enum(ShippingMethod), default=ShippingMethod.sea)
    incoterm = Column(Enum(Incoterm), default=Incoterm.FOB)
    
    # Service Providers
    customs_broker = Column(String)
    freight_forwarder = Column(String)
    
    # Dates
    estimated_arrival = Column(DateTime)
    actual_arrival = Column(DateTime)
    customs_clearance_date = Column(DateTime)
    
    # Status and Tracking
    status = Column(Enum(ImportStatus), default=ImportStatus.draft)
    current_step = Column(String)
    
    # Watchlist/Favorites
    is_favorite = Column(Integer, default=0)  # 0 = não favorito, 1 = favorito (por usuário)
    
    # Company and User
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="import_processes")
    created_by_user = relationship("User", back_populates="created_imports")
    documents = relationship("ImportDocument", back_populates="import_process")
    payments = relationship("Payment", back_populates="import_process")
    containers = relationship("Container", back_populates="import_process")
    tracking_events = relationship("TrackingEvent", back_populates="import_process")
    compliance_checks = relationship("ComplianceCheck", back_populates="import_process")
    comments = relationship("Comment", back_populates="import_process")
    drawback_acts = relationship("DrawbackAct", back_populates="import_process")
    product_rel = relationship("Product", foreign_keys=[product_id], overlaps="import_history")
    inventory_items = relationship("InventoryItem", back_populates="import_process")
    stock_movements = relationship("StockMovement", back_populates="import_process")
    tasks = relationship("Task", back_populates="import_process") 