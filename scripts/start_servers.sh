#!/bin/bash

# Script para iniciar servidores Dasfabri

set -e

echo "🚀 Iniciando servidores Dasfabri..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend
echo -e "${BLUE}📦 Configurando Backend...${NC}"
cd "$(dirname "$0")/../apps/saas-platform/backend"

# Verificar se venv existe
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Criando virtual environment...${NC}"
    python3 -m venv venv
fi

# Ativar venv e instalar dependências
source venv/bin/activate
echo -e "${GREEN}✅ Virtual environment ativado${NC}"

# Instalar dependências se necessário
if ! python -c "import uvicorn" 2>/dev/null; then
    echo -e "${YELLOW}📥 Instalando dependências do backend...${NC}"
    pip install -q -r requirements.txt
fi

# Iniciar backend
echo -e "${BLUE}🚀 Iniciando backend na porta 8000...${NC}"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"

# Frontend
echo ""
echo -e "${BLUE}📦 Configurando Frontend...${NC}"
cd "$(dirname "$0")/../apps/marketing-site/frontend"

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Instalando dependências do frontend...${NC}"
    npm install
fi

# Iniciar frontend
echo -e "${BLUE}🚀 Iniciando frontend na porta 8080...${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"

# Aguardar servidores iniciarem
echo ""
echo -e "${YELLOW}⏳ Aguardando servidores iniciarem...${NC}"
sleep 5

# Verificar status
echo ""
echo -e "${GREEN}✅ SERVIDORES INICIADOS!${NC}"
echo ""
echo -e "${BLUE}📍 URLs disponíveis:${NC}"
echo ""
echo -e "   🎨 ${GREEN}Site Marketing (Frontend):${NC}"
echo -e "      👉 http://localhost:8080"
echo ""
echo -e "   🔧 ${GREEN}API Backend:${NC}"
echo -e "      👉 http://localhost:8000"
echo ""
echo -e "   📚 ${GREEN}Documentação API (Swagger):${NC}"
echo -e "      👉 http://localhost:8000/docs"
echo ""
echo -e "   📖 ${GREEN}Documentação API (ReDoc):${NC}"
echo -e "      👉 http://localhost:8000/redoc"
echo ""
echo -e "${YELLOW}💡 Para parar os servidores, pressione Ctrl+C ou execute:${NC}"
echo -e "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Abrir navegadores
sleep 2
open http://localhost:8080 2>/dev/null || echo "Abra manualmente: http://localhost:8080"
sleep 1
open http://localhost:8000/docs 2>/dev/null || echo "Abra manualmente: http://localhost:8000/docs"

# Manter script rodando
wait

