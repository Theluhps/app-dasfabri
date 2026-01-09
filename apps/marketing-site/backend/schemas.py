from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from .models.access_request import AccessRequestStatus

# Company Schemas
class CompanyBase(BaseModel):
    name: str

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    company_id: int

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Access Request Schemas
class AccessRequestBase(BaseModel):
    name: str
    company: str  # Nome da empresa
    email: EmailStr
    phone: Optional[str] = None
    position: Optional[str] = None

class AccessRequestCreate(AccessRequestBase):
    pass

class AccessRequest(AccessRequestBase):
    id: int
    company_id: int  # ID da empresa
    status: AccessRequestStatus
    created_at: datetime
    updated_at: datetime
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    rejection_reason: Optional[str] = None

    class Config:
        from_attributes = True 