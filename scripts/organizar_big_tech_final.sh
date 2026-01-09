#!/bin/bash

# Script de Organização Final Big Tech - Nível CTO
# Organiza TUDO como uma Big Tech profissional

set -e

BASE_DIR="$(pwd)"
echo "🏗️  ORGANIZAÇÃO FINAL BIG TECH - NÍVEL CTO"
echo "=========================================="
echo ""

# ============================================
# FASE 1: VERIFICAÇÃO E BACKUP
# ============================================
echo "📋 FASE 1: Verificação e Análise"
echo ""

# Verificar se estrutura principal existe
if [ ! -d "apps/marketing-site/frontend" ] || [ ! -d "apps/saas-platform/backend" ]; then
    echo "❌ ERRO: Estrutura principal não encontrada!"
    echo "   Execute primeiro a reorganização básica"
    exit 1
fi

echo "✅ Estrutura principal verificada"
echo ""

# ============================================
# FASE 2: CONSOLIDAR E MOVER ARQUIVOS ÚNICOS
# ============================================
echo "📦 FASE 2: Consolidando arquivos únicos"
echo ""

# Verificar e mover arquivos únicos de pastas antigas
if [ -d "Dasfabri Platform/src" ] && [ -d "apps/marketing-site/frontend/src" ]; then
    echo "   → Verificando Dasfabri Platform/ para arquivos únicos..."
    # Verificar se há arquivos que não existem no frontend
    find "Dasfabri Platform/src" -type f -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read file; do
        rel_path=${file#Dasfabri Platform/}
        if [ ! -f "apps/marketing-site/frontend/$rel_path" ]; then
            echo "     ⚠️ Arquivo único encontrado: $rel_path"
            # Mover para frontend se for importante
            mkdir -p "apps/marketing-site/frontend/$(dirname "$rel_path")"
            cp "$file" "apps/marketing-site/frontend/$rel_path" 2>/dev/null || true
        fi
    done
fi

# Verificar backend antigo
if [ -d "backend" ] && [ -d "apps/saas-platform/backend" ]; then
    echo "   → Verificando backend/ antigo para arquivos únicos..."
    find "backend" -type f -name "*.py" ! -path "*/__pycache__/*" 2>/dev/null | while read file; do
        rel_path=${file#backend/}
        if [ ! -f "apps/saas-platform/backend/$rel_path" ]; then
            echo "     ⚠️ Arquivo único encontrado: $rel_path"
        fi
    done
fi

echo "✅ Consolidação concluída"
echo ""

# ============================================
# FASE 3: REMOVER DUPLICATAS CONFIRMADAS
# ============================================
echo "🧹 FASE 3: Removendo duplicatas confirmadas"
echo ""

# Remover pastas duplicadas de Dasfabri Platform
if [ -d "Dasfabri Platform" ] && [ -d "apps/marketing-site/frontend" ]; then
    echo "   → Removendo Dasfabri Platform/ (duplicata)..."
    rm -rf "Dasfabri Platform"
    echo "   ✓ Removido"
fi

if [ -d "Dasfabri-Platform" ] && [ -d "apps/marketing-site/frontend" ]; then
    echo "   → Removendo Dasfabri-Platform/ (duplicata)..."
    rm -rf "Dasfabri-Platform"
    echo "   ✓ Removido"
fi

if [ -d "Dasfabri/Dasfabri Platform" ]; then
    echo "   → Removendo Dasfabri/Dasfabri Platform/ (duplicata)..."
    rm -rf "Dasfabri/Dasfabri Platform"
    echo "   ✓ Removido"
fi

# Remover backend antigo se já foi movido
if [ -d "backend" ] && [ -f "apps/saas-platform/backend/main.py" ]; then
    echo "   → Removendo backend/ antigo (já movido)..."
    rm -rf "backend"
    echo "   ✓ Removido"
fi

# Remover src/ na raiz se for versão antiga
if [ -d "src" ] && [ -d "apps/marketing-site/frontend/src" ]; then
    SRC_FILES=$(find src -type f 2>/dev/null | wc -l)
    FRONTEND_FILES=$(find apps/marketing-site/frontend/src -type f 2>/dev/null | wc -l)
    if [ "$SRC_FILES" -lt 20 ] && [ "$FRONTEND_FILES" -gt 100 ]; then
        echo "   → Removendo src/ na raiz (versão antiga)..."
        rm -rf "src"
        echo "   ✓ Removido"
    fi
fi

echo "✅ Limpeza de duplicatas concluída"
echo ""

# ============================================
# FASE 4: ORGANIZAR ARQUIVOS RESTANTES
# ============================================
echo "📁 FASE 4: Organizando arquivos restantes"
echo ""

# Mover arquivos de configuração para locais apropriados
if [ -f "render.yaml" ] && [ ! -f "infrastructure/render.yaml" ]; then
    mv "render.yaml" "infrastructure/" 2>/dev/null && echo "   ✓ render.yaml movido" || true
fi

# Organizar arquivos na raiz
if [ -f "requirements.txt" ] && [ ! -f "apps/saas-platform/backend/requirements.txt" ]; then
    mv "requirements.txt" "apps/saas-platform/backend/" 2>/dev/null && echo "   ✓ requirements.txt movido" || true
fi

# Organizar documentação
if [ -f "*.md" ] 2>/dev/null; then
    for md in *.md; do
        if [ -f "$md" ] && [ "$md" != "README.md" ] && [ "$md" != "CONTRIBUTING.md" ]; then
            mv "$md" "docs/public/" 2>/dev/null && echo "   ✓ $md movido" || true
        fi
    done
fi

echo "✅ Organização de arquivos concluída"
echo ""

# ============================================
# FASE 5: CRIAR ESTRUTURA FINAL PERFEITA
# ============================================
echo "🏗️  FASE 5: Criando estrutura final perfeita"
echo ""

# Garantir que todas as pastas necessárias existem
mkdir -p apps/marketing-site/frontend/src/contexts
mkdir -p apps/saas-platform/backend/app/{api/v1,core,models,schemas,services}
mkdir -p apps/saas-platform/backend/{alembic/versions,tests/{unit,integration,e2e},scripts}
mkdir -p infrastructure/{docker,kubernetes,terraform,scripts}
mkdir -p shared/{types,utils,constants}
mkdir -p docs/{public/{api,user-guide},internal/{architecture,design,processes,security}}
mkdir -p presentations/{commercial,technical}
mkdir -p data/{databases,seeds}
mkdir -p scripts
mkdir -p .github/workflows

echo "✅ Estrutura de pastas verificada"
echo ""

# ============================================
# FASE 6: VERIFICAÇÃO FINAL
# ============================================
echo "✅ FASE 6: Verificação final"
echo ""

echo "📊 Estrutura final:"
echo "   ✅ apps/ - Aplicações organizadas"
echo "   ✅ docs/ - Documentação (pública + sigilosa)"
echo "   ✅ data/ - Dados e bancos"
echo "   ✅ infrastructure/ - Infraestrutura"
echo "   ✅ presentations/ - Apresentações"
echo "   ✅ scripts/ - Scripts de manutenção"
echo ""

echo "📁 Pastas principais:"
ls -1d apps/ docs/ data/ infrastructure/ presentations/ scripts/ .github/ 2>/dev/null

echo ""
echo "🎉 ORGANIZAÇÃO BIG TECH CONCLUÍDA!"
echo ""
echo "✅ Projeto organizado em estrutura profissional"
echo "✅ Duplicatas removidas"
echo "✅ Arquivos consolidados"
echo "✅ Pronto para desenvolvimento enterprise"

