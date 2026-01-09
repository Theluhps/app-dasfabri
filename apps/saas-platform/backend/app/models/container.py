from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class ContainerStatus(str, enum.Enum):
    booked = "booked"
    loaded = "loaded"
    in_transit = "in_transit"
    arrived = "arrived"
    delivered = "delivered"
    returned = "returned"

class ContainerType(str, enum.Enum):
    twenty_dc = "20DC"
    forty_dc = "40DC"
    forty_hc = "40HC"
    forty_rf = "40RF"
    forty_ot = "40OT"

class Container(Base):
    __tablename__ = 'containers'
    id = Column(Integer, primary_key=True, index=True)
    
    # Container Information
    container_number = Column(String, unique=True, nullable=False, index=True)
    container_type = Column(Enum(ContainerType), nullable=False)
    size = Column(String)  # e.g., "20ft", "40ft"
    
    # Booking Information
    booking_number = Column(String, index=True)
    vessel = Column(String)
    voyage = Column(String)
    
    # Route Information
    origin_port = Column(String, nullable=False)
    destination_port = Column(String, nullable=False)
    origin_country = Column(String, nullable=False)
    destination_country = Column(String, nullable=False)
    
    # Dates
    booking_date = Column(DateTime)
    loading_date = Column(DateTime)
    departure_date = Column(DateTime)
    estimated_arrival = Column(DateTime)
    actual_arrival = Column(DateTime)
    
    # Status and Tracking
    status = Column(Enum(ContainerStatus), default=ContainerStatus.booked)
    current_location = Column(String)
    notes = Column(Text)
    
    # Related Processes
    import_process_id = Column(Integer, ForeignKey('import_processes.id'))
    export_process_id = Column(Integer, ForeignKey('export_processes.id'))
    
    # Relationships
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="containers")
    created_by_user = relationship("User", back_populates="created_containers")
    import_process = relationship("ImportProcess", back_populates="containers")
    export_process = relationship("ExportProcess", back_populates="containers")
    tracking_events = relationship("TrackingEvent", back_populates="container") 