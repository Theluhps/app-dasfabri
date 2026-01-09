from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.models import User
from pydantic import BaseModel, EmailStr
from typing import Optional

# Schemas básicos inline
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "viewer"
    department: Optional[str] = None

class UserSchema(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department: Optional[str] = None
    
    class Config:
        from_attributes = True
from app.core.security import authenticate_user, create_access_token, get_current_user
from app.core.database import get_db
from datetime import datetime

router = APIRouter()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    access_token = create_access_token({"sub": str(user.id), "company_id": user.company_id, "role": user.role})
    user.last_login = datetime.utcnow()
    db.commit()
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Retorna informações do usuário autenticado"""
    return current_user

@router.post("/register", response_model=UserSchema)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    from app.core.security import get_password_hash
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        department=user.department,
        status=user.status or 'active',
        company_id=user.company_id,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user 