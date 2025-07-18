from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class POStatus(str, enum.Enum):
    draft = "draft"
    pending = "pending"
    approved = "approved"
    ordered = "ordered"
    received = "received"
    cancelled = "cancelled"

class PurchaseOrder(Base):
    __tablename__ = 'purchase_orders'
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    po_number = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    
    # Supplier Information
    supplier_id = Column(Integer, ForeignKey('suppliers.id'), nullable=False)
    
    # Financial Information
    total_amount = Column(Float)
    currency = Column(String, default="USD")
    payment_terms = Column(String)
    
    # Dates
    order_date = Column(DateTime)
    expected_delivery = Column(DateTime)
    actual_delivery = Column(DateTime)
    
    # Status and Tracking
    status = Column(Enum(POStatus), default=POStatus.draft)
    notes = Column(Text)
    
    # Relationships
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    approved_by = Column(Integer, ForeignKey('users.id'))
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    approved_at = Column(DateTime)
    
    # Relationships
    company = relationship("Company", back_populates="purchase_orders")
    supplier = relationship("Supplier", back_populates="purchase_orders")
    created_by_user = relationship("User", foreign_keys=[created_by], back_populates="created_purchase_orders")
    approved_by_user = relationship("User", foreign_keys=[approved_by], back_populates="approved_purchase_orders")
    items = relationship("POItem", back_populates="purchase_order", cascade="all, delete-orphan") 