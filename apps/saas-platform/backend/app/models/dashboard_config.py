"""
Modelo para configuração de Dashboard do usuário
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base

class UserDashboardConfig(Base):
    """Configuração de widgets do dashboard por usuário"""
    __tablename__ = 'user_dashboard_configs'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relacionamentos
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, unique=True)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    
    # Configuração dos widgets (JSON)
    # Exemplo: {"widgets": [{"id": "kpis", "enabled": true, "position": 0}, ...]}
    widgets_config = Column(JSON, nullable=False, default=lambda: {"widgets": []})
    
    # Layout (grid positions, sizes, etc.)
    layout_config = Column(JSON, nullable=True, default=lambda: {})
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="dashboard_config")
    company = relationship("Company", back_populates="dashboard_configs")

