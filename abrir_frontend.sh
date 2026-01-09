#!/bin/bash

echo "🚀 Iniciando Frontend Dasfabri..."
echo ""

# Navegar para o diretório do frontend
cd "$(dirname "$0")/apps/marketing-site/frontend"

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se já existe um processo rodando na porta 5173
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Servidor já está rodando em http://localhost:5173"
    echo "🌐 Abrindo no navegador..."
    sleep 2
    open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5173 2>/dev/null || echo "Abra manualmente: http://localhost:5173"
else
    echo "🚀 Iniciando servidor de desenvolvimento..."
    echo "🌐 O frontend estará disponível em: http://localhost:5173"
    echo ""
    echo "📋 Módulos disponíveis:"
    echo "  • Products Management: /products"
    echo "  • Warehouses Management: /warehouses"
    echo "  • Classification NCM: /classification"
    echo "  • Advanced Customs: /customs"
    echo ""
    echo "⏳ Aguarde alguns segundos para o servidor iniciar..."
    echo "🌐 Abrindo no navegador em 5 segundos..."
    sleep 5
    open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5173 2>/dev/null || echo "Abra manualmente: http://localhost:5173"
    
    # Iniciar o servidor
    npm run dev
fi

