#!/bin/bash

# Script para testar as APIs do Dasfabri
# Uso: ./scripts/test_apis.sh

echo "🧪 TESTE DE APIs - DASFABRI"
echo "============================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se o servidor está rodando
echo "📡 Verificando se o servidor está rodando..."
SERVER_RUNNING=false

# Tentar primeiro o endpoint /health
if curl -s --connect-timeout 2 http://localhost:8000/health > /dev/null 2>&1; then
    SERVER_RUNNING=true
# Se /health falhar, tentar o endpoint raiz /
elif curl -s --connect-timeout 2 http://localhost:8000/ > /dev/null 2>&1; then
    SERVER_RUNNING=true
# Se ambos falharem, verificar se há processo na porta
elif lsof -ti:8000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Processo encontrado na porta 8000, mas servidor não está respondendo${NC}"
    echo "   O servidor pode estar iniciando ou com problemas"
    echo "   Aguarde alguns segundos e tente novamente"
    SERVER_RUNNING=false
fi

if [ "$SERVER_RUNNING" = true ]; then
    echo -e "${GREEN}✅ Servidor está rodando${NC}"
else
    echo -e "${RED}❌ Servidor não está rodando ou não está respondendo!${NC}"
    echo ""
    echo "   Para iniciar o servidor:"
    echo "   cd apps/saas-platform/backend"
    echo "   source ../../../venv/bin/activate  # ou ative seu venv"
    echo "   uvicorn main:app --reload"
    echo ""
    exit 1
fi

echo ""
echo "📋 Endpoints disponíveis:"
echo "   • Swagger UI: http://localhost:8000/docs"
echo "   • ReDoc: http://localhost:8000/redoc"
echo "   • Health Check: http://localhost:8000/health"
echo ""

# Testar health check
echo "🏥 Testando Health Check..."
HEALTH_RESPONSE=$(curl -s --connect-timeout 2 http://localhost:8000/health 2>/dev/null)
if [ -n "$HEALTH_RESPONSE" ] && echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Health Check OK${NC}"
    echo "   Resposta: $HEALTH_RESPONSE"
else
    echo -e "${YELLOW}⚠️  Health Check não disponível, testando endpoint raiz...${NC}"
    ROOT_RESPONSE=$(curl -s --connect-timeout 2 http://localhost:8000/ 2>/dev/null)
    if [ -n "$ROOT_RESPONSE" ] && echo "$ROOT_RESPONSE" | grep -q "Dasfabri"; then
        echo -e "${GREEN}✅ Servidor está respondendo (endpoint raiz)${NC}"
    else
        echo -e "${RED}❌ Servidor não está respondendo corretamente${NC}"
    fi
fi

echo ""
echo "📚 APIs Disponíveis:"
echo "   1. Control Tower: /api/v1/control-tower"
echo "   2. Drawback: /api/v1/drawback"
echo "   3. Products: /api/v1/products"
echo "   4. Warehouse: /api/v1/warehouses"
echo "   5. Classification: /api/v1/classification"
echo "   6. Customs: /api/v1/customs"
echo ""

echo "🔐 IMPORTANTE:"
echo "   Todas as APIs requerem autenticação!"
echo "   Use o Swagger UI para fazer login e obter o token."
echo ""

echo "📖 Guias disponíveis:"
echo "   • docs/public/GUIA_APIS_SWAGGER.md"
echo "   • docs/public/GUIA_TESTE_APIS.md"
echo ""

echo -e "${YELLOW}💡 Próximos passos:${NC}"
echo "   1. Abra http://localhost:8000/docs no navegador"
echo "   2. Use /api/v1/auth/login para obter o token"
echo "   3. Clique em 'Authorize' e cole: Bearer {seu-token}"
echo "   4. Teste os endpoints seguindo o GUIA_TESTE_APIS.md"
echo ""

echo "✅ Pronto para testar!"

