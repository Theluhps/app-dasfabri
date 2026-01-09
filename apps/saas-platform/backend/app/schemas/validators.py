"""
Validators customizados para Pydantic schemas
Melhora validação de dados de negócio
"""

from typing import Any
from pydantic import validator
from datetime import datetime, date
import re


def validate_cnpj(cnpj: str) -> str:
    """
    Valida CNPJ brasileiro
    
    Args:
        cnpj: CNPJ com ou sem formatação
    
    Returns:
        CNPJ limpo (apenas números)
    
    Raises:
        ValueError: Se CNPJ inválido
    """
    # Remover formatação
    cnpj_clean = re.sub(r'[^\d]', '', cnpj)
    
    # Validar tamanho
    if len(cnpj_clean) != 14:
        raise ValueError("CNPJ deve ter 14 dígitos")
    
    # Validar dígitos verificadores
    if len(set(cnpj_clean)) == 1:  # Todos os dígitos iguais
        raise ValueError("CNPJ inválido (todos os dígitos iguais)")
    
    # Calcular primeiro dígito verificador
    weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum1 = sum(int(cnpj_clean[i]) * weights1[i] for i in range(12))
    digit1 = 11 - (sum1 % 11)
    if digit1 >= 10:
        digit1 = 0
    
    if int(cnpj_clean[12]) != digit1:
        raise ValueError("CNPJ inválido (dígito verificador 1)")
    
    # Calcular segundo dígito verificador
    weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum2 = sum(int(cnpj_clean[i]) * weights2[i] for i in range(13))
    digit2 = 11 - (sum2 % 11)
    if digit2 >= 10:
        digit2 = 0
    
    if int(cnpj_clean[13]) != digit2:
        raise ValueError("CNPJ inválido (dígito verificador 2)")
    
    return cnpj_clean


def validate_cpf(cpf: str) -> str:
    """
    Valida CPF brasileiro
    
    Args:
        cpf: CPF com ou sem formatação
    
    Returns:
        CPF limpo (apenas números)
    
    Raises:
        ValueError: Se CPF inválido
    """
    # Remover formatação
    cpf_clean = re.sub(r'[^\d]', '', cpf)
    
    # Validar tamanho
    if len(cpf_clean) != 11:
        raise ValueError("CPF deve ter 11 dígitos")
    
    # Validar dígitos verificadores
    if len(set(cpf_clean)) == 1:  # Todos os dígitos iguais
        raise ValueError("CPF inválido (todos os dígitos iguais)")
    
    # Calcular primeiro dígito verificador
    sum1 = sum(int(cpf_clean[i]) * (10 - i) for i in range(9))
    digit1 = 11 - (sum1 % 11)
    if digit1 >= 10:
        digit1 = 0
    
    if int(cpf_clean[9]) != digit1:
        raise ValueError("CPF inválido (dígito verificador 1)")
    
    # Calcular segundo dígito verificador
    sum2 = sum(int(cpf_clean[i]) * (11 - i) for i in range(10))
    digit2 = 11 - (sum2 % 11)
    if digit2 >= 10:
        digit2 = 0
    
    if int(cpf_clean[10]) != digit2:
        raise ValueError("CPF inválido (dígito verificador 2)")
    
    return cpf_clean


def validate_ncm(ncm_code: str) -> str:
    """
    Valida código NCM (Nomenclatura Comum do Mercosul)
    
    Args:
        ncm_code: Código NCM (8 dígitos)
    
    Returns:
        Código NCM limpo
    
    Raises:
        ValueError: Se NCM inválido
    """
    # Remover formatação
    ncm_clean = re.sub(r'[^\d]', '', ncm_code)
    
    if len(ncm_clean) != 8:
        raise ValueError("Código NCM deve ter 8 dígitos")
    
    if not ncm_clean.isdigit():
        raise ValueError("Código NCM deve conter apenas números")
    
    return ncm_clean


def validate_email(email: str) -> str:
    """
    Valida formato de email
    
    Args:
        email: Email a validar
    
    Returns:
        Email em lowercase
    
    Raises:
        ValueError: Se email inválido
    """
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(email_pattern, email):
        raise ValueError("Formato de email inválido")
    
    return email.lower()


def validate_currency_code(currency: str) -> str:
    """
    Valida código de moeda (ISO 4217)
    
    Args:
        currency: Código de moeda (ex: USD, BRL, EUR)
    
    Returns:
        Código em uppercase
    
    Raises:
        ValueError: Se código inválido
    """
    valid_currencies = {
        'USD', 'BRL', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD',
        'CHF', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'PYG'
    }
    
    currency_upper = currency.upper()
    
    if currency_upper not in valid_currencies:
        raise ValueError(f"Código de moeda inválido. Válidos: {', '.join(sorted(valid_currencies))}")
    
    return currency_upper


def validate_date_not_past(date_value: date) -> date:
    """
    Valida que data não está no passado
    
    Args:
        date_value: Data a validar
    
    Returns:
        Data validada
    
    Raises:
        ValueError: Se data no passado
    """
    if date_value < date.today():
        raise ValueError("Data não pode estar no passado")
    
    return date_value


def validate_date_range(start_date: date, end_date: date) -> tuple:
    """
    Valida que data final é posterior à data inicial
    
    Args:
        start_date: Data inicial
        end_date: Data final
    
    Returns:
        Tupla (start_date, end_date)
    
    Raises:
        ValueError: Se data final anterior à inicial
    """
    if end_date < start_date:
        raise ValueError("Data final deve ser posterior à data inicial")
    
    return (start_date, end_date)


def validate_positive_number(value: float, field_name: str = "Valor") -> float:
    """
    Valida que número é positivo
    
    Args:
        value: Valor a validar
        field_name: Nome do campo (para mensagem de erro)
    
    Returns:
        Valor validado
    
    Raises:
        ValueError: Se valor não positivo
    """
    if value <= 0:
        raise ValueError(f"{field_name} deve ser maior que zero")
    
    return value


def validate_percentage(value: float, field_name: str = "Percentual") -> float:
    """
    Valida que valor está entre 0 e 100 (percentual)
    
    Args:
        value: Valor a validar
        field_name: Nome do campo
    
    Returns:
        Valor validado
    
    Raises:
        ValueError: Se valor fora do range
    """
    if value < 0 or value > 100:
        raise ValueError(f"{field_name} deve estar entre 0 e 100")
    
    return value


def validate_reference_number(ref_number: str) -> str:
    """
    Valida número de referência (alphanumérico, sem caracteres especiais)
    
    Args:
        ref_number: Número de referência
    
    Returns:
        Número de referência validado
    
    Raises:
        ValueError: Se formato inválido
    """
    if not ref_number:
        raise ValueError("Número de referência não pode ser vazio")
    
    if len(ref_number) < 3:
        raise ValueError("Número de referência deve ter pelo menos 3 caracteres")
    
    if len(ref_number) > 50:
        raise ValueError("Número de referência deve ter no máximo 50 caracteres")
    
    # Permitir letras, números, hífen e underscore
    if not re.match(r'^[a-zA-Z0-9_-]+$', ref_number):
        raise ValueError("Número de referência deve conter apenas letras, números, hífen e underscore")
    
    return ref_number

