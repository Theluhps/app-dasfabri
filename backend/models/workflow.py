from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class WorkflowStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    draft = "draft"

class WorkflowType(str, enum.Enum):
    import_approval = "import_approval"
    export_approval = "export_approval"
    payment_approval = "payment_approval"
    po_approval = "po_approval"
    custom = "custom"

class Workflow(Base):
    __tablename__ = 'workflows'
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    name = Column(String, nullable=False)
    description = Column(Text)
    workflow_type = Column(Enum(WorkflowType), nullable=False)
    
    # Configuration
    is_active = Column(Enum(WorkflowStatus), default=WorkflowStatus.active)
    auto_approve = Column(String, default="false")  # JSON string for conditions
    
    # Relationships
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="workflows")
    created_by_user = relationship("User", back_populates="created_workflows")
    steps = relationship("WorkflowStep", back_populates="workflow", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="workflow") 