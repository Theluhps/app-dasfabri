#!/bin/bash

# Script para executar testes automatizados das APIs

echo "🧪 Executando testes automatizados das APIs..."
echo ""

# Ativar venv se existir
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Instalar dependências de teste se necessário
if ! python -c "import pytest" 2>/dev/null; then
    echo "📦 Instalando dependências de teste..."
    pip install -r requirements-test.txt
fi

# Executar testes
echo "🚀 Iniciando testes..."
echo ""

pytest tests/test_apis.py -v --tb=short

echo ""
echo "✅ Testes concluídos!"

