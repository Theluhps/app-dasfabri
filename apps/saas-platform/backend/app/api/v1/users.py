from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import User, Company, ImportProcess, ExportProcess, Supplier, Client, Payment, ExchangeRate, Container, PurchaseOrder, Workflow, Approval, AccessRequest, UserRole
from app.schemas import User as UserSchema, UserCreate
from app.core.security import authenticate_user, get_current_user, create_access_token, get_password_hash
from app.core.database import get_db
from typing import List

router = APIRouter()

@router.post("/", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.admin and user.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        department=user.department,
        status=user.status or 'active',
        company_id=user.company_id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/", response_model=List[schemas.User])
def list_users(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.User).filter(models.User.company_id == current_user.company_id).all()

@router.get("/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    user = db.query(models.User).filter(models.User.id == user_id, models.User.company_id == current_user.company_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.put("/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_user = db.query(models.User).filter(models.User.id == user_id, models.User.company_id == current_user.company_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    for key, value in user.dict(exclude={"password"}).items():
        setattr(db_user, key, value)
    if user.password:
        db_user.hashed_password = auth.get_password_hash(user.password)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_user = db.query(models.User).filter(models.User.id == user_id, models.User.company_id == current_user.company_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db.delete(db_user)
    db.commit()
    return {"ok": True} 