from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import companies, users, access_requests

app = FastAPI(
    title="Dasfabri API",
    description="API para gerenciamento de marketing e solicitações de acesso",
    version="1.0.0"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo as rotas
app.include_router(companies.router, prefix="/api/v1", tags=["companies"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(access_requests.router, prefix="/api/v1", tags=["access-requests"])

@app.get("/")
async def root():
    """
    Rota raiz da API
    """
    return {
        "message": "Bem-vindo à API da Dasfabri",
        "endpoints": {
            "companies": "/api/v1/companies",
            "users": "/api/v1/users",
            "access-requests": "/api/v1/access-requests"
        }
    }
