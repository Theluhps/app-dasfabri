from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    paid = "paid"
    overdue = "overdue"
    cancelled = "cancelled"

class PaymentType(str, enum.Enum):
    import_payment = "import_payment"
    export_payment = "export_payment"
    customs_duty = "customs_duty"
    freight = "freight"
    insurance = "insurance"
    storage = "storage"
    other = "other"

class Payment(Base):
    __tablename__ = 'payments'
    id = Column(Integer, primary_key=True, index=True)
    
    # Payment Information
    payment_number = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    
    # Payment Details
    payment_type = Column(Enum(PaymentType), nullable=False)
    due_date = Column(DateTime, nullable=False)
    payment_date = Column(DateTime)
    
    # Status and Tracking
    status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    notes = Column(Text)
    
    # Related Processes
    import_process_id = Column(Integer, ForeignKey('import_processes.id'))
    export_process_id = Column(Integer, ForeignKey('export_processes.id'))
    
    # Relationships
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="payments")
    created_by_user = relationship("User", back_populates="created_payments")
    import_process = relationship("ImportProcess", back_populates="payments")
    export_process = relationship("ExportProcess", back_populates="payments") 