"""
Modelo para verificações de compliance
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class ComplianceCategory(str, enum.Enum):
    """Categoria da verificação de compliance"""
    document = "document"
    regulation = "regulation"
    tax = "tax"
    customs = "customs"
    license = "license"

class ComplianceStatus(str, enum.Enum):
    """Status da verificação"""
    compliant = "compliant"
    non_compliant = "non-compliant"
    pending = "pending"
    warning = "warning"

class ComplianceCheck(Base):
    """Verificação de compliance para um processo"""
    __tablename__ = 'compliance_checks'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Identificação
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(ComplianceCategory), nullable=False)
    
    # Status e resultado
    status = Column(Enum(ComplianceStatus), default=ComplianceStatus.pending)
    required = Column(Boolean, default=True)
    
    # Detalhes
    details = Column(Text, nullable=True)
    action_required = Column(Text, nullable=True)
    
    # Relacionamentos
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    import_process_id = Column(Integer, ForeignKey('import_processes.id'), nullable=True)
    export_process_id = Column(Integer, ForeignKey('export_processes.id'), nullable=True)
    
    # Auditoria
    checked_at = Column(DateTime, nullable=True)
    checked_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    checked_by_name = Column(String, nullable=True)  # Nome do usuário ou sistema
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Metadados
    rule_id = Column(String, nullable=True)  # ID da regra de compliance aplicada
    rule_version = Column(String, nullable=True)  # Versão da regra
    source = Column(String, default="manual")  # manual, automatic, integration
    
    # Relationships
    company = relationship("Company", back_populates="compliance_checks")
    import_process = relationship("ImportProcess", back_populates="compliance_checks")
    export_process = relationship("ExportProcess", back_populates="compliance_checks")
    checked_by_user = relationship("User", foreign_keys=[checked_by])

