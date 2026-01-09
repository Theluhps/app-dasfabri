"""
Dashboard Config API - Configuração de widgets do dashboard
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models import User, UserDashboardConfig
from app.core.exceptions import NotFoundError, BusinessLogicError
from app.core.logging_config import logger
from pydantic import BaseModel

router = APIRouter()

# Schemas
class WidgetConfig(BaseModel):
    id: str
    enabled: bool
    position: Optional[int] = None
    size: Optional[str] = None  # 'small', 'medium', 'large'
    settings: Optional[Dict[str, Any]] = None

class DashboardConfigResponse(BaseModel):
    id: int
    user_id: int
    widgets_config: Dict[str, Any]
    layout_config: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class DashboardConfigUpdate(BaseModel):
    widgets_config: Optional[Dict[str, Any]] = None
    layout_config: Optional[Dict[str, Any]] = None

# Widgets disponíveis
AVAILABLE_WIDGETS = [
    {"id": "kpis", "name": "KPIs Principais", "description": "Métricas principais do negócio"},
    {"id": "pending_tasks", "name": "Tarefas Pendentes", "description": "Lista de tarefas pendentes"},
    {"id": "recent_processes", "name": "Processos Recentes", "description": "Últimos processos de importação/exportação"},
    {"id": "alerts", "name": "Alertas", "description": "Alertas e notificações importantes"},
    {"id": "performance_chart", "name": "Gráfico de Performance", "description": "Gráfico de performance ao longo do tempo"},
    {"id": "watchlist", "name": "Favoritos", "description": "Processos favoritos"},
    {"id": "overdue_tasks", "name": "Tarefas Atrasadas", "description": "Tarefas com prazo vencido"},
    {"id": "revenue_summary", "name": "Resumo Financeiro", "description": "Resumo de receitas e custos"},
]

@router.get("/available-widgets")
async def get_available_widgets(
    current_user: User = Depends(get_current_user)
):
    """Listar widgets disponíveis para o dashboard"""
    return {
        "widgets": AVAILABLE_WIDGETS,
        "total": len(AVAILABLE_WIDGETS)
    }

@router.get("/", response_model=DashboardConfigResponse)
async def get_dashboard_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter configuração do dashboard do usuário"""
    config = db.query(UserDashboardConfig).filter(
        UserDashboardConfig.user_id == current_user.id
    ).first()
    
    if not config:
        # Criar configuração padrão
        default_config = {
            "widgets": [
                {"id": "kpis", "enabled": True, "position": 0},
                {"id": "pending_tasks", "enabled": True, "position": 1},
                {"id": "recent_processes", "enabled": True, "position": 2},
                {"id": "alerts", "enabled": True, "position": 3},
            ]
        }
        
        config = UserDashboardConfig(
            user_id=current_user.id,
            company_id=current_user.company_id,
            widgets_config=default_config,
            layout_config={}
        )
        db.add(config)
        db.commit()
        db.refresh(config)
    
    return DashboardConfigResponse.from_orm(config)

@router.put("/", response_model=DashboardConfigResponse)
async def update_dashboard_config(
    config_update: DashboardConfigUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar configuração do dashboard"""
    config = db.query(UserDashboardConfig).filter(
        UserDashboardConfig.user_id == current_user.id
    ).first()
    
    if not config:
        # Criar nova configuração
        config = UserDashboardConfig(
            user_id=current_user.id,
            company_id=current_user.company_id,
            widgets_config=config_update.widgets_config or {"widgets": []},
            layout_config=config_update.layout_config or {}
        )
        db.add(config)
    else:
        # Atualizar configuração existente
        if config_update.widgets_config is not None:
            config.widgets_config = config_update.widgets_config
        if config_update.layout_config is not None:
            config.layout_config = config_update.layout_config
        config.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(config)
    
    logger.info(f"Configuração do dashboard atualizada para usuário {current_user.id}")
    return DashboardConfigResponse.from_orm(config)

@router.post("/reset")
async def reset_dashboard_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Resetar configuração do dashboard para padrão"""
    config = db.query(UserDashboardConfig).filter(
        UserDashboardConfig.user_id == current_user.id
    ).first()
    
    default_config = {
        "widgets": [
            {"id": "kpis", "enabled": True, "position": 0},
            {"id": "pending_tasks", "enabled": True, "position": 1},
            {"id": "recent_processes", "enabled": True, "position": 2},
            {"id": "alerts", "enabled": True, "position": 3},
        ]
    }
    
    if config:
        config.widgets_config = default_config
        config.layout_config = {}
        config.updated_at = datetime.utcnow()
    else:
        config = UserDashboardConfig(
            user_id=current_user.id,
            company_id=current_user.company_id,
            widgets_config=default_config,
            layout_config={}
        )
        db.add(config)
    
    db.commit()
    db.refresh(config)
    
    logger.info(f"Configuração do dashboard resetada para usuário {current_user.id}")
    return DashboardConfigResponse.from_orm(config)

