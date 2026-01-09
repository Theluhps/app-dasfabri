#!/bin/bash

# Script para atualizar imports após reorganização
# Atualiza imports nos arquivos Python para a nova estrutura

set -e

BACKEND_DIR="apps/saas-platform/backend"

echo "🔄 Atualizando imports nos arquivos Python..."
echo ""

cd "$BACKEND_DIR"

# Atualizar imports nos arquivos da API
echo "📝 Atualizando imports em app/api/v1/..."

find app/api/v1 -name "*.py" -type f | while read file; do
    echo "   → Processando $file"
    
    # Atualizar imports de models
    sed -i '' 's/^import models$/from app.models import Base, User, Company, ImportProcess, ExportProcess, Supplier, Client, Payment, ExchangeRate, Container, PurchaseOrder, Workflow, Approval, AccessRequest/g' "$file" 2>/dev/null || true
    sed -i '' 's/^from models import/from app.models import/g' "$file" 2>/dev/null || true
    sed -i '' 's/, models$/, app.models/g' "$file" 2>/dev/null || true
    
    # Atualizar imports de schemas
    sed -i '' 's/^import schemas$/from app.schemas import/g' "$file" 2>/dev/null || true
    sed -i '' 's/^from schemas import/from app.schemas import/g' "$file" 2>/dev/null || true
    sed -i '' 's/, schemas$/, app.schemas/g' "$file" 2>/dev/null || true
    
    # Atualizar imports de database
    sed -i '' 's/^from database import/from app.core.database import/g' "$file" 2>/dev/null || true
    
    # Atualizar imports de auth
    sed -i '' 's/^import auth$/from app.core.security import/g' "$file" 2>/dev/null || true
    sed -i '' 's/^from auth import/from app.core.security import/g' "$file" 2>/dev/null || true
    sed -i '' 's/, auth$/, app.core.security/g' "$file" 2>/dev/null || true
    sed -i '' 's/auth\./app.core.security./g' "$file" 2>/dev/null || true
done

echo "✅ Imports atualizados"
echo ""

# Criar __init__.py nos diretórios necessários
echo "📝 Criando __init__.py..."
touch app/__init__.py
touch app/api/__init__.py
touch app/api/v1/__init__.py
touch app/core/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py

echo "✅ __init__.py criados"
echo ""

# Mover security.py se auth.py existir
if [ -f "app/core/security.py" ] && [ ! -f "app/core/auth.py" ]; then
    echo "📝 Verificando auth.py..."
    if [ -f "app/core/security.py" ]; then
        echo "   ✓ security.py já existe"
    fi
fi

echo ""
echo "✅ Atualização de imports concluída!"
echo ""
echo "⚠️  IMPORTANTE: Revise os arquivos manualmente para garantir que todos os imports estão corretos"

