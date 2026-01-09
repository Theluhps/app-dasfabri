"""
Endpoint público para receber solicitações de contato e demonstração do site de marketing
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.email import send_contact_notification, send_access_request_notification
from app.models import AccessRequest, AccessRequestStatus, Company, CompanyStatus
from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ContactRequestCreate(BaseModel):
    name: str
    email: EmailStr
    company: str
    phone: Optional[str] = None
    country: Optional[str] = None
    message: Optional[str] = None

class AccessRequestCreate(BaseModel):
    name: str
    email: EmailStr
    company: str
    phone: Optional[str] = None
    position: Optional[str] = None

@router.post("/contact", response_model=dict)
async def create_contact_request(
    request: ContactRequestCreate, 
    db: Session = Depends(get_db)
):
    """
    Endpoint público para receber solicitações de contato/demonstração do site.
    Salva os dados no banco e retorna sucesso.
    
    TODO: Implementar envio de email para equipe de vendas
    """
    try:
        # Criar ou buscar empresa
        company = db.query(Company).filter(Company.name == request.company).first()
        if not company:
            # Criar empresa com CNPJ temporário (será atualizado depois)
            company = Company(
                name=request.company,
                cnpj=f"TEMP-{int(datetime.utcnow().timestamp())}",  # CNPJ temporário
                status=CompanyStatus.active,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(company)
            db.flush()  # Para obter o ID
        
        # Criar solicitação de acesso com status pending
        access_request = AccessRequest(
            name=request.name,
            email=request.email,
            company_id=company.id,
            phone=None,
            position=None,
            status=AccessRequestStatus.PENDING,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(access_request)
        db.commit()
        
        # Enviar email para equipe de vendas
        try:
            send_contact_notification(
                name=request.name,
                email=request.email,
                company=request.company,
                phone=request.phone,
                country=request.country,
                message=request.message
            )
        except Exception as e:
            logger.error(f"Erro ao enviar email de notificação: {str(e)}")
            # Não falha a requisição se o email não for enviado
        
        return {
            "success": True,
            "message": "Solicitação recebida com sucesso. Entraremos em contato em breve.",
            "request_id": access_request.id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao processar solicitação: {str(e)}")

@router.post("/access-request", response_model=dict)
async def create_public_access_request(
    request: AccessRequestCreate,
    db: Session = Depends(get_db)
):
    """
    Endpoint público para receber solicitações de acesso.
    Versão pública que não requer autenticação.
    Salva no banco de dados na tabela access_requests.
    """
    try:
        # Criar ou buscar empresa
        company = db.query(Company).filter(Company.name == request.company).first()
        if not company:
            # Criar empresa com CNPJ temporário (será atualizado depois)
            company = Company(
                name=request.company,
                cnpj=f"TEMP-{int(datetime.utcnow().timestamp())}",  # CNPJ temporário
                status=CompanyStatus.active,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(company)
            db.flush()  # Para obter o ID
        
        # Criar solicitação de acesso
        access_request = AccessRequest(
            name=request.name,
            email=request.email,
            company_id=company.id,
            phone=request.phone,
            position=request.position,
            status=AccessRequestStatus.PENDING,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(access_request)
        db.commit()
        db.refresh(access_request)
        
        # Enviar email para admins notificando nova solicitação
        try:
            send_access_request_notification(
                name=request.name,
                email=request.email,
                company=request.company,
                phone=request.phone,
                country=request.country,
                position=request.position
            )
        except Exception as e:
            logger.error(f"Erro ao enviar email de notificação: {str(e)}")
            # Não falha a requisição se o email não for enviado
        
        return {
            "success": True,
            "message": "Solicitação de acesso recebida. Você receberá um email quando for aprovado.",
            "request_id": access_request.id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao processar solicitação: {str(e)}")

