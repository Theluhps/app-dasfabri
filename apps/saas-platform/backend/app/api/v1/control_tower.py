"""
Control Tower API - Visão única de toda a supply chain
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.security import get_current_user
from app.models import (
    User, Company, ImportProcess, ExportProcess, Container,
    TrackingEvent, ComplianceCheck, Payment, Approval,
    DrawbackAct, Warehouse, InventoryItem
)
from pydantic import BaseModel

router = APIRouter()

# Schemas
class ControlTowerSummary(BaseModel):
    """Resumo geral do Control Tower"""
    total_processes: int
    active_processes: int
    pending_approvals: int
    critical_alerts: int
    compliance_rate: float
    on_time_delivery_rate: float
    total_value: float
    currency: str

class ProcessStatusSummary(BaseModel):
    """Resumo de status de processos"""
    status: str
    count: int
    percentage: float

class AlertSummary(BaseModel):
    """Resumo de alertas"""
    type: str  # critical, warning, info
    count: int
    items: List[dict]

class ControlTowerDashboard(BaseModel):
    """Dashboard completo do Control Tower"""
    summary: ControlTowerSummary
    import_statuses: List[ProcessStatusSummary]
    export_statuses: List[ProcessStatusSummary]
    critical_alerts: List[AlertSummary]
    recent_events: List[dict]
    compliance_overview: dict
    financial_summary: dict
    logistics_summary: dict

@router.get("/summary", response_model=ControlTowerSummary)
async def get_control_tower_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter resumo geral do Control Tower"""
    company_id = current_user.company_id
    
    # Total de processos
    total_imports = db.query(ImportProcess).filter(
        ImportProcess.company_id == company_id
    ).count()
    total_exports = db.query(ExportProcess).filter(
        ExportProcess.company_id == company_id
    ).count()
    total_processes = total_imports + total_exports
    
    # Processos ativos
    active_imports = db.query(ImportProcess).filter(
        and_(
            ImportProcess.company_id == company_id,
            ImportProcess.status.in_(["pending", "in_progress"])
        )
    ).count()
    active_exports = db.query(ExportProcess).filter(
        and_(
            ExportProcess.company_id == company_id,
            ExportProcess.status.in_(["pending", "in_progress", "shipped"])
        )
    ).count()
    active_processes = active_imports + active_exports
    
    # Aprovações pendentes
    pending_approvals = db.query(Approval).filter(
        and_(
            Approval.company_id == company_id,
            Approval.status == "pending"
        )
    ).count()
    
    # Alertas críticos (compliance não-compliant)
    critical_alerts = db.query(ComplianceCheck).filter(
        and_(
            ComplianceCheck.company_id == company_id,
            ComplianceCheck.status == "non-compliant",
            ComplianceCheck.required == True
        )
    ).count()
    
    # Taxa de compliance
    total_checks = db.query(ComplianceCheck).filter(
        ComplianceCheck.company_id == company_id
    ).count()
    compliant_checks = db.query(ComplianceCheck).filter(
        and_(
            ComplianceCheck.company_id == company_id,
            ComplianceCheck.status == "compliant"
        )
    ).count()
    compliance_rate = (compliant_checks / total_checks * 100) if total_checks > 0 else 100.0
    
    # Taxa de entrega no prazo (simplificado)
    on_time_delivery_rate = 95.0  # Mock - calcular baseado em dados reais
    
    # Valor total
    total_value = 0.0
    currency = "USD"
    
    return ControlTowerSummary(
        total_processes=total_processes,
        active_processes=active_processes,
        pending_approvals=pending_approvals,
        critical_alerts=critical_alerts,
        compliance_rate=round(compliance_rate, 2),
        on_time_delivery_rate=on_time_delivery_rate,
        total_value=total_value,
        currency=currency
    )

@router.get("/dashboard", response_model=ControlTowerDashboard)
async def get_control_tower_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter dashboard completo do Control Tower"""
    company_id = current_user.company_id
    
    # Resumo geral
    summary = await get_control_tower_summary(db, current_user)
    
    # Status de importações
    import_statuses = []
    import_counts = db.query(
        ImportProcess.status,
        func.count(ImportProcess.id).label('count')
    ).filter(
        ImportProcess.company_id == company_id
    ).group_by(ImportProcess.status).all()
    
    total_imports = sum(count for _, count in import_counts)
    for status, count in import_counts:
        import_statuses.append(ProcessStatusSummary(
            status=status,
            count=count,
            percentage=round((count / total_imports * 100) if total_imports > 0 else 0, 2)
        ))
    
    # Status de exportações
    export_statuses = []
    export_counts = db.query(
        ExportProcess.status,
        func.count(ExportProcess.id).label('count')
    ).filter(
        ExportProcess.company_id == company_id
    ).group_by(ExportProcess.status).all()
    
    total_exports = sum(count for _, count in export_counts)
    for status, count in export_counts:
        export_statuses.append(ProcessStatusSummary(
            status=status,
            count=count,
            percentage=round((count / total_exports * 100) if total_exports > 0 else 0, 2)
        ))
    
    # Alertas críticos
    critical_checks = db.query(ComplianceCheck).filter(
        and_(
            ComplianceCheck.company_id == company_id,
            ComplianceCheck.status == "non-compliant",
            ComplianceCheck.required == True
        )
    ).limit(10).all()
    
    critical_alerts = [AlertSummary(
        type="critical",
        count=len(critical_checks),
        items=[{
            "id": check.id,
            "name": check.name,
            "category": check.category,
            "process_id": check.import_process_id or check.export_process_id
        } for check in critical_checks]
    )]
    
    # Eventos recentes
    recent_events = db.query(TrackingEvent).filter(
        TrackingEvent.company_id == company_id
    ).order_by(TrackingEvent.timestamp.desc()).limit(10).all()
    
    recent_events_list = [{
        "id": event.id,
        "shipment_id": event.shipment_id,
        "status": event.status,
        "location": event.location,
        "timestamp": event.timestamp.isoformat(),
        "description": event.description
    } for event in recent_events]
    
    # Overview de compliance
    compliance_overview = {
        "total": db.query(ComplianceCheck).filter(
            ComplianceCheck.company_id == company_id
        ).count(),
        "compliant": db.query(ComplianceCheck).filter(
            and_(
                ComplianceCheck.company_id == company_id,
                ComplianceCheck.status == "compliant"
            )
        ).count(),
        "non_compliant": db.query(ComplianceCheck).filter(
            and_(
                ComplianceCheck.company_id == company_id,
                ComplianceCheck.status == "non-compliant"
            )
        ).count(),
        "pending": db.query(ComplianceCheck).filter(
            and_(
                ComplianceCheck.company_id == company_id,
                ComplianceCheck.status == "pending"
            )
        ).count()
    }
    
    # Resumo financeiro
    financial_summary = {
        "total_payments": db.query(Payment).filter(
            Payment.company_id == company_id
        ).count(),
        "pending_payments": db.query(Payment).filter(
            and_(
                Payment.company_id == company_id,
                Payment.status == "pending"
            )
        ).count()
    }
    
    # Resumo logístico
    logistics_summary = {
        "total_containers": db.query(Container).filter(
            Container.company_id == company_id
        ).count(),
        "in_transit": db.query(Container).filter(
            and_(
                Container.company_id == company_id,
                Container.status == "in_transit"
            )
        ).count(),
        "total_warehouses": db.query(Warehouse).filter(
            Warehouse.company_id == company_id
        ).count()
    }
    
    return ControlTowerDashboard(
        summary=summary,
        import_statuses=import_statuses,
        export_statuses=export_statuses,
        critical_alerts=critical_alerts,
        recent_events=recent_events_list,
        compliance_overview=compliance_overview,
        financial_summary=financial_summary,
        logistics_summary=logistics_summary
    )

@router.get("/processes/all")
async def get_all_processes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[str] = None,
    limit: int = Query(50, le=100)
):
    """Obter todos os processos (import + export)"""
    company_id = current_user.company_id
    
    # Importações
    import_query = db.query(ImportProcess).filter(
        ImportProcess.company_id == company_id
    )
    if status:
        import_query = import_query.filter(ImportProcess.status == status)
    
    imports = import_query.limit(limit).all()
    
    # Exportações
    export_query = db.query(ExportProcess).filter(
        ExportProcess.company_id == company_id
    )
    if status:
        export_query = export_query.filter(ExportProcess.status == status)
    
    exports = export_query.limit(limit).all()
    
    processes = []
    for imp in imports:
        processes.append({
            "id": imp.id,
            "type": "import",
            "reference_number": imp.reference_number,
            "status": imp.status,
            "client": imp.client,
            "product": imp.product,
            "created_at": imp.created_at.isoformat() if imp.created_at else None
        })
    
    for exp in exports:
        processes.append({
            "id": exp.id,
            "type": "export",
            "reference_number": exp.reference_number,
            "status": exp.status,
            "client": exp.client,
            "product": exp.product,
            "created_at": exp.created_at.isoformat() if exp.created_at else None
        })
    
    return {"processes": processes, "total": len(processes)}

