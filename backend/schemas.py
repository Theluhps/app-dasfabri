from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class CompanyBase(BaseModel):
    name: str
    cnpj: str
    address: Optional[str]
    type: Optional[str]
    segment: Optional[str]
    status: Optional[str]

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    class Config:
        orm_mode = True

class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    user = "user"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    department: Optional[str]
    role: UserRole = UserRole.user
    status: Optional[str]

class UserCreate(UserBase):
    password: str
    company_id: int

class User(UserBase):
    id: int
    company_id: int
    last_login: Optional[datetime]
    created_at: Optional[datetime]
    class Config:
        orm_mode = True

class AccessRequestStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class AccessRequestBase(BaseModel):
    name: str
    company: str
    email: EmailStr
    phone: Optional[str]
    position: Optional[str]

class AccessRequestCreate(AccessRequestBase):
    pass

class AccessRequest(AccessRequestBase):
    id: int
    status: AccessRequestStatus
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    approved_at: Optional[datetime]
    approved_by: Optional[str]
    rejection_reason: Optional[str]
    company_id: Optional[int]
    class Config:
        orm_mode = True 