#!/bin/bash

# Script para iniciar o sistema completo
# Inicia backend e frontend

set -e

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "🚀 Iniciando sistema Dasfabri..."
echo ""

# Função para verificar porta
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Função para matar processo na porta
kill_port() {
    if check_port $1; then
        echo "Porta $1 está em uso. Liberando..."
        lsof -ti :$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Liberar portas
kill_port 8000
kill_port 8080

# Iniciar Backend
echo "📦 Iniciando backend..."
cd "$BASE_DIR/apps/saas-platform/backend"

# Criar venv se não existir
if [ ! -d "venv" ]; then
    echo "   Criando ambiente virtual..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "   Iniciando servidor na porta 8000..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Aguardar backend iniciar
sleep 5

# Iniciar Frontend (Marketing Site)
echo "📦 Iniciando frontend (site de marketing)..."
cd "$BASE_DIR/apps/marketing-site/frontend"

if [ ! -d "node_modules" ]; then
    echo "   Instalando dependências..."
    npm install
fi

echo "   Iniciando servidor na porta 8080..."
npm run dev &
FRONTEND_PID=$!

# Função de limpeza
cleanup() {
    echo ""
    echo "🛑 Encerrando processos..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit
}

trap cleanup SIGINT SIGTERM

echo ""
echo "✅ Sistema iniciado!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:8080"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Pressione Ctrl+C para encerrar"

wait
