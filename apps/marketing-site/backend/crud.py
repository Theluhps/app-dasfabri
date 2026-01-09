from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Company CRUD
def get_company(db: Session, company_id: int):
    return db.query(models.Company).filter(models.Company.id == company_id).first()

def get_company_by_name(db: Session, name: str):
    return db.query(models.Company).filter(models.Company.name == name).first()

def get_companies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Company).offset(skip).limit(limit).all()

def create_company(db: Session, company: schemas.CompanyCreate):
    db_company = models.Company(name=company.name)
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        company_id=user.company_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Access Request CRUD
def get_access_request(db: Session, request_id: int):
    return db.query(models.AccessRequest).filter(models.AccessRequest.id == request_id).first()

def get_access_requests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AccessRequest).offset(skip).limit(limit).all()

def get_company_access_requests(db: Session, company_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.AccessRequest).filter(
        models.AccessRequest.company_id == company_id
    ).offset(skip).limit(limit).all()

def create_access_request(db: Session, request: schemas.AccessRequestCreate):
    db_request = models.AccessRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def update_access_request_status(
    db: Session,
    request_id: int,
    status: models.AccessRequestStatus,
    approver_id: str = None,
    rejection_reason: str = None
):
    db_request = get_access_request(db, request_id)
    if not db_request:
        return None
    
    db_request.status = status
    db_request.updated_at = datetime.utcnow()
    
    if status == models.AccessRequestStatus.APPROVED:
        db_request.approved_at = datetime.utcnow()
        db_request.approved_by = approver_id
    elif status == models.AccessRequestStatus.REJECTED:
        db_request.rejection_reason = rejection_reason
    
    db.commit()
    db.refresh(db_request)
    return db_request 