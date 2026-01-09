"""
Schemas Pydantic para documentos de importação
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.import_document import DocumentType, DocumentStatus


class ImportDocumentBase(BaseModel):
    """Schema base para ImportDocument"""
    document_type: DocumentType
    document_number: Optional[str] = None
    document_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    status: DocumentStatus = DocumentStatus.pending
    notes: Optional[str] = None
    extracted_text: Optional[str] = None
    ocr_confidence: Optional[float] = Field(None, ge=0, le=1)
    ocr_method: Optional[str] = None
    classification_confidence: Optional[float] = Field(None, ge=0, le=1)


class ImportDocumentCreate(ImportDocumentBase):
    """Schema para criação de ImportDocument"""
    import_process_id: int
    document_type: Optional[DocumentType] = None  # Pode ser inferido pelo OCR


class ImportDocument(ImportDocumentBase):
    """Schema completo para ImportDocument"""
    id: int
    import_process_id: int
    company_id: int
    uploaded_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2
        orm_mode = True  # Pydantic v1 compatibility

