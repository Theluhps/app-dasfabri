from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import User, Company, AccessRequest, AccessRequestStatus
from app.core.security import get_current_user
from app.core.database import get_db
from typing import List
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

# Schemas simples para AccessRequest
class AccessRequestCreate(BaseModel):
    name: str
    company: str
    email: str
    phone: str = None
    position: str = None

class AccessRequestResponse(BaseModel):
    id: int
    name: str
    company: str
    email: str
    phone: str = None
    position: str = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/", response_model=AccessRequestResponse)
def create_access_request(request: AccessRequestCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_request = AccessRequest(
        name=request.name,
        company=request.company,
        email=request.email,
        phone=request.phone,
        position=request.position,
        status=AccessRequestStatus.pending,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        company_id=current_user.company_id
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/", response_model=List[AccessRequestResponse])
def list_access_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(AccessRequest).filter(AccessRequest.company_id == current_user.company_id).all()

@router.put("/{request_id}/approve")
def approve_access_request(request_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Apenas admins e managers podem aprovar")
    req = db.query(AccessRequest).filter(AccessRequest.id == request_id, AccessRequest.company_id == current_user.company_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    req.status = AccessRequestStatus.approved
    req.approved_at = datetime.utcnow()
    req.approved_by = str(current_user.id)
    req.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Solicitação aprovada com sucesso"}

@router.put("/{request_id}/reject")
def reject_access_request(request_id: int, rejection_reason: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Apenas admins e managers podem rejeitar")
    req = db.query(AccessRequest).filter(AccessRequest.id == request_id, AccessRequest.company_id == current_user.company_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    req.status = AccessRequestStatus.rejected
    req.rejection_reason = rejection_reason
    req.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Solicitação rejeitada com sucesso"} 