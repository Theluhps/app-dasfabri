#!/bin/bash

# Script de Limpeza Segura do Projeto Dasfabri
# Este script exclui APENAS arquivos confirmados como seguros

set -e  # Para se houver erro, o script para

echo "🧹 Iniciando limpeza segura do projeto Dasfabri..."
echo ""

# Verificar se estamos no diretório correto
if [ ! -d "Dasfabri/Dasfabri-Platform" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto!"
    exit 1
fi

# Criar backup antes (opcional - descomente se quiser)
# echo "📦 Criando backup..."
# tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz --exclude='node_modules' --exclude='venv' --exclude='__pycache__' .

echo "✅ Iniciando exclusões seguras..."
echo ""

# 1. Excluir __pycache__
echo "🗑️  Excluindo __pycache__..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
echo "   ✓ __pycache__ excluído"

# 2. Excluir pastas duplicadas confirmadas
echo "🗑️  Excluindo pastas duplicadas..."
if [ -d "Dasfabri/Dasfabri-Platform/src/components 2" ]; then
    rm -rf "Dasfabri/Dasfabri-Platform/src/components 2"
    echo "   ✓ components 2 excluído"
fi

if [ -d "Dasfabri/Dasfabri-Platform/src/services 2" ]; then
    rm -rf "Dasfabri/Dasfabri-Platform/src/services 2"
    echo "   ✓ services 2 excluído"
fi

# 3. Excluir pasta temporária
echo "🗑️  Excluindo pasta temporária..."
if [ -d "Dasfabri-temp" ]; then
    rm -rf "Dasfabri-temp"
    echo "   ✓ Dasfabri-temp excluído"
fi

# 4. Excluir estrutura duplicada aninhada
echo "🗑️  Excluindo estrutura duplicada..."
if [ -d "Dasfabri/Dasfabri" ]; then
    rm -rf "Dasfabri/Dasfabri"
    echo "   ✓ Dasfabri/Dasfabri excluído"
fi

# 5. Excluir arquivo de teste
echo "🗑️  Excluindo arquivo de teste..."
if [ -f "test_import.py" ]; then
    rm -f "test_import.py"
    echo "   ✓ test_import.py excluído"
fi

# 6. Excluir banco de teste
echo "🗑️  Excluindo banco de teste..."
if [ -f "backend/test.db" ]; then
    rm -f "backend/test.db"
    echo "   ✓ backend/test.db excluído"
fi

# 7. Excluir bancos vazios duplicados
echo "🗑️  Excluindo bancos vazios duplicados..."
if [ -f "backend/kue_marketing.db" ]; then
    # Verificar se está vazio (apenas alembic_version)
    TABLES=$(sqlite3 "backend/kue_marketing.db" ".tables" 2>/dev/null | wc -w)
    if [ "$TABLES" -le 1 ]; then
        rm -f "backend/kue_marketing.db"
        echo "   ✓ backend/kue_marketing.db (vazio) excluído"
    else
        echo "   ⚠️  backend/kue_marketing.db tem dados - NÃO excluído"
    fi
fi

if [ -f "Dasfabri/backend/kue_marketing.db" ]; then
    TABLES=$(sqlite3 "Dasfabri/backend/kue_marketing.db" ".tables" 2>/dev/null | wc -w)
    if [ "$TABLES" -le 1 ]; then
        rm -f "Dasfabri/backend/kue_marketing.db"
        echo "   ✓ Dasfabri/backend/kue_marketing.db (vazio) excluído"
    else
        echo "   ⚠️  Dasfabri/backend/kue_marketing.db tem dados - NÃO excluído"
    fi
fi

# 8. Excluir requirements.txt errado da raiz (é de outro projeto)
echo "🗑️  Excluindo requirements.txt errado..."
if [ -f "requirements.txt" ]; then
    # Verificar se tem muitas linhas (indica que é do AutoGPT)
    LINES=$(wc -l < "requirements.txt" 2>/dev/null || echo "0")
    if [ "$LINES" -gt 50 ]; then
        rm -f "requirements.txt"
        echo "   ✓ requirements.txt (AutoGPT) excluído"
    else
        echo "   ⚠️  requirements.txt parece correto - NÃO excluído"
    fi
fi

# 9. Excluir requirements.txt duplicados
if [ -f "Dasfabri/requirements.txt" ]; then
    rm -f "Dasfabri/requirements.txt"
    echo "   ✓ Dasfabri/requirements.txt (duplicado) excluído"
fi

if [ -f "Dasfabri/backend/requirements.txt" ]; then
    # Comparar com o principal
    if [ -f "backend/requirements.txt" ]; then
        if diff -q "Dasfabri/backend/requirements.txt" "backend/requirements.txt" >/dev/null 2>&1; then
            rm -f "Dasfabri/backend/requirements.txt"
            echo "   ✓ Dasfabri/backend/requirements.txt (duplicado) excluído"
        else
            echo "   ⚠️  Dasfabri/backend/requirements.txt é diferente - NÃO excluído"
        fi
    fi
fi

# 10. Excluir alembic.ini duplicados
echo "🗑️  Excluindo alembic.ini duplicados..."
if [ -f "alembic.ini" ] && [ -f "backend/alembic.ini" ]; then
    rm -f "alembic.ini"
    echo "   ✓ alembic.ini (raiz, duplicado) excluído"
fi

if [ -f "Dasfabri/backend/alembic.ini" ] && [ -f "backend/alembic.ini" ]; then
    rm -f "Dasfabri/backend/alembic.ini"
    echo "   ✓ Dasfabri/backend/alembic.ini (duplicado) excluído"
fi

# 11. Excluir arquivos de workspace duplicados
echo "🗑️  Excluindo arquivos de workspace duplicados..."
if [ -f "Dasfabri/Dasfabri Sistema SaaS/Dasfabri Sistema SaaS.code-workspace" ]; then
    rm -f "Dasfabri/Dasfabri Sistema SaaS/Dasfabri Sistema SaaS.code-workspace"
    echo "   ✓ Workspace duplicado excluído"
fi

echo ""
echo "✅ Limpeza segura concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Verificar se o projeto ainda funciona"
echo "   2. Revisar itens marcados com ⚠️ no relatório"
echo "   3. Considerar excluir dist/ e venv/ se não estiverem em uso"
echo ""
echo "⚠️  IMPORTANTE: O banco /kue_marketing.db (raiz) foi PRESERVADO (tem dados!)"

