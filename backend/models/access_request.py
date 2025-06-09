from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from datetime import datetime
from backend.models import Base
import enum

class AccessRequestStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class AccessRequest(Base):
    __tablename__ = 'access_requests'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    position = Column(String)
    status = Column(Enum(AccessRequestStatus), default=AccessRequestStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    approved_at = Column(DateTime)
    approved_by = Column(String)
    rejection_reason = Column(String) 