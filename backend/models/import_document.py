from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base
import enum

class DocumentType(str, enum.Enum):
    commercial_invoice = "commercial_invoice"
    packing_list = "packing_list"
    bill_of_lading = "bill_of_lading"
    certificate_of_origin = "certificate_of_origin"
    phytosanitary_certificate = "phytosanitary_certificate"
    sanitary_certificate = "sanitary_certificate"
    insurance_certificate = "insurance_certificate"
    import_license = "import_license"
    customs_declaration = "customs_declaration"
    other = "other"

class DocumentStatus(str, enum.Enum):
    pending = "pending"
    received = "received"
    approved = "approved"
    rejected = "rejected"
    expired = "expired"

class ImportDocument(Base):
    __tablename__ = 'import_documents'
    id = Column(Integer, primary_key=True, index=True)
    
    # Document Information
    document_type = Column(Enum(DocumentType), nullable=False)
    document_number = Column(String)
    document_date = Column(DateTime)
    expiry_date = Column(DateTime)
    
    # File Information
    file_name = Column(String)
    file_path = Column(String)
    file_size = Column(Integer)  # in bytes
    mime_type = Column(String)
    
    # Status and Tracking
    status = Column(Enum(DocumentStatus), default=DocumentStatus.pending)
    notes = Column(Text)
    
    # Relationships
    import_process_id = Column(Integer, ForeignKey('import_processes.id'), nullable=False)
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    uploaded_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    import_process = relationship("ImportProcess", back_populates="documents")
    company = relationship("Company", back_populates="import_documents")
    uploaded_by_user = relationship("User", back_populates="uploaded_documents") 