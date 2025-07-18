from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class StepType(str, enum.Enum):
    approval = "approval"
    notification = "notification"
    action = "action"

class WorkflowStep(Base):
    __tablename__ = 'workflow_steps'
    id = Column(Integer, primary_key=True, index=True)
    
    # Step Information
    name = Column(String, nullable=False)
    description = Column(Text)
    step_type = Column(Enum(StepType), nullable=False)
    order = Column(Integer, nullable=False)  # Order in the workflow
    
    # Approval Configuration
    required_roles = Column(String)  # JSON array of roles
    required_users = Column(String)  # JSON array of user IDs
    approval_type = Column(String)  # "any", "all", "majority"
    
    # Timeout Configuration
    timeout_hours = Column(Integer, default=24)
    auto_approve_on_timeout = Column(String, default="false")
    
    # Relationships
    workflow_id = Column(Integer, ForeignKey('workflows.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workflow = relationship("Workflow", back_populates="steps")
    approvals = relationship("Approval", back_populates="workflow_step") 