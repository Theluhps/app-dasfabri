from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.marketing_routes import router as marketing_router
from backend.api.analytics_routes import router as analytics_router
from backend.api.campaign_routes import router as campaign_router
from backend.api.access_requests import router as access_router
from backend.api.companies import router as companies_router
from backend.api.users import router as users_router
from backend.api.auth import router as auth_router

app = FastAPI(
    title="Dasfabri API",
    description="API para gerenciamento de marketing e solicitações de acesso",
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

# Incluir rotas
app.include_router(marketing_router, prefix="/marketing", tags=["Marketing"])
app.include_router(analytics_router, prefix="/api/v1/analytics")
app.include_router(campaign_router, prefix="/api/v1/campaigns")
app.include_router(access_router, prefix="/access", tags=["Access"])
app.include_router(companies_router, prefix="/api/v1/companies", tags=["Companies"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])

@app.get("/")
async def root():
    """
    Rota raiz da API
    """
    return {
        "message": "Bem-vindo à API da Dasfabri",
        "endpoints": {
            "marketing": "/marketing",
            "analytics": "/api/v1/analytics",
            "campaigns": "/api/v1/campaigns",
            "access": "/access",
            "companies": "/api/v1/companies",
            "users": "/api/v1/users",
            "auth": "/api/v1/auth"
        }
    } 