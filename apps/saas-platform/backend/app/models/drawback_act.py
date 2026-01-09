"""
Modelo para gestão de Drawback
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Numeric, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class DrawbackActStatus(str, enum.Enum):
    """Status do ato de drawback"""
    draft = "draft"
    submitted = "submitted"
    approved = "approved"
    rejected = "rejected"
    cancelled = "cancelled"

class DrawbackActType(str, enum.Enum):
    """Tipo de ato de drawback"""
    suspension = "suspension"  # Suspensão
    exemption = "exemption"  # Isenção
    refund = "refund"  # Restituição

class DrawbackAct(Base):
    """Ato de Drawback"""
    __tablename__ = 'drawback_acts'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Identificação
    act_number = Column(String, unique=True, nullable=False, index=True)
    act_type = Column(Enum(DrawbackActType), nullable=False)
    status = Column(Enum(DrawbackActStatus), default=DrawbackActStatus.draft)
    
    # Informações do ato
    description = Column(Text, nullable=False)
    total_value = Column(Numeric(15, 2), nullable=False)
    currency = Column(String, default='BRL')
    
    # Relacionamentos
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    import_process_id = Column(Integer, ForeignKey('import_processes.id'), nullable=True)
    export_process_id = Column(Integer, ForeignKey('export_processes.id'), nullable=True)
    
    # Datas importantes
    submitted_at = Column(DateTime, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    expiration_date = Column(DateTime, nullable=True)
    
    # Auditoria
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    approved_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Metadados
    notes = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    
    # Relationships
    company = relationship("Company", back_populates="drawback_acts")
    import_process = relationship("ImportProcess", back_populates="drawback_acts")
    export_process = relationship("ExportProcess", back_populates="drawback_acts")
    created_by_user = relationship("User", foreign_keys=[created_by])
    approved_by_user = relationship("User", foreign_keys=[approved_by])
    credits = relationship("DrawbackCredit", back_populates="act", cascade="all, delete-orphan")

class DrawbackCredit(Base):
    """Crédito de Drawback"""
    __tablename__ = 'drawback_credits'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Identificação
    credit_number = Column(String, unique=True, nullable=False, index=True)
    
    # Informações do crédito
    value = Column(Numeric(15, 2), nullable=False)
    currency = Column(String, default='BRL')
    used_value = Column(Numeric(15, 2), default=0)
    available_value = Column(Numeric(15, 2), nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_used = Column(Boolean, default=False)
    
    # Relacionamentos
    act_id = Column(Integer, ForeignKey('drawback_acts.id'), nullable=False)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    
    # Datas
    generated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    used_at = Column(DateTime, nullable=True)
    expiration_date = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Metadados
    notes = Column(Text, nullable=True)
    
    # Relationships
    act = relationship("DrawbackAct", back_populates="credits")
    company = relationship("Company", back_populates="drawback_credits")

