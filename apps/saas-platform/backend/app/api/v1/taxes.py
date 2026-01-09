"""
API para cálculos tributários de importação
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from decimal import Decimal
from app.models import User, ImportProcess, ExchangeRate
from app.core.security import get_current_user
from app.core.database import get_db
from app.core.exceptions import NotFoundError, BusinessLogicError, ValidationError
from app.core.logging_config import logger
from app.services.tax_calculator import get_tax_calculator
from pydantic import BaseModel, Field, validator

router = APIRouter()


class TaxCalculationRequest(BaseModel):
    """Request para cálculo de impostos"""
    cif_value: float = Field(..., gt=0, description="Valor CIF em BRL")
    freight: float = Field(0, ge=0, description="Valor do frete em BRL")
    insurance: float = Field(0, ge=0, description="Valor do seguro em BRL")
    ncm_code: Optional[str] = Field(None, description="Código NCM (8 dígitos)")
    origin_country: Optional[str] = Field(None, description="País de origem")
    destination_state: Optional[str] = Field(None, description="Estado de destino (para ICMS)")
    exchange_rate_id: Optional[int] = Field(None, description="ID da taxa de câmbio usada")
    
    @validator('ncm_code')
    def validate_ncm(cls, v):
        if v and len(v) != 8:
            raise ValueError("Código NCM deve ter 8 dígitos")
        if v and not v.isdigit():
            raise ValueError("Código NCM deve conter apenas números")
        return v


class TaxEstimateRequest(BaseModel):
    """Request para estimativa de custo total"""
    product_value: float = Field(..., gt=0, description="Valor do produto em moeda estrangeira")
    currency: str = Field(..., description="Moeda (ex: USD, EUR)")
    freight: float = Field(0, ge=0, description="Frete em moeda estrangeira")
    insurance: float = Field(0, ge=0, description="Seguro em moeda estrangeira")
    ncm_code: Optional[str] = Field(None, description="Código NCM")
    exchange_rate_id: Optional[int] = Field(None, description="ID da taxa de câmbio")


@router.post("/calculate")
async def calculate_taxes(
    request: TaxCalculationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calcular impostos de importação
    
    Calcula todos os impostos brasileiros (II, IPI, PIS, COFINS, ICMS)
    baseado no valor CIF e outros parâmetros.
    """
    logger.info(f"Usuário {current_user.id} solicitando cálculo de impostos")
    
    try:
        calculator = get_tax_calculator()
        
        result = calculator.calculate_import_taxes(
            cif_value=Decimal(str(request.cif_value)),
            freight=Decimal(str(request.freight)),
            insurance=Decimal(str(request.insurance)),
            ncm_code=request.ncm_code,
            origin_country=request.origin_country,
            destination_state=request.destination_state
        )
        
        # Se exchange_rate_id fornecido, adicionar informação
        if request.exchange_rate_id:
            exchange_rate = db.query(ExchangeRate).filter(
                ExchangeRate.id == request.exchange_rate_id,
                ExchangeRate.company_id == current_user.company_id
            ).first()
            
            if exchange_rate:
                result['exchange_rate_info'] = {
                    'id': exchange_rate.id,
                    'from_currency': exchange_rate.from_currency,
                    'to_currency': exchange_rate.to_currency,
                    'rate': float(exchange_rate.rate),
                    'date': exchange_rate.rate_date.isoformat()
                }
        
        return result
        
    except Exception as e:
        logger.error(f"Erro ao calcular impostos: {e}")
        raise BusinessLogicError(detail=f"Erro ao calcular impostos: {str(e)}")


@router.post("/estimate")
async def estimate_total_cost(
    request: TaxEstimateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Estimar custo total de importação
    
    Inclui conversão de moeda, todos os impostos e custos adicionais.
    """
    logger.info(f"Usuário {current_user.id} solicitando estimativa de custo")
    
    try:
        # Obter taxa de câmbio
        if request.exchange_rate_id:
            exchange_rate = db.query(ExchangeRate).filter(
                ExchangeRate.id == request.exchange_rate_id,
                ExchangeRate.company_id == current_user.company_id
            ).first()
            
            if not exchange_rate:
                raise NotFoundError("Taxa de câmbio", request.exchange_rate_id)
            
            # Verificar se moeda corresponde
            if exchange_rate.from_currency != request.currency.upper():
                raise ValidationError(
                    detail=f"Moeda da taxa de câmbio ({exchange_rate.from_currency}) não corresponde à moeda informada ({request.currency})",
                    field="currency"
                )
            
            rate = Decimal(str(exchange_rate.rate))
        else:
            # Buscar taxa mais recente para a moeda
            exchange_rate = db.query(ExchangeRate).filter(
                ExchangeRate.from_currency == request.currency.upper(),
                ExchangeRate.to_currency == 'BRL',
                ExchangeRate.company_id == current_user.company_id
            ).order_by(ExchangeRate.rate_date.desc()).first()
            
            if not exchange_rate:
                raise NotFoundError(
                    f"Taxa de câmbio para {request.currency}/BRL"
                )
            
            rate = Decimal(str(exchange_rate.rate))
        
        calculator = get_tax_calculator()
        
        result = calculator.estimate_total_cost(
            product_value=Decimal(str(request.product_value)),
            exchange_rate=rate,
            freight=Decimal(str(request.freight)),
            insurance=Decimal(str(request.insurance)),
            ncm_code=request.ncm_code
        )
        
        result['exchange_rate_info'] = {
            'id': exchange_rate.id,
            'from_currency': exchange_rate.from_currency,
            'to_currency': exchange_rate.to_currency,
            'rate': float(rate),
            'date': exchange_rate.rate_date.isoformat()
        }
        
        return result
        
    except NotFoundError:
        raise
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Erro ao estimar custo: {e}")
        raise BusinessLogicError(detail=f"Erro ao estimar custo: {str(e)}")


@router.post("/imports/{import_id}/calculate")
async def calculate_import_taxes(
    import_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calcular impostos para um processo de importação específico
    
    Usa dados do processo de importação para calcular impostos automaticamente.
    """
    logger.info(f"Calculando impostos para processo de importação {import_id}")
    
    # Buscar processo de importação
    import_process = db.query(ImportProcess).filter(
        ImportProcess.id == import_id,
        ImportProcess.company_id == current_user.company_id
    ).first()
    
    if not import_process:
        raise NotFoundError("Processo de importação", import_id)
    
    # Validar se tem dados suficientes
    if not import_process.invoice_value:
        raise BusinessLogicError(
            detail="Processo de importação não possui valor da fatura informado"
        )
    
    try:
        calculator = get_tax_calculator()
        
        # Converter valores para Decimal
        # Usar invoice_value como base (CIF aproximado)
        # Em produção, seria necessário calcular CIF baseado no incoterm
        cif_value = Decimal(str(import_process.invoice_value))
        freight = Decimal('0')  # TODO: Adicionar campo freight ao modelo
        insurance = Decimal('0')  # TODO: Adicionar campo insurance ao modelo
        
        result = calculator.calculate_import_taxes(
            cif_value=cif_value,
            freight=freight,
            insurance=insurance,
            ncm_code=import_process.ncm,
            origin_country=import_process.supplier_country,
            destination_state=None  # TODO: Adicionar campo destination_state ao modelo
        )
        
        # Atualizar processo com valores calculados (opcional)
        # import_process.calculated_taxes = result['total_taxes']
        # db.commit()
        
        return {
            'import_process_id': import_id,
            'calculation': result,
            'status': 'calculated'
        }
        
    except Exception as e:
        logger.error(f"Erro ao calcular impostos do processo: {e}")
        raise BusinessLogicError(detail=f"Erro ao calcular impostos: {str(e)}")


@router.get("/ncm/{ncm_code}/rate")
async def get_ncm_rate(
    ncm_code: str,
    current_user: User = Depends(get_current_user)
):
    """
    Obter alíquota de II para um código NCM
    """
    if len(ncm_code) != 8 or not ncm_code.isdigit():
        raise ValidationError(
            detail="Código NCM deve ter 8 dígitos numéricos",
            field="ncm_code"
        )
    
    calculator = get_tax_calculator()
    rate = calculator.get_ncm_rate(ncm_code)
    
    return {
        'ncm_code': ncm_code,
        'ii_rate': float(rate) if rate else None,
        'rate_percentage': f"{(float(rate) * 100):.2f}%" if rate else None
    }

