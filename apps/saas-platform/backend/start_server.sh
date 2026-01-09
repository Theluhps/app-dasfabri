#!/bin/bash

# Script para iniciar o servidor Dasfabri

cd "$(dirname "$0")"

echo "🚀 Iniciando servidor Dasfabri..."
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado!"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"
echo ""

# Verificar se está no diretório correto
if [ ! -f "main.py" ]; then
    echo "❌ Arquivo main.py não encontrado!"
    echo "   Certifique-se de estar no diretório apps/saas-platform/backend"
    exit 1
fi

echo "✅ Diretório correto"
echo ""

# Tentar usar venv se existir
if [ -d "../../venv" ]; then
    echo "📦 Ativando venv..."
    source ../../venv/bin/activate
elif [ -d "../venv" ]; then
    echo "📦 Ativando venv..."
    source ../venv/bin/activate
fi

# Verificar dependências
echo "🔍 Verificando dependências..."
python3 -c "import fastapi" 2>/dev/null || {
    echo "⚠️  FastAPI não encontrado. Instalando..."
    pip install fastapi uvicorn sqlalchemy pydantic
}

echo ""
echo "🌐 Iniciando servidor..."
echo "   URL: http://localhost:8000"
echo "   Swagger: http://localhost:8000/docs"
echo ""
echo "⚠️  Mantenha este terminal aberto!"
echo "⚠️  Para parar: Ctrl+C"
echo ""

python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

