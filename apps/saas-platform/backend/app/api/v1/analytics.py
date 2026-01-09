from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
from sqlalchemy import func, and_, extract
from app.models import User, Company, ImportProcess, ExportProcess, Supplier, Client, Payment, ExchangeRate, Container, PurchaseOrder, Workflow, Approval, AccessRequest
from app.schemas import *
from app.core.security import authenticate_user, get_current_user, create_access_token, get_password_hash
from app.core.database import get_db
from app.core.database import get_db

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter dados do dashboard principal"""
    
    # Estatísticas de importação
    import_stats = db.query(
        func.count(models.ImportProcess.id).label('total'),
        func.count(models.ImportProcess.id).filter(
            models.ImportProcess.status == models.ImportStatus.pending
        ).label('pending'),
        func.count(models.ImportProcess.id).filter(
            models.ImportProcess.status == models.ImportStatus.completed
        ).label('completed')
    ).filter(
        models.ImportProcess.company_id == current_user.company_id
    ).first()
    
    # Estatísticas de exportação
    export_stats = db.query(
        func.count(models.ExportProcess.id).label('total'),
        func.count(models.ExportProcess.id).filter(
            models.ExportProcess.status == models.ExportStatus.pending
        ).label('pending'),
        func.count(models.ExportProcess.id).filter(
            models.ExportProcess.status == models.ExportStatus.delivered
        ).label('delivered')
    ).filter(
        models.ExportProcess.company_id == current_user.company_id
    ).first()
    
    # Estatísticas financeiras
    payment_stats = db.query(
        func.count(models.Payment.id).label('total'),
        func.sum(models.Payment.amount).filter(
            models.Payment.status == models.PaymentStatus.pending
        ).label('pending_amount'),
        func.sum(models.Payment.amount).filter(
            models.Payment.status == models.PaymentStatus.paid
        ).label('paid_amount')
    ).filter(
        models.Payment.company_id == current_user.company_id
    ).first()
    
    # Aprovações pendentes
    pending_approvals = db.query(models.Approval).filter(
        models.Approval.company_id == current_user.company_id,
        models.Approval.status == models.ApprovalStatus.pending
    ).count()
    
    return {
        "imports": {
            "total": import_stats.total,
            "pending": import_stats.pending,
            "completed": import_stats.completed
        },
        "exports": {
            "total": export_stats.total,
            "pending": export_stats.pending,
            "delivered": export_stats.delivered
        },
        "payments": {
            "total": payment_stats.total,
            "pending_amount": float(payment_stats.pending_amount) if payment_stats.pending_amount else 0,
            "paid_amount": float(payment_stats.paid_amount) if payment_stats.paid_amount else 0
        },
        "pending_approvals": pending_approvals
    }

@router.get("/imports/trend")
def get_import_trends(
    period: str = Query("month", regex="^(day|week|month|year)$"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter tendências de importação"""
    
    if period == "day":
        # Últimos 30 dias
        start_date = datetime.utcnow() - timedelta(days=30)
        group_by = func.date(models.ImportProcess.created_at)
    elif period == "week":
        # Últimas 12 semanas
        start_date = datetime.utcnow() - timedelta(weeks=12)
        group_by = func.date_trunc('week', models.ImportProcess.created_at)
    elif period == "month":
        # Últimos 12 meses
        start_date = datetime.utcnow() - timedelta(days=365)
        group_by = func.date_trunc('month', models.ImportProcess.created_at)
    else:  # year
        # Últimos 5 anos
        start_date = datetime.utcnow() - timedelta(days=5*365)
        group_by = func.date_trunc('year', models.ImportProcess.created_at)
    
    trends = db.query(
        group_by.label('period'),
        func.count(models.ImportProcess.id).label('count')
    ).filter(
        models.ImportProcess.company_id == current_user.company_id,
        models.ImportProcess.created_at >= start_date
    ).group_by(group_by).order_by(group_by).all()
    
    return [
        {
            "period": str(trend.period),
            "count": trend.count
        }
        for trend in trends
    ]

@router.get("/exports/trend")
def get_export_trends(
    period: str = Query("month", regex="^(day|week|month|year)$"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter tendências de exportação"""
    
    if period == "day":
        start_date = datetime.utcnow() - timedelta(days=30)
        group_by = func.date(models.ExportProcess.created_at)
    elif period == "week":
        start_date = datetime.utcnow() - timedelta(weeks=12)
        group_by = func.date_trunc('week', models.ExportProcess.created_at)
    elif period == "month":
        start_date = datetime.utcnow() - timedelta(days=365)
        group_by = func.date_trunc('month', models.ExportProcess.created_at)
    else:
        start_date = datetime.utcnow() - timedelta(days=5*365)
        group_by = func.date_trunc('year', models.ExportProcess.created_at)
    
    trends = db.query(
        group_by.label('period'),
        func.count(models.ExportProcess.id).label('count')
    ).filter(
        models.ExportProcess.company_id == current_user.company_id,
        models.ExportProcess.created_at >= start_date
    ).group_by(group_by).order_by(group_by).all()
    
    return [
        {
            "period": str(trend.period),
            "count": trend.count
        }
        for trend in trends
    ]

@router.get("/financial/summary")
def get_financial_summary(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_manager_or_admin_role)
):
    """Obter resumo financeiro"""
    
    query = db.query(models.Payment).filter(
        models.Payment.company_id == current_user.company_id
    )
    
    if start_date:
        query = query.filter(models.Payment.due_date >= start_date)
    if end_date:
        query = query.filter(models.Payment.due_date <= end_date)
    
    # Total de pagamentos
    total_payments = query.count()
    
    # Valores por status
    status_summary = db.query(
        models.Payment.status,
        func.count(models.Payment.id).label('count'),
        func.sum(models.Payment.amount).label('total_amount')
    ).filter(
        models.Payment.company_id == current_user.company_id
    )
    
    if start_date:
        status_summary = status_summary.filter(models.Payment.due_date >= start_date)
    if end_date:
        status_summary = status_summary.filter(models.Payment.due_date <= end_date)
    
    status_summary = status_summary.group_by(models.Payment.status).all()
    
    # Pagamentos vencidos
    overdue_payments = query.filter(
        models.Payment.status == models.PaymentStatus.pending,
        models.Payment.due_date < datetime.utcnow().date()
    ).count()
    
    return {
        "total_payments": total_payments,
        "overdue_payments": overdue_payments,
        "by_status": [
            {
                "status": summary.status,
                "count": summary.count,
                "total_amount": float(summary.total_amount) if summary.total_amount else 0
            }
            for summary in status_summary
        ]
    }

@router.get("/suppliers/performance")
def get_supplier_performance(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter performance dos fornecedores"""
    
    # Contagem de processos por fornecedor
    supplier_stats = db.query(
        models.ImportProcess.supplier,
        func.count(models.ImportProcess.id).label('total_processes'),
        func.count(models.ImportProcess.id).filter(
            models.ImportProcess.status == models.ImportStatus.completed
        ).label('completed_processes'),
        func.avg(models.ImportProcess.total_value).label('avg_value')
    ).filter(
        models.ImportProcess.company_id == current_user.company_id
    ).group_by(models.ImportProcess.supplier).all()
    
    return [
        {
            "supplier": stat.supplier,
            "total_processes": stat.total_processes,
            "completed_processes": stat.completed_processes,
            "completion_rate": round((stat.completed_processes / stat.total_processes) * 100, 2) if stat.total_processes > 0 else 0,
            "avg_value": float(stat.avg_value) if stat.avg_value else 0
        }
        for stat in supplier_stats
    ]

@router.get("/clients/performance")
def get_client_performance(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter performance dos clientes"""
    
    # Contagem de processos por cliente
    client_stats = db.query(
        models.ExportProcess.client,
        func.count(models.ExportProcess.id).label('total_processes'),
        func.count(models.ExportProcess.id).filter(
            models.ExportProcess.status == models.ExportStatus.delivered
        ).label('delivered_processes'),
        func.avg(models.ExportProcess.total_value).label('avg_value')
    ).filter(
        models.ExportProcess.company_id == current_user.company_id
    ).group_by(models.ExportProcess.client).all()
    
    return [
        {
            "client": stat.client,
            "total_processes": stat.total_processes,
            "delivered_processes": stat.delivered_processes,
            "delivery_rate": round((stat.delivered_processes / stat.total_processes) * 100, 2) if stat.total_processes > 0 else 0,
            "avg_value": float(stat.avg_value) if stat.avg_value else 0
        }
        for stat in client_stats
    ]

@router.get("/workflow/efficiency")
def get_workflow_efficiency(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter eficiência dos workflows"""
    
    # Estatísticas de aprovações
    approval_stats = db.query(
        models.Approval.approval_type,
        func.count(models.Approval.id).label('total'),
        func.count(models.Approval.id).filter(
            models.Approval.status == models.ApprovalStatus.approved
        ).label('approved'),
        func.count(models.Approval.id).filter(
            models.Approval.status == models.ApprovalStatus.rejected
        ).label('rejected'),
        func.avg(
            func.extract('epoch', models.Approval.approved_at - models.Approval.created_at)
        ).filter(
            models.Approval.status == models.ApprovalStatus.approved
        ).label('avg_approval_time')
    ).filter(
        models.Approval.company_id == current_user.company_id
    ).group_by(models.Approval.approval_type).all()
    
    return [
        {
            "approval_type": stat.approval_type,
            "total": stat.total,
            "approved": stat.approved,
            "rejected": stat.rejected,
            "approval_rate": round((stat.approved / stat.total) * 100, 2) if stat.total > 0 else 0,
            "avg_approval_time_hours": round(stat.avg_approval_time / 3600, 2) if stat.avg_approval_time else 0
        }
        for stat in approval_stats
    ]

@router.get("/geographic/distribution")
def get_geographic_distribution(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Obter distribuição geográfica"""
    
    # Países de origem (importação)
    import_countries = db.query(
        models.ImportProcess.origin_country,
        func.count(models.ImportProcess.id).label('count')
    ).filter(
        models.ImportProcess.company_id == current_user.company_id,
        models.ImportProcess.origin_country.isnot(None)
    ).group_by(models.ImportProcess.origin_country).all()
    
    # Países de destino (exportação)
    export_countries = db.query(
        models.ExportProcess.destination_country,
        func.count(models.ExportProcess.id).label('count')
    ).filter(
        models.ExportProcess.company_id == current_user.company_id,
        models.ExportProcess.destination_country.isnot(None)
    ).group_by(models.ExportProcess.destination_country).all()
    
    return {
        "import_countries": [
            {"country": country.origin_country, "count": country.count}
            for country in import_countries
        ],
        "export_countries": [
            {"country": country.destination_country, "count": country.count}
            for country in export_countries
        ]
    }

@router.get("/reports/custom")
def generate_custom_report(
    report_type: str = Query(..., regex="^(imports|exports|payments|suppliers|clients)$"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    group_by: Optional[str] = Query(None, regex="^(status|month|country|supplier|client)$"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_manager_or_admin_role)
):
    """Gerar relatório customizado"""
    
    if report_type == "imports":
        base_query = db.query(models.ImportProcess).filter(
            models.ImportProcess.company_id == current_user.company_id
        )
        if start_date:
            base_query = base_query.filter(models.ImportProcess.created_at >= start_date)
        if end_date:
            base_query = base_query.filter(models.ImportProcess.created_at <= end_date)
            
        if group_by == "status":
            result = base_query.with_entities(
                models.ImportProcess.status,
                func.count(models.ImportProcess.id).label('count')
            ).group_by(models.ImportProcess.status).all()
        elif group_by == "month":
            result = base_query.with_entities(
                func.date_trunc('month', models.ImportProcess.created_at).label('period'),
                func.count(models.ImportProcess.id).label('count')
            ).group_by(func.date_trunc('month', models.ImportProcess.created_at)).all()
        elif group_by == "country":
            result = base_query.with_entities(
                models.ImportProcess.origin_country,
                func.count(models.ImportProcess.id).label('count')
            ).group_by(models.ImportProcess.origin_country).all()
        elif group_by == "supplier":
            result = base_query.with_entities(
                models.ImportProcess.supplier,
                func.count(models.ImportProcess.id).label('count')
            ).group_by(models.ImportProcess.supplier).all()
        else:
            result = base_query.all()
    
    elif report_type == "exports":
        base_query = db.query(models.ExportProcess).filter(
            models.ExportProcess.company_id == current_user.company_id
        )
        if start_date:
            base_query = base_query.filter(models.ExportProcess.created_at >= start_date)
        if end_date:
            base_query = base_query.filter(models.ExportProcess.created_at <= end_date)
            
        if group_by == "status":
            result = base_query.with_entities(
                models.ExportProcess.status,
                func.count(models.ExportProcess.id).label('count')
            ).group_by(models.ExportProcess.status).all()
        elif group_by == "month":
            result = base_query.with_entities(
                func.date_trunc('month', models.ExportProcess.created_at).label('period'),
                func.count(models.ExportProcess.id).label('count')
            ).group_by(func.date_trunc('month', models.ExportProcess.created_at)).all()
        elif group_by == "country":
            result = base_query.with_entities(
                models.ExportProcess.destination_country,
                func.count(models.ExportProcess.id).label('count')
            ).group_by(models.ExportProcess.destination_country).all()
        elif group_by == "client":
            result = base_query.with_entities(
                models.ExportProcess.client,
                func.count(models.ExportProcess.id).label('count')
            ).group_by(models.ExportProcess.client).all()
        else:
            result = base_query.all()
    
    elif report_type == "payments":
        base_query = db.query(models.Payment).filter(
            models.Payment.company_id == current_user.company_id
        )
        if start_date:
            base_query = base_query.filter(models.Payment.due_date >= start_date)
        if end_date:
            base_query = base_query.filter(models.Payment.due_date <= end_date)
            
        if group_by == "status":
            result = base_query.with_entities(
                models.Payment.status,
                func.count(models.Payment.id).label('count'),
                func.sum(models.Payment.amount).label('total_amount')
            ).group_by(models.Payment.status).all()
        elif group_by == "month":
            result = base_query.with_entities(
                func.date_trunc('month', models.Payment.due_date).label('period'),
                func.count(models.Payment.id).label('count'),
                func.sum(models.Payment.amount).label('total_amount')
            ).group_by(func.date_trunc('month', models.Payment.due_date)).all()
        else:
            result = base_query.all()
    
    else:
        raise HTTPException(status_code=400, detail="Tipo de relatório não suportado")
    
    return {
        "report_type": report_type,
        "group_by": group_by,
        "start_date": start_date,
        "end_date": end_date,
        "data": result
    } 