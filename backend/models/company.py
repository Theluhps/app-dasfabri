from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class CompanyStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"

class Company(Base):
    __tablename__ = 'companies'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    cnpj = Column(String, unique=True, nullable=False)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String, default="Brasil")
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    type = Column(String)  # trading, importer, exporter, etc.
    segment = Column(String)  # industry segment
    status = Column(Enum(CompanyStatus), default=CompanyStatus.active)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="company")
    access_requests = relationship("AccessRequest", back_populates="company")
    import_processes = relationship("ImportProcess", back_populates="company")
    export_processes = relationship("ExportProcess", back_populates="company")
    suppliers = relationship("Supplier", back_populates="company")
    clients = relationship("Client", back_populates="company")
    payments = relationship("Payment", back_populates="company")
    exchange_rates = relationship("ExchangeRate", back_populates="company")
    containers = relationship("Container", back_populates="company")
    purchase_orders = relationship("PurchaseOrder", back_populates="company")
    workflows = relationship("Workflow", back_populates="company")
    approvals = relationship("Approval", back_populates="company")
    import_documents = relationship("ImportDocument", back_populates="company") 