"""
Configuração de cache com Redis
"""

import json
from typing import Any, Optional
from functools import wraps
from redis import Redis
from redis.exceptions import ConnectionError as RedisConnectionError
import os
from loguru import logger

# Configuração Redis
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

# Cliente Redis global
redis_client: Optional[Redis] = None


def get_redis() -> Optional[Redis]:
    """
    Obtém cliente Redis (singleton)
    Retorna None se Redis não estiver disponível (modo degradado)
    """
    global redis_client
    
    if redis_client is None:
        try:
            redis_client = Redis(
                host=REDIS_HOST,
                port=REDIS_PORT,
                db=REDIS_DB,
                password=REDIS_PASSWORD,
                decode_responses=True,
                socket_connect_timeout=2
            )
            # Testar conexão
            redis_client.ping()
            logger.info(f"Redis conectado em {REDIS_HOST}:{REDIS_PORT}")
        except (RedisConnectionError, Exception) as e:
            logger.warning(f"Redis não disponível: {e}. Modo degradado (sem cache)")
            redis_client = None
    
    return redis_client


def cache_key(prefix: str, *args, **kwargs) -> str:
    """
    Gera chave de cache padronizada
    
    Args:
        prefix: Prefixo da chave
        *args, **kwargs: Argumentos para incluir na chave
    
    Returns:
        Chave de cache formatada
    """
    key_parts = [prefix]
    
    if args:
        key_parts.extend(str(arg) for arg in args)
    
    if kwargs:
        sorted_kwargs = sorted(kwargs.items())
        key_parts.extend(f"{k}:{v}" for k, v in sorted_kwargs)
    
    return ":".join(key_parts)


def cached(ttl: int = 300, key_prefix: str = None):
    """
    Decorator para cachear resultado de função
    
    Args:
        ttl: Time to live em segundos (padrão: 5 minutos)
        key_prefix: Prefixo para chave de cache
    
    Usage:
        @cached(ttl=600, key_prefix="exchange_rate")
        def get_exchange_rate(currency: str):
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            redis = get_redis()
            
            # Se Redis não disponível, executa função normalmente
            if redis is None:
                return await func(*args, **kwargs)
            
            # Gerar chave de cache
            prefix = key_prefix or f"{func.__module__}:{func.__name__}"
            cache_key_str = cache_key(prefix, *args, **kwargs)
            
            # Tentar obter do cache
            try:
                cached_value = redis.get(cache_key_str)
                if cached_value:
                    logger.debug(f"Cache hit: {cache_key_str}")
                    return json.loads(cached_value)
            except Exception as e:
                logger.warning(f"Erro ao ler cache: {e}")
            
            # Executar função e cachear resultado
            logger.debug(f"Cache miss: {cache_key_str}")
            result = await func(*args, **kwargs)
            
            try:
                redis.setex(
                    cache_key_str,
                    ttl,
                    json.dumps(result, default=str)
                )
            except Exception as e:
                logger.warning(f"Erro ao escrever cache: {e}")
            
            return result
        
        return wrapper
    return decorator


def invalidate_cache(pattern: str):
    """
    Invalida cache por padrão
    
    Args:
        pattern: Padrão de chaves a invalidar (ex: "exchange_rate:*")
    """
    redis = get_redis()
    if redis is None:
        return
    
    try:
        keys = redis.keys(pattern)
        if keys:
            redis.delete(*keys)
            logger.info(f"Cache invalidado: {len(keys)} chaves removidas")
    except Exception as e:
        logger.warning(f"Erro ao invalidar cache: {e}")

