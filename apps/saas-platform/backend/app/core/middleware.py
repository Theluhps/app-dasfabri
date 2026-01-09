"""
Middleware para tratamento de erros global
"""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, ResponseValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.exceptions import DasfabriException
from loguru import logger
import traceback


async def exception_handler(request: Request, exc: Exception):
    """
    Handler global de exceções
    Captura todas as exceções não tratadas e retorna resposta padronizada
    """
    logger.error(f"Erro não tratado: {exc}")
    logger.error(traceback.format_exc())
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "error_code": "INTERNAL_SERVER_ERROR",
            "detail": "Erro interno do servidor. Nossa equipe foi notificada.",
            "path": str(request.url)
        }
    )


async def dasfabri_exception_handler(request: Request, exc: DasfabriException):
    """
    Handler para exceções customizadas Dasfabri
    """
    logger.warning(f"Erro de negócio: {exc.detail} (código: {exc.error_code})")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "error_code": exc.error_code or "UNKNOWN_ERROR",
            "detail": exc.detail,
            "path": str(request.url)
        },
        headers=exc.headers
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handler para erros de validação do Pydantic
    """
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"]
        })
    
    logger.warning(f"Erro de validação: {errors}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "error_code": "VALIDATION_ERROR",
            "detail": "Erro de validação nos dados enviados",
            "errors": errors,
            "path": str(request.url)
        }
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Handler para HTTPExceptions padrão do FastAPI
    """
    logger.warning(f"HTTP Error {exc.status_code}: {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "error_code": f"HTTP_{exc.status_code}",
            "detail": exc.detail,
            "path": str(request.url)
        }
    )


async def response_validation_exception_handler(request: Request, exc: ResponseValidationError):
    """
    Handler para erros de validação de resposta do Pydantic
    Isso ajuda a identificar campos faltantes ou incorretos nos schemas de resposta
    """
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"],
            "input": str(error.get("input", ""))[:200] if error.get("input") else None  # Limitar tamanho
        })
    
    logger.error(f"Erro de validação de resposta: {errors}")
    logger.error(f"Detalhes completos do erro: {exc}")
    
    # Tentar obter o body se disponível
    try:
        if hasattr(exc, 'body'):
            logger.error(f"Body da resposta que falhou: {exc.body}")
    except:
        pass
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "error_code": "RESPONSE_VALIDATION_ERROR",
            "detail": "Erro ao validar resposta da API. Verifique os logs para detalhes.",
            "errors": errors,
            "path": str(request.url)
        }
    )

