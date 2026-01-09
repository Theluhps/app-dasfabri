#!/bin/bash

# Script de Deploy do Frontend Dasfabri
# Uso: ./scripts/deploy_frontend.sh [ambiente]
# Exemplo: ./scripts/deploy_frontend.sh production

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configurações
ENVIRONMENT=${1:-production}
FRONTEND_DIR="apps/marketing-site/frontend"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}🚀 Deploy do Frontend Dasfabri${NC}"
echo -e "${BLUE}Ambiente: ${ENVIRONMENT}${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Erro: Diretório do frontend não encontrado!${NC}"
    echo "   Execute este script da raiz do projeto."
    exit 1
fi

cd "$PROJECT_ROOT/$FRONTEND_DIR"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado!${NC}"
    exit 1
fi

# Verificar se existe .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env.production não encontrado!${NC}"
    echo -e "${YELLOW}   Criando a partir de .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env.production
        echo -e "${YELLOW}   ⚠️  IMPORTANTE: Edite .env.production com VITE_API_URL de produção!${NC}"
        echo -e "${YELLOW}   Exemplo: VITE_API_URL=https://api.dasfabri.com.br${NC}"
    else
        echo -e "${YELLOW}   Criando .env.production básico...${NC}"
        echo "VITE_API_URL=https://api.dasfabri.com.br" > .env.production
        echo -e "${YELLOW}   ⚠️  IMPORTANTE: Edite .env.production com a URL correta da API!${NC}"
    fi
fi

# Instalar dependências
echo -e "${BLUE}📥 Instalando dependências...${NC}"
npm install

# Build de produção
echo -e "${BLUE}🔨 Fazendo build de produção...${NC}"
npm run build

# Verificar se o build foi criado
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erro: Diretório dist não foi criado!${NC}"
    exit 1
fi

# Mostrar tamanho do build
BUILD_SIZE=$(du -sh dist | cut -f1)
echo -e "${GREEN}✅ Build criado com sucesso! (Tamanho: $BUILD_SIZE)${NC}"

echo ""
echo -e "${GREEN}✅ Frontend preparado para deploy!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo "   1. Verifique se VITE_API_URL está correto em .env.production"
echo "   2. Faça upload dos arquivos de dist/ para o servidor"
echo "   3. Configure o servidor web (Nginx/Apache) para servir os arquivos"
echo ""
echo -e "${BLUE}📤 Para fazer upload via rsync:${NC}"
echo "   rsync -avz --delete \\"
echo "     dist/ usuario@hostgator.com:/home/usuario/public_html/"
echo ""
echo -e "${BLUE}📁 Arquivos prontos em:${NC}"
echo "   $(pwd)/dist/"
echo ""

