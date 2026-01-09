from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base

class ExchangeRate(Base):
    __tablename__ = 'exchange_rates'
    id = Column(Integer, primary_key=True, index=True)
    
    # Exchange Rate Information
    from_currency = Column(String, nullable=False)  # e.g., "USD"
    to_currency = Column(String, nullable=False)    # e.g., "BRL"
    rate = Column(Float, nullable=False)
    rate_date = Column(DateTime, nullable=False)
    
    # Source Information
    source = Column(String)  # e.g., "BCB", "Banco Central"
    source_url = Column(String)
    
    # Relationships
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="exchange_rates")
    created_by_user = relationship("User", back_populates="created_exchange_rates") 