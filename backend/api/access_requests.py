from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=schemas.AccessRequest)
def create_access_request(request: schemas.AccessRequestCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_request = models.AccessRequest(
        name=request.name,
        company=request.company,
        email=request.email,
        phone=request.phone,
        position=request.position,
        status=models.AccessRequestStatus.pending,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        company_id=current_user.company_id
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/", response_model=List[schemas.AccessRequest])
def list_access_requests(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.AccessRequest).filter(models.AccessRequest.company_id == current_user.company_id).all()

@router.put("/{request_id}/approve")
def approve_access_request(request_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    req = db.query(models.AccessRequest).filter(models.AccessRequest.id == request_id, models.AccessRequest.company_id == current_user.company_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    req.status = models.AccessRequestStatus.approved
    req.approved_at = datetime.utcnow()
    req.approved_by = str(current_user.id)
    req.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Solicitação aprovada com sucesso"}

@router.put("/{request_id}/reject")
def reject_access_request(request_id: int, rejection_reason: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    req = db.query(models.AccessRequest).filter(models.AccessRequest.id == request_id, models.AccessRequest.company_id == current_user.company_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    req.status = models.AccessRequestStatus.rejected
    req.rejection_reason = rejection_reason
    req.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Solicitação rejeitada com sucesso"} 