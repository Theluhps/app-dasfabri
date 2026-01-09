from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db

router = APIRouter()

@router.post("/access-requests/", response_model=schemas.AccessRequest)
def create_access_request(request: schemas.AccessRequestCreate, db: Session = Depends(get_db)):
    # Primeiro, criar ou obter a empresa
    company = crud.get_company_by_name(db, name=request.company)
    if not company:
        company = crud.create_company(db, schemas.CompanyCreate(name=request.company))
    
    # Criar a solicitação de acesso com o ID da empresa
    db_request = models.AccessRequest(
        name=request.name,
        company_id=company.id,
        email=request.email,
        phone=request.phone,
        position=request.position,
        status=models.AccessRequestStatus.PENDING
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/access-requests/", response_model=List[schemas.AccessRequest])
def read_access_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = crud.get_access_requests(db, skip=skip, limit=limit)
    return requests

@router.get("/access-requests/{request_id}", response_model=schemas.AccessRequest)
def read_access_request(request_id: int, db: Session = Depends(get_db)):
    db_request = crud.get_access_request(db, request_id=request_id)
    if db_request is None:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    return db_request

@router.get("/companies/{company_id}/access-requests/", response_model=List[schemas.AccessRequest])
def read_company_access_requests(company_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = crud.get_company_access_requests(db, company_id=company_id, skip=skip, limit=limit)
    return requests

@router.put("/access-requests/{request_id}/approve")
def approve_access_request(
    request_id: int,
    approver_id: str,
    db: Session = Depends(get_db)
):
    db_request = crud.update_access_request_status(
        db=db,
        request_id=request_id,
        status=models.AccessRequestStatus.APPROVED,
        approver_id=approver_id
    )
    if db_request is None:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    return {"message": "Solicitação aprovada com sucesso"}

@router.put("/access-requests/{request_id}/reject")
def reject_access_request(
    request_id: int,
    rejection_reason: str,
    db: Session = Depends(get_db)
):
    db_request = crud.update_access_request_status(
        db=db,
        request_id=request_id,
        status=models.AccessRequestStatus.REJECTED,
        rejection_reason=rejection_reason
    )
    if db_request is None:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    return {"message": "Solicitação rejeitada com sucesso"} 