from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import User, Company, UserRole
from app.core.security import get_current_user
from app.core.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Schemas básicos
class CompanyCreate(BaseModel):
    name: str
    cnpj: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = "Brasil"
    phone: Optional[str] = None
    email: Optional[str] = None

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class CompanySchema(BaseModel):
    id: int
    name: str
    cnpj: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    
    class Config:
        from_attributes = True

@router.post("/", response_model=CompanySchema)
def create_company(
    company: CompanyCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Criar nova empresa - apenas administradores"""
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Apenas administradores podem criar empresas")
    # Verificar se o CNPJ já existe
    existing = db.query(Company).filter(Company.cnpj == company.cnpj).first()
    if existing:
        raise HTTPException(status_code=400, detail="CNPJ já cadastrado")
    
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@router.get("/", response_model=list[CompanySchema])
def list_companies(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Listar todas as empresas - apenas administradores"""
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Apenas administradores")
    return db.query(Company).all()

@router.get("/my-company", response_model=CompanySchema)
def get_my_company(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Obter dados da empresa do usuário logado"""
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return company

@router.get("/{company_id}", response_model=CompanySchema)
def get_company(
    company_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Obter dados de uma empresa específica"""
    if current_user.company_id != company_id and current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Acesso negado")
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return company

@router.put("/{company_id}", response_model=CompanySchema)
def update_company(
    company_id: int, 
    company: CompanyUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Atualizar dados da empresa"""
    if current_user.company_id != company_id and current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    update_data = company.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_company, key, value)
    
    db.commit()
    db.refresh(db_company)
    return db_company

@router.delete("/{company_id}")
def delete_company(
    company_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Excluir empresa - apenas administradores"""
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Apenas administradores")
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    users_count = db.query(User).filter(User.company_id == company_id).count()
    if users_count > 0:
        raise HTTPException(status_code=400, detail="Não é possível excluir uma empresa que possui usuários cadastrados")
    
    db.delete(db_company)
    db.commit()
    return {"message": "Empresa excluída com sucesso"} 