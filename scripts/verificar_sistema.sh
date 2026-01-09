#!/bin/bash

# Script de Verificação Completa do Sistema
# Verifica se nada foi perdido ou impactado após reorganização

set -e

echo "🔍 VERIFICAÇÃO COMPLETA DO SISTEMA"
echo "=================================="
echo ""

ERRORS=0
WARNINGS=0

# Função para verificar arquivo
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $2"
    else
        echo "❌ $2 - FALTANDO!"
        ((ERRORS++))
    fi
}

# Função para verificar diretório
check_dir() {
    if [ -d "$1" ]; then
        COUNT=$(find "$1" -type f 2>/dev/null | wc -l)
        echo "✅ $2 ($COUNT arquivos)"
    else
        echo "❌ $2 - FALTANDO!"
        ((ERRORS++))
    fi
}

echo "📋 FASE 1: Arquivos Críticos do Backend"
echo ""

BACKEND_DIR="apps/saas-platform/backend"
check_file "$BACKEND_DIR/main.py" "main.py"
check_file "$BACKEND_DIR/requirements.txt" "requirements.txt"
check_file "$BACKEND_DIR/app/core/database.py" "app/core/database.py"
check_file "$BACKEND_DIR/app/core/security.py" "app/core/security.py"
check_dir "$BACKEND_DIR/app/models" "app/models/"
check_dir "$BACKEND_DIR/app/api/v1" "app/api/v1/"

echo ""
echo "📋 FASE 2: Arquivos Críticos do Frontend"
echo ""

FRONTEND_DIR="apps/marketing-site/frontend"
check_file "$FRONTEND_DIR/package.json" "package.json"
check_file "$FRONTEND_DIR/vite.config.ts" "vite.config.ts"
check_file "$FRONTEND_DIR/src/App.tsx" "src/App.tsx"
check_file "$FRONTEND_DIR/src/components/Hero.tsx" "src/components/Hero.tsx"
check_file "$FRONTEND_DIR/src/components/Features.tsx" "src/components/Features.tsx"
check_file "$FRONTEND_DIR/src/contexts/LanguageContext.tsx" "src/contexts/LanguageContext.tsx"

echo ""
echo "📋 FASE 3: Banco de Dados"
echo ""

if [ -f "data/databases/kue_marketing.db" ]; then
    SIZE=$(du -h data/databases/kue_marketing.db | cut -f1)
    echo "✅ Banco principal: data/databases/kue_marketing.db ($SIZE)"
else
    echo "❌ Banco principal FALTANDO!"
    ((ERRORS++))
fi

echo ""
echo "📋 FASE 4: Verificando Imports"
echo ""

# Verificar imports no backend
if grep -q "from app\." "$BACKEND_DIR/main.py" 2>/dev/null; then
    echo "✅ main.py tem imports corretos (app.*)"
else
    echo "⚠️ main.py pode ter imports incorretos"
    ((WARNINGS++))
fi

echo ""
echo "📋 FASE 5: Estrutura de Pastas"
echo ""

check_dir "apps" "apps/"
check_dir "docs" "docs/"
check_dir "data" "data/"
check_dir "infrastructure" "infrastructure/"
check_dir "presentations" "presentations/"
check_dir "scripts" "scripts/"

echo ""
echo "📋 FASE 6: Documentação"
echo ""

PUBLIC_DOCS=$(find docs/public -name "*.md" 2>/dev/null | wc -l)
INTERNAL_DOCS=$(find docs/internal -name "*.md" 2>/dev/null | wc -l)

echo "✅ Documentação pública: $PUBLIC_DOCS arquivos"
echo "✅ Documentação sigilosa: $INTERNAL_DOCS arquivos"

if [ -f "docs/internal/.gitignore" ]; then
    echo "✅ docs/internal/.gitignore existe (protegida)"
else
    echo "⚠️ docs/internal/.gitignore pode estar faltando"
    ((WARNINGS++))
fi

echo ""
echo "=================================="
echo "📊 RESUMO DA VERIFICAÇÃO"
echo "=================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "✅ NENHUM ERRO ENCONTRADO!"
else
    echo "❌ $ERRORS ERRO(S) ENCONTRADO(S)"
fi

if [ $WARNINGS -gt 0 ]; then
    echo "⚠️ $WARNINGS AVISO(S)"
fi

echo ""
echo "✅ Verificação concluída!"

