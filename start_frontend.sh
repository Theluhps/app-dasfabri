#!/bin/bash

cd "$(dirname "$0")/apps/marketing-site/frontend"

echo "🚀 Iniciando frontend..."
echo ""

# Matar processos anteriores
pkill -f "vite" 2>/dev/null
pkill -f "node.*dev" 2>/dev/null
sleep 2

# Iniciar Vite
echo "📦 Iniciando servidor Vite na porta 8080..."
npm run dev &
VITE_PID=$!

echo "⏳ Aguardando Vite iniciar..."
sleep 10

# Verificar se está rodando
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Frontend rodando em http://localhost:8080"
    echo "🌐 Abrindo no navegador..."
    open http://localhost:8080
    echo ""
    echo "✅ Frontend iniciado! PID: $VITE_PID"
    echo "💡 Para parar: kill $VITE_PID"
else
    echo "❌ Frontend não iniciou corretamente"
    echo "📋 Verifique os logs acima para erros"
    exit 1
fi

