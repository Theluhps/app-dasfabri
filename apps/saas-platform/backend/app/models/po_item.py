from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base

class POItem(Base):
    __tablename__ = 'po_items'
    id = Column(Integer, primary_key=True, index=True)
    
    # Item Information
    product_code = Column(String, nullable=False)
    product_name = Column(String, nullable=False)
    description = Column(Text)
    
    # Quantities and Pricing
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)  # e.g., "pcs", "kg", "m"
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    # Technical Information
    specifications = Column(Text)
    ncm = Column(String)  # Nomenclatura Comum do Mercosul
    
    # Delivery Information
    expected_delivery = Column(DateTime)
    actual_delivery = Column(DateTime)
    
    # Relationships
    purchase_order_id = Column(Integer, ForeignKey('purchase_orders.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    purchase_order = relationship("PurchaseOrder", back_populates="items") 