"""
Exceções customizadas para a aplicação Dasfabri
Padroniza tratamento de erros em toda a API
"""

from fastapi import HTTPException, status
from typing import Any, Dict, Optional


class DasfabriException(HTTPException):
    """Exceção base para erros da aplicação"""
    
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: Optional[str] = None,
        headers: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code


class NotFoundError(DasfabriException):
    """Recurso não encontrado"""
    
    def __init__(self, resource: str, identifier: Any = None):
        detail = f"{resource} não encontrado"
        if identifier:
            detail += f" (ID: {identifier})"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code="NOT_FOUND"
        )


class ValidationError(DasfabriException):
    """Erro de validação"""
    
    def __init__(self, detail: str, field: Optional[str] = None):
        if field:
            detail = f"Erro de validação no campo '{field}': {detail}"
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            error_code="VALIDATION_ERROR"
        )


class UnauthorizedError(DasfabriException):
    """Não autorizado"""
    
    def __init__(self, detail: str = "Credenciais inválidas ou token expirado"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code="UNAUTHORIZED"
        )


class ForbiddenError(DasfabriException):
    """Acesso negado"""
    
    def __init__(self, detail: str = "Você não tem permissão para realizar esta ação"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="FORBIDDEN"
        )


class ConflictError(DasfabriException):
    """Conflito (recurso já existe)"""
    
    def __init__(self, detail: str, resource: Optional[str] = None):
        if resource:
            detail = f"{resource} já existe: {detail}"
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
            error_code="CONFLICT"
        )


class BusinessLogicError(DasfabriException):
    """Erro de lógica de negócio"""
    
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code="BUSINESS_LOGIC_ERROR"
        )


class ExternalServiceError(DasfabriException):
    """Erro em serviço externo"""
    
    def __init__(self, service: str, detail: str = "Erro ao comunicar com serviço externo"):
        detail = f"Erro no serviço {service}: {detail}"
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=detail,
            error_code="EXTERNAL_SERVICE_ERROR"
        )

