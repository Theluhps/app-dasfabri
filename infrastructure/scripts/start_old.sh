#!/bin/bash

# Função para verificar se uma porta está em uso
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Função para matar processos em uma porta específica
kill_port() {
    if check_port $1; then
        echo "Porta $1 está em uso. Tentando liberar..."
        lsof -ti :$1 | xargs kill -9
        sleep 2
    fi
}

# Liberar portas se estiverem em uso
kill_port 8000
kill_port 3000

# Iniciar o backend
echo "Iniciando o backend..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Aguardar o backend iniciar
sleep 5

# Iniciar o frontend
echo "Iniciando o frontend..."
cd ../Dasfabri\ Platform
npm install
npm run dev &
FRONTEND_PID=$!

# Função para limpar processos ao sair
cleanup() {
    echo "Encerrando processos..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Manter o script rodando
wait 