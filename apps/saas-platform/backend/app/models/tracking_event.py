"""
Modelo para eventos de rastreamento de embarques
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class TrackingEventStatus(str, enum.Enum):
    """Status do evento de rastreamento"""
    departed = "departed"
    in_transit = "in-transit"
    arrived = "arrived"
    delayed = "delayed"
    customs = "customs"
    delivered = "delivered"

class TrackingEvent(Base):
    """Evento de rastreamento de embarque/container"""
    __tablename__ = 'tracking_events'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Identificação do embarque/container
    shipment_id = Column(String, nullable=False, index=True)  # ID do embarque (pode ser process_id ou container_number)
    container_number = Column(String, index=True, nullable=True)
    
    # Informações do evento
    status = Column(Enum(TrackingEventStatus), nullable=False)
    location = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    description = Column(Text, nullable=False)
    
    # Informações adicionais
    vessel = Column(String, nullable=True)
    port = Column(String, nullable=True)
    port_code = Column(String, nullable=True)  # Código do porto (ex: BRSSZ para Santos)
    
    # Relacionamentos
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    import_process_id = Column(Integer, ForeignKey('import_processes.id'), nullable=True)
    export_process_id = Column(Integer, ForeignKey('export_processes.id'), nullable=True)
    container_id = Column(Integer, ForeignKey('containers.id'), nullable=True)
    
    # Timestamps
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Metadados
    source = Column(String, default="manual")  # manual, api, integration
    external_id = Column(String, nullable=True)  # ID do sistema externo (se aplicável)
    raw_data = Column(Text, nullable=True)  # Dados brutos da API externa
    
    # Relationships
    company = relationship("Company", back_populates="tracking_events")
    import_process = relationship("ImportProcess", back_populates="tracking_events")
    export_process = relationship("ExportProcess", back_populates="tracking_events")
    container = relationship("Container", back_populates="tracking_events")

