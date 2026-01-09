#!/bin/bash

# Script para iniciar frontend sem conflito com venv Python

cd "$(dirname "$0")/apps/marketing-site/frontend"

echo "🛑 Parando processos anteriores..."
pkill -f "vite" 2>/dev/null
pkill -f "node.*dev" 2>/dev/null
sleep 2

echo "🔧 Desativando venv Python se estiver ativo..."
deactivate 2>/dev/null || true
unset VIRTUAL_ENV

echo "🚀 Iniciando servidor frontend..."
echo ""

# Usar npx diretamente para evitar problemas com node_modules
npx --yes vite --host 0.0.0.0 --port 8080 &
VITE_PID=$!

echo "⏳ Aguardando servidor iniciar..."
sleep 20

echo "🔍 Verificando se servidor está rodando..."
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Servidor está respondendo!"
    echo "🌐 Abrindo navegador..."
    open http://localhost:8080
    echo ""
    echo "✅ Frontend iniciado e navegador aberto!"
    echo "💡 Para parar o servidor: kill $VITE_PID"
else
    echo "⚠️  Servidor ainda não está respondendo"
    echo "💡 Tente acessar manualmente: http://localhost:8080"
    echo "💡 Ou verifique os logs acima para erros"
fi

