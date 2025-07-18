from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models

# Importar todas as rotas
from api.access_requests import router as access_router
from api.companies import router as companies_router
from api.users import router as users_router
from api.auth import router as auth_router
from api.import_processes import router as import_router
from api.suppliers import router as suppliers_router
from api.export_processes import router as export_router
from api.clients import router as clients_router
from api.payments import router as payments_router
from api.exchange_rates import router as exchange_router
from api.containers import router as containers_router
from api.purchase_orders import router as po_router
from api.workflows import router as workflows_router
from api.approvals import router as approvals_router
from api.analytics import router as analytics_router

# Criar tabelas
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dasfabri API",
    description="API completa para sistema de comércio exterior SaaS",
    version="1.0.0"
)

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
app.include_router(users_router, prefix="/api/v1/users", tags=["Usuários"])
app.include_router(companies_router, prefix="/api/v1/companies", tags=["Empresas"])
app.include_router(access_router, prefix="/api/v1/access", tags=["Solicitações de Acesso"])

# Rotas de Importação
app.include_router(import_router, prefix="/api/v1/imports", tags=["Importação"])
app.include_router(suppliers_router, prefix="/api/v1/suppliers", tags=["Fornecedores"])

# Rotas de Exportação
app.include_router(export_router, prefix="/api/v1/exports", tags=["Exportação"])
app.include_router(clients_router, prefix="/api/v1/clients", tags=["Clientes"])

# Rotas Financeiras
app.include_router(payments_router, prefix="/api/v1/payments", tags=["Pagamentos"])
app.include_router(exchange_router, prefix="/api/v1/exchange-rates", tags=["Taxas de Câmbio"])

# Rotas de Logística
app.include_router(containers_router, prefix="/api/v1/containers", tags=["Containers"])

# Rotas de Purchase Orders
app.include_router(po_router, prefix="/api/v1/purchase-orders", tags=["Pedidos de Compra"])

# Rotas de Workflow
app.include_router(workflows_router, prefix="/api/v1/workflows", tags=["Workflows"])
app.include_router(approvals_router, prefix="/api/v1/approvals", tags=["Aprovações"])

# Rotas de Analytics
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Analytics"])

@app.get("/")
async def root():
    """
    Rota raiz da API
    """
    return {
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
            "imports": "/api/v1/imports",
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
            "docs": "/docs"
        }
    }

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