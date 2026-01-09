"""
Modelo para Task Management
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class TaskStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"
    overdue = "overdue"

class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class TaskType(str, enum.Enum):
    document = "document"
    license = "license"
    logistics = "logistics"
    financial = "financial"
    compliance = "compliance"
    administrative = "administrative"
    other = "other"

class Task(Base):
    """Tarefa do sistema"""
    __tablename__ = 'tasks'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Informações básicas
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Status e prioridade
    status = Column(Enum(TaskStatus), default=TaskStatus.pending, nullable=False)
    priority = Column(Enum(TaskPriority), default=TaskPriority.medium, nullable=False)
    task_type = Column(Enum(TaskType), default=TaskType.other, nullable=False)
    
    # Datas
    due_date = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    
    # Relacionamentos
    import_process_id = Column(Integer, ForeignKey('import_processes.id'), nullable=True)
    export_process_id = Column(Integer, ForeignKey('export_processes.id'), nullable=True)
    assigned_to = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    
    # Metadados
    notes = Column(Text, nullable=True)
    is_urgent = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="tasks")
    assigned_user = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_tasks")
    created_by_user = relationship("User", foreign_keys=[created_by], back_populates="created_tasks")
    import_process = relationship("ImportProcess", foreign_keys=[import_process_id], back_populates="tasks")
    export_process = relationship("ExportProcess", foreign_keys=[export_process_id], back_populates="tasks")

