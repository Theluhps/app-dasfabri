from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.models import Base
from app.core.middleware import (
    exception_handler,
    dasfabri_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    response_validation_exception_handler
)
from app.core.exceptions import DasfabriException
from fastapi.exceptions import RequestValidationError, ResponseValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.logging_config import logger

# Importar todas as rotas
# Temporariamente comentado para evitar erros de importação
# from app.api.v1.access_requests import router as access_router
# from app.api.v1.companies import router as companies_router
# from app.api.v1.users import router as users_router
from app.api.v1.auth import router as auth_router
# Rotas antigas - temporariamente comentadas (têm problemas de schemas)
# from app.api.v1.import_processes import router as import_router
# from app.api.v1.suppliers import router as suppliers_router
# from app.api.v1.export_processes import router as export_router
# from app.api.v1.clients import router as clients_router
# from app.api.v1.payments import router as payments_router
# from app.api.v1.exchange_rates import router as exchange_router
# from app.api.v1.containers import router as containers_router
# from app.api.v1.purchase_orders import router as po_router
# from app.api.v1.workflows import router as workflows_router
# from app.api.v1.approvals import router as approvals_router
# from app.api.v1.analytics import router as analytics_router

# Criar tabelas (temporariamente comentado - usar migrations)
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dasfabri API",
    description="API completa para sistema de comércio exterior SaaS",
    version="1.0.0"
)

# Configurar handlers de exceção
app.add_exception_handler(DasfabriException, dasfabri_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(ResponseValidationError, response_validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, exception_handler)

# Logging de startup
logger.info("🚀 Dasfabri API iniciando...")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas de Autenticação e Usuários
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Autenticação"])
# Temporariamente comentado - corrigir importações depois
# app.include_router(users_router, prefix="/api/v1/users", tags=["Usuários"])
# app.include_router(companies_router, prefix="/api/v1/companies", tags=["Empresas"])
# app.include_router(access_router, prefix="/api/v1/access", tags=["Solicitações de Acesso"])

# Rotas Públicas (para site de marketing)
from app.api.v1.public_contact import router as public_contact_router
app.include_router(public_contact_router, prefix="/api/v1/public", tags=["Contato Público"])

# Rotas antigas - temporariamente comentadas
# app.include_router(import_router, prefix="/api/v1/imports", tags=["Importação"])
# app.include_router(suppliers_router, prefix="/api/v1/suppliers", tags=["Fornecedores"])
# app.include_router(export_router, prefix="/api/v1/exports", tags=["Exportação"])
# app.include_router(clients_router, prefix="/api/v1/clients", tags=["Clientes"])
# app.include_router(payments_router, prefix="/api/v1/payments", tags=["Pagamentos"])
# app.include_router(exchange_router, prefix="/api/v1/exchange-rates", tags=["Taxas de Câmbio"])
# app.include_router(containers_router, prefix="/api/v1/containers", tags=["Containers"])
# app.include_router(po_router, prefix="/api/v1/purchase-orders", tags=["Pedidos de Compra"])
# app.include_router(workflows_router, prefix="/api/v1/workflows", tags=["Workflows"])
# app.include_router(approvals_router, prefix="/api/v1/approvals", tags=["Aprovações"])
# app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Analytics"])

# Rotas de Documentos com OCR
from app.api.v1.documents import router as documents_router
app.include_router(documents_router, prefix="/api/v1/documents", tags=["Documentos"])

# Rotas de Tracking
from app.api.v1.tracking import router as tracking_router
app.include_router(tracking_router, prefix="/api/v1/tracking", tags=["Tracking"])

# Rotas de Compliance
from app.api.v1.compliance import router as compliance_router
app.include_router(compliance_router, prefix="/api/v1/compliance", tags=["Compliance"])

# Rotas de Comments
from app.api.v1.comments import router as comments_router
app.include_router(comments_router, prefix="/api/v1/comments", tags=["Comentários"])

# Rotas de Dashboard Inteligente
from app.api.v1.dashboard import router as dashboard_router
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["Dashboard"])

# Rotas de Cálculos Tributários
from app.api.v1.taxes import router as taxes_router
app.include_router(taxes_router, prefix="/api/v1/taxes", tags=["Cálculos Tributários"])

# Rotas de Control Tower
from app.api.v1.control_tower import router as control_tower_router
app.include_router(control_tower_router, prefix="/api/v1/control-tower", tags=["Control Tower"])

# Rotas de Drawback
from app.api.v1.drawback import router as drawback_router
app.include_router(drawback_router, prefix="/api/v1/drawback", tags=["Drawback"])

# Rotas de Produtos
from app.api.v1.products import router as products_router
app.include_router(products_router, prefix="/api/v1/products", tags=["Produtos"])

# Rotas de Warehouse
from app.api.v1.warehouses import router as warehouses_router
app.include_router(warehouses_router, prefix="/api/v1/warehouses", tags=["Warehouse"])

# Rotas de Classificação
from app.api.v1.classification import router as classification_router
app.include_router(classification_router, prefix="/api/v1/classification", tags=["Classificação"])

# Rotas de Alfândega Avançado
from app.api.v1.customs import router as customs_router
app.include_router(customs_router, prefix="/api/v1/customs", tags=["Alfândega"])

# Rotas de Tasks
from app.api.v1.tasks import router as tasks_router
app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["Tasks"])

# Rotas de Dashboard Config
from app.api.v1.dashboard_config import router as dashboard_config_router
app.include_router(dashboard_config_router, prefix="/api/v1/user/dashboard-config", tags=["Dashboard Config"])

# Rotas de Import Processes (descomentado)
from app.api.v1.import_processes import router as import_processes_router
app.include_router(import_processes_router, prefix="/api/v1/import-processes", tags=["Processos de Importação"])

@app.get("/", response_model=dict)
async def root():
    """
    Rota raiz da API
    """
    from fastapi.responses import JSONResponse
    
    return JSONResponse(
        content={
            "message": "Bem-vindo à API da Dasfabri",
            "version": "1.0.0",
            "description": "Sistema completo de comércio exterior SaaS",
            "modules": [
                "Autenticação e Usuários",
                "Importação e Fornecedores", 
                "Exportação e Clientes",
                "Financeiro e Câmbio",
                "Logística e Containers",
                "Pedidos de Compra",
                "Workflows e Aprovações",
                "Analytics e Relatórios"
            ],
            "endpoints": {
                "auth": "/api/v1/auth",
                "users": "/api/v1/users",
                "companies": "/api/v1/companies",
                "access": "/api/v1/access",
                "imports": "/api/v1/import-processes",
                "suppliers": "/api/v1/suppliers",
                "exports": "/api/v1/exports",
                "clients": "/api/v1/clients",
                "payments": "/api/v1/payments",
                "exchange_rates": "/api/v1/exchange-rates",
                "containers": "/api/v1/containers",
                "purchase_orders": "/api/v1/purchase-orders",
                "workflows": "/api/v1/workflows",
                "approvals": "/api/v1/approvals",
                "analytics": "/api/v1/analytics",
                "products": "/api/v1/products",
                "warehouses": "/api/v1/warehouses",
                "classification": "/api/v1/classification",
                "customs": "/api/v1/customs",
                "tasks": "/api/v1/tasks",
                "docs": "/docs"
            }
        },
        media_type="application/json; charset=utf-8"
    )

@app.get("/health")
async def health_check():
    """
    Verificação de saúde da API
    """
    return {
        "status": "healthy",
        "service": "Dasfabri API",
        "version": "1.0.0"
    } 