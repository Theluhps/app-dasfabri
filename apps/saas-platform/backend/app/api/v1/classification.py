"""
Classification API - Determinação Automática de Classificação (NCM)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models import User, Product, ImportProcess, ExportProcess
from pydantic import BaseModel
from decimal import Decimal

router = APIRouter()

# Schemas
class ClassificationRequest(BaseModel):
    product_name: str
    description: Optional[str] = None
    origin_country: Optional[str] = None
    weight: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None

class ClassificationResponse(BaseModel):
    ncm: str
    description: str
    confidence: float
    alternatives: Optional[list] = None

class ClassificationUpdate(BaseModel):
    ncm: str
    confidence: Optional[Decimal] = None

@router.post("/classify", response_model=ClassificationResponse)
async def classify_product(
    request: ClassificationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Classificar produto automaticamente (NCM)"""
    # Mock de classificação automática
    # Em produção, usar ML/IA para classificação baseada em:
    # - Nome do produto
    # - Descrição
    # - País de origem
    # - Categoria
    # - Histórico de classificações similares
    
    # Simulação de classificação
    suggested_ncm = "9999.99.99"  # Mock - substituir por modelo ML
    confidence = 85.5  # Mock - substituir por confiança real do modelo
    description = f"NCM sugerido para {request.product_name}"
    
    # Alternativas (mock)
    alternatives = [
        {"ncm": "9999.99.98", "description": "Alternativa 1", "confidence": 75.0},
        {"ncm": "9999.99.97", "description": "Alternativa 2", "confidence": 65.0}
    ]
    
    return ClassificationResponse(
        ncm=suggested_ncm,
        description=description,
        confidence=confidence,
        alternatives=alternatives
    )

@router.post("/products/{product_id}/classify", response_model=ClassificationResponse)
async def classify_existing_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Classificar produto existente no catálogo"""
    company_id = current_user.company_id
    
    product = db.query(Product).filter(
        and_(
            Product.id == product_id,
            Product.company_id == company_id
        )
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Classificar baseado nos dados do produto
    request = ClassificationRequest(
        product_name=product.name,
        description=product.description,
        origin_country=product.origin_country,
        category=product.category
    )
    
    classification = await classify_product(request, db, current_user)
    
    # Atualizar produto com classificação
    product.ncm = classification.ncm
    product.ncm_confidence = Decimal(str(classification.confidence))
    
    db.commit()
    
    return classification

@router.post("/processes/import/{process_id}/classify")
async def classify_import_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Classificar processo de importação"""
    company_id = current_user.company_id
    
    process = db.query(ImportProcess).filter(
        and_(
            ImportProcess.id == process_id,
            ImportProcess.company_id == company_id
        )
    ).first()
    
    if not process:
        raise HTTPException(status_code=404, detail="Processo de importação não encontrado")
    
    # Se processo tem produto associado, usar dados do produto
    if process.product_id:
        product = db.query(Product).filter(Product.id == process.product_id).first()
        if product and product.ncm:
            process.ncm = product.ncm
            db.commit()
            return {
                "message": "NCM aplicado do catálogo de produtos",
                "ncm": product.ncm,
                "confidence": float(product.ncm_confidence) if product.ncm_confidence else None
            }
    
    # Classificar baseado em dados do processo
    request = ClassificationRequest(
        product_name=process.product,
        description=process.description,
        origin_country=process.origin
    )
    
    classification = await classify_product(request, db, current_user)
    
    # Aplicar classificação ao processo
    process.ncm = classification.ncm
    db.commit()
    
    return {
        "message": "Processo classificado com sucesso",
        "ncm": classification.ncm,
        "confidence": classification.confidence
    }

@router.post("/processes/export/{process_id}/classify")
async def classify_export_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Classificar processo de exportação"""
    company_id = current_user.company_id
    
    process = db.query(ExportProcess).filter(
        and_(
            ExportProcess.id == process_id,
            ExportProcess.company_id == company_id
        )
    ).first()
    
    if not process:
        raise HTTPException(status_code=404, detail="Processo de exportação não encontrado")
    
    # Se processo tem produto associado, usar dados do produto
    if process.product_id:
        product = db.query(Product).filter(Product.id == process.product_id).first()
        if product and product.ncm:
            process.ncm = product.ncm
            db.commit()
            return {
                "message": "NCM aplicado do catálogo de produtos",
                "ncm": product.ncm,
                "confidence": float(product.ncm_confidence) if product.ncm_confidence else None
            }
    
    # Classificar baseado em dados do processo
    request = ClassificationRequest(
        product_name=process.product,
        description=process.description,
        origin_country=process.origin
    )
    
    classification = await classify_product(request, db, current_user)
    
    # Aplicar classificação ao processo
    process.ncm = classification.ncm
    db.commit()
    
    return {
        "message": "Processo classificado com sucesso",
        "ncm": classification.ncm,
        "confidence": classification.confidence
    }

@router.get("/ncm/{ncm_code}/info")
async def get_ncm_info(
    ncm_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter informações sobre um código NCM"""
    # Mock - em produção, buscar em base de dados oficial
    return {
        "ncm": ncm_code,
        "description": f"Descrição do NCM {ncm_code}",
        "tax_rate": 18.0,  # Alíquota de imposto (mock)
        "requires_license": False,  # Requer licença (mock)
        "restrictions": []  # Restrições (mock)
    }

