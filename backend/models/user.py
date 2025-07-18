from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    operator = "operator"
    viewer = "viewer"

class UserStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.viewer)
    department = Column(String)
    status = Column(Enum(UserStatus), default=UserStatus.active)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="users")
    created_imports = relationship("ImportProcess", back_populates="created_by_user")
    created_exports = relationship("ExportProcess", back_populates="created_by_user")
    created_suppliers = relationship("Supplier", back_populates="created_by_user")
    created_clients = relationship("Client", back_populates="created_by_user")
    created_payments = relationship("Payment", back_populates="created_by_user")
    created_exchange_rates = relationship("ExchangeRate", back_populates="created_by_user")
    created_containers = relationship("Container", back_populates="created_by_user")
    created_purchase_orders = relationship("PurchaseOrder", foreign_keys="PurchaseOrder.created_by", back_populates="created_by_user")
    approved_purchase_orders = relationship("PurchaseOrder", foreign_keys="PurchaseOrder.approved_by", back_populates="approved_by_user")
    created_workflows = relationship("Workflow", back_populates="created_by_user")
    uploaded_documents = relationship("ImportDocument", back_populates="uploaded_by_user")
    requested_approvals = relationship("Approval", foreign_keys="Approval.requested_by", back_populates="requested_by_user")
    approved_approvals = relationship("Approval", foreign_keys="Approval.approved_by", back_populates="approved_by_user")
    rejected_approvals = relationship("Approval", foreign_keys="Approval.rejected_by", back_populates="rejected_by_user") 