#!/bin/bash

# Script para iniciar o servidor de desenvolvimento do Dasfabri

echo "🚀 Iniciando servidor Dasfabri..."
echo ""

# Navegar para o diretório do frontend
cd "$(dirname "$0")"

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Matar qualquer processo na porta 8080
echo "🧹 Limpando porta 8080..."
lsof -ti:8080 | xargs kill -9 2>/dev/null
sleep 2

# Iniciar o servidor
echo "✅ Iniciando servidor na porta 8080..."
echo "🌐 Acesse: http://localhost:8080"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

npm run dev

