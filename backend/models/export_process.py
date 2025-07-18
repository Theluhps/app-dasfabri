from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class ExportStatus(str, enum.Enum):
    draft = "draft"
    pending = "pending"
    in_progress = "in_progress"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"

class ExportType(str, enum.Enum):
    direct = "direct"
    indirect = "indirect"
    temporary = "temporary"

class ExportProcess(Base):
    __tablename__ = 'export_processes'
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    reference_number = Column(String, unique=True, nullable=False, index=True)
    client = Column(String, nullable=False)
    product = Column(String, nullable=False)
    description = Column(Text)
    
    # Origin and Destination
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    destination_country = Column(String, nullable=False)
    
    # Technical Information
    ncm = Column(String)  # Nomenclatura Comum do Mercosul
    invoice_value = Column(Float)
    currency = Column(String, default="USD")
    quantity = Column(Float)
    unit = Column(String)
    
    # Export Details
    export_type = Column(Enum(ExportType), default=ExportType.direct)
    shipping_method = Column(String, default="sea")
    incoterm = Column(String, default="FOB")
    
    # Service Providers
    freight_forwarder = Column(String)
    customs_broker = Column(String)
    
    # Dates
    estimated_shipment = Column(DateTime)
    actual_shipment = Column(DateTime)
    estimated_arrival = Column(DateTime)
    actual_arrival = Column(DateTime)
    
    # Status and Tracking
    status = Column(Enum(ExportStatus), default=ExportStatus.draft)
    current_step = Column(String)
    
    # Company and User
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="export_processes")
    created_by_user = relationship("User", back_populates="created_exports") 