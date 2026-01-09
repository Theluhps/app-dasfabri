from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class ApprovalStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    cancelled = "cancelled"
    expired = "expired"

class Approval(Base):
    __tablename__ = 'approvals'
    id = Column(Integer, primary_key=True, index=True)
    
    # Approval Information
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.pending)
    
    # Related Entity
    entity_type = Column(String, nullable=False)  # "import_process", "export_process", "payment", "purchase_order"
    entity_id = Column(Integer, nullable=False)
    
    # Workflow Information
    workflow_id = Column(Integer, ForeignKey('workflows.id'), nullable=False)
    workflow_step_id = Column(Integer, ForeignKey('workflow_steps.id'), nullable=False)
    
    # Approval Details
    requested_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    approved_by = Column(Integer, ForeignKey('users.id'))
    rejected_by = Column(Integer, ForeignKey('users.id'))
    
    # Dates
    requested_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime)
    rejected_at = Column(DateTime)
    expires_at = Column(DateTime)
    
    # Comments
    approval_comment = Column(Text)
    rejection_reason = Column(Text)
    
    # Relationships
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="approvals")
    workflow = relationship("Workflow", back_populates="approvals")
    workflow_step = relationship("WorkflowStep", back_populates="approvals")
    requested_by_user = relationship("User", foreign_keys=[requested_by], back_populates="requested_approvals")
    approved_by_user = relationship("User", foreign_keys=[approved_by], back_populates="approved_approvals")
    rejected_by_user = relationship("User", foreign_keys=[rejected_by], back_populates="rejected_approvals") 