"""
Configuração de logging estruturado com loguru
"""

import sys
from loguru import logger
from pathlib import Path


def setup_logging(log_level: str = "INFO", log_file: str = None):
    """
    Configura logging estruturado com loguru
    
    Args:
        log_level: Nível de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Caminho opcional para arquivo de log
    """
    # Remover handler padrão
    logger.remove()
    
    # Handler para console com cores
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=log_level,
        colorize=True
    )
    
    # Handler para arquivo (se especificado)
    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        logger.add(
            log_file,
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
            level=log_level,
            rotation="10 MB",
            retention="30 days",
            compression="zip"
        )
    
    return logger


# Configurar logging ao importar
import os
log_level = os.getenv("LOG_LEVEL", "INFO")
log_file = os.getenv("LOG_FILE", None)
setup_logging(log_level, log_file)

