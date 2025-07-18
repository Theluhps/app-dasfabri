from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class ClientStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    prospect = "prospect"

class Client(Base):
    __tablename__ = 'clients'
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True)
    tax_id = Column(String)  # Foreign tax ID
    
    # Contact Information
    email = Column(String)
    phone = Column(String)
    website = Column(String)
    
    # Address
    address = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String, nullable=False)
    postal_code = Column(String)
    
    # Business Information
    business_type = Column(String)
    industry = Column(String)
    products_interest = Column(Text)  # Products they're interested in
    
    # Financial Information
    payment_terms = Column(String)
    credit_limit = Column(String)
    currency = Column(String, default="USD")
    
    # Status and Notes
    status = Column(Enum(ClientStatus), default=ClientStatus.prospect)
    notes = Column(Text)
    
    # Relationships
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="clients")
    created_by_user = relationship("User", back_populates="created_clients") 