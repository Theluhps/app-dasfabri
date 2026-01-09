#!/bin/bash

# Script de Deploy do Site de Marketing Dasfabri
# Uso: ./scripts/deploy_site_marketing.sh
# Este script apenas prepara o build, o upload deve ser feito manualmente

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configurações
FRONTEND_DIR="apps/marketing-site/frontend"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}🚀 Deploy do Site de Marketing Dasfabri${NC}"
echo -e "${BLUE}(Apenas landing page - sem backend)${NC}"
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
FILE_COUNT=$(find dist -type f | wc -l | tr -d ' ')

echo ""
echo -e "${GREEN}✅ Build criado com sucesso!${NC}"
echo -e "${GREEN}   Tamanho: $BUILD_SIZE${NC}"
echo -e "${GREEN}   Arquivos: $FILE_COUNT${NC}"
echo ""

# Verificar se .htaccess existe
if [ -f "public/.htaccess" ]; then
    echo -e "${BLUE}📋 Arquivo .htaccess encontrado em public/.htaccess${NC}"
    echo -e "${YELLOW}   ⚠️  Lembre-se de copiar este arquivo para a raiz do public_html na Hostgator${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .htaccess não encontrado${NC}"
    echo -e "${YELLOW}   Você precisará criar um .htaccess na raiz do public_html${NC}"
fi

echo ""
echo -e "${GREEN}✅ Site de marketing preparado para deploy!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo ""
echo -e "${YELLOW}1. Escolher método de deploy:${NC}"
echo "   • Addon Domain (recomendado): cPanel → Domínios → Addon Domains"
echo "   • Subdiretório: Criar pasta em public_html"
echo "   • Subdomínio: cPanel → Subdomains"
echo ""
echo -e "${YELLOW}2. Upload dos arquivos:${NC}"
echo "   • Via cPanel File Manager:"
echo "     - Acessar cPanel → File Manager"
echo "     - Navegar para o diretório escolhido"
echo "     - Upload de TODOS os arquivos de dist/"
echo ""
echo "   • Via FTP:"
echo "     - Conectar ao servidor FTP"
echo "     - Navegar para o diretório correto"
echo "     - Upload de todos os arquivos de dist/"
echo ""
echo -e "${YELLOW}3. Configurar .htaccess:${NC}"
echo "   • Copiar public/.htaccess para a raiz do diretório"
echo "   • Se usar subdiretório, ajustar RewriteBase"
echo ""
echo -e "${YELLOW}4. Configurar domínios:${NC}"
echo "   • Registro.br: Configurar DNS"
echo "   • Hostgator: Adicionar domínio no cPanel (se Addon Domain)"
echo ""
echo -e "${YELLOW}5. Instalar SSL:${NC}"
echo "   • cPanel → SSL/TLS Status → Let's Encrypt"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "   Se você tem outros sites na Hostgator, use Addon Domain"
echo "   para não interferir nos sites existentes!"
echo ""
echo -e "${BLUE}📁 Arquivos prontos em:${NC}"
echo "   $(pwd)/dist/"
echo ""
echo -e "${BLUE}📖 Para mais detalhes, consulte:${NC}"
echo "   docs/public/GUIA_DEPLOY_SITE_MARKETING.md"
echo ""

