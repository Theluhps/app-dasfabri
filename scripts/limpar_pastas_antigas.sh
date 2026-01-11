#!/bin/bash

# 🗑️ Script para Limpar Pastas Antigas

set -e

echo "🗑️  LIMPAR PASTAS ANTIGAS"
echo "=========================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está em um repositório git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Erro: Não é um repositório git!${NC}"
    exit 1
fi

echo "📋 Pastas antigas encontradas:"
echo ""

# Verificar Dasfabri
if [ -d "Dasfabri" ]; then
    echo -e "${YELLOW}⚠️  Dasfabri/ - 316KB (submodule)${NC}"
    echo "   Conteúdo: .git, package.json, setup.py, wsgi.py"
    echo ""
fi

# Verificar Apresentaçoes (duplicada?)
if [ -d "Apresentaçoes" ] && [ -d "presentations" ]; then
    echo -e "${YELLOW}⚠️  Apresentaçoes/ - Possível duplicata de presentations/${NC}"
    echo ""
fi

echo "📋 Pastas que já foram removidas:"
echo -e "${GREEN}✅ Dasfabri Platform/ - DELETADA${NC}"
echo -e "${GREEN}✅ backend/ (antiga) - DELETADA${NC}"
echo ""

read -p "Deseja remover a pasta 'Dasfabri' do git? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado pelo usuário"
    exit 0
fi

echo ""
echo "🗑️  Removendo Dasfabri do git..."

# Remover do git (mas manter localmente por segurança)
if [ -d "Dasfabri" ]; then
    # Se for submodule, remover como submodule
    if [ -d "Dasfabri/.git" ]; then
        echo "  ⚠️  Detectado como submodule"
        git rm --cached Dasfabri 2>/dev/null || git rm -r --cached Dasfabri/ 2>/dev/null || true
    else
        git rm -r --cached Dasfabri/ 2>/dev/null || true
    fi
    echo -e "${GREEN}  ✅ Dasfabri removido do git${NC}"
fi

# Verificar Apresentaçoes
if [ -d "Apresentaçoes" ] && [ -d "presentations" ]; then
    echo ""
    read -p "Deseja remover 'Apresentaçoes/' (duplicata de presentations/)? (s/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        git rm -r --cached Apresentaçoes/ 2>/dev/null || true
        echo -e "${GREEN}  ✅ Apresentaçoes removido do git${NC}"
    fi
fi

echo ""
echo "📋 Verificando status..."
git status --short | head -10

echo ""
read -p "📝 Deseja fazer commit? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado pelo usuário"
    echo "💡 Você pode fazer commit manualmente depois"
    exit 0
fi

echo ""
echo "📝 Fazendo commit..."
git commit -m "🗑️ Remove pastas antigas (Dasfabri submodule)" || echo "⚠️  Nenhuma mudança para commitar"

echo ""
echo -e "${GREEN}✅ Pastas antigas removidas do git!${NC}"
echo ""
echo "💡 As pastas ainda existem localmente (por segurança)"
echo "💡 Para deletar localmente também, execute:"
echo "   rm -rf Dasfabri/"
echo "   rm -rf Apresentaçoes/  # Se removeu do git"
