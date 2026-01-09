#!/bin/bash

cd "$(dirname "$0")/apps/marketing-site/frontend"

echo "🛑 Parando processos anteriores..."
pkill -f "vite" 2>/dev/null
pkill -f "node.*dev" 2>/dev/null
sleep 2

echo "🚀 Iniciando servidor frontend..."
npm run dev &
VITE_PID=$!

echo "⏳ Aguardando servidor iniciar (30 segundos)..."
sleep 30

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

