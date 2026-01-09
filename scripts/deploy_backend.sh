#!/bin/bash

# Script de Deploy do Backend Dasfabri
# Uso: ./scripts/deploy_backend.sh [ambiente]
# Exemplo: ./scripts/deploy_backend.sh production

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configurações
ENVIRONMENT=${1:-production}
BACKEND_DIR="apps/saas-platform/backend"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}🚀 Deploy do Backend Dasfabri${NC}"
echo -e "${BLUE}Ambiente: ${ENVIRONMENT}${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Erro: Diretório do backend não encontrado!${NC}"
    echo "   Execute este script da raiz do projeto."
    exit 1
fi

cd "$PROJECT_ROOT/$BACKEND_DIR"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 não encontrado!${NC}"
    exit 1
fi

# Criar venv se não existir
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Criando ambiente virtual...${NC}"
    python3 -m venv venv
fi

# Ativar venv
echo -e "${BLUE}🔧 Ativando ambiente virtual...${NC}"
source venv/bin/activate

# Instalar/atualizar dependências
echo -e "${BLUE}📥 Instalando dependências...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

# Verificar se existe .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env.production não encontrado!${NC}"
    echo -e "${YELLOW}   Criando a partir de .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env.production
        echo -e "${YELLOW}   ⚠️  IMPORTANTE: Edite .env.production com as configurações de produção!${NC}"
    else
        echo -e "${RED}   ❌ .env.example também não encontrado!${NC}"
    fi
fi

# Executar testes (opcional)
read -p "Deseja executar testes antes do deploy? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}🧪 Executando testes...${NC}"
    pytest tests/test_apis.py -v || {
        echo -e "${RED}❌ Testes falharam! Deploy cancelado.${NC}"
        exit 1
    }
fi

# Criar requirements_prod.txt
echo -e "${BLUE}📝 Criando requirements_prod.txt...${NC}"
pip freeze > requirements_prod.txt

echo ""
echo -e "${GREEN}✅ Backend preparado para deploy!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo "   1. Configure as variáveis de ambiente em .env.production"
echo "   2. Faça upload dos arquivos para o servidor"
echo "   3. Execute as migrations no servidor"
echo "   4. Inicie o serviço"
echo ""
echo -e "${BLUE}📤 Para fazer upload via rsync:${NC}"
echo "   rsync -avz --exclude 'venv' --exclude '__pycache__' --exclude '*.pyc' \\"
echo "     ./ usuario@hostgator.com:/home/usuario/api/"
echo ""

