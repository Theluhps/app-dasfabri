#!/bin/bash

# Script para criar arquivo .env com configurações do EmailJS

cat > "apps/marketing-site/frontend/.env" << 'EOF'
# EmailJS Configuration
# Service ID já configurado
VITE_EMAILJS_SERVICE_ID=service_b356vgs

# Public Key já configurado
VITE_EMAILJS_PUBLIC_KEY=EigDHTvAsFSxLIw3A

# Template IDs - ADICIONAR DEPOIS DE CRIAR OS TEMPLATES
# Substitua template_xxxxx pelo ID do template "Contato Demonstração"
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_xxxxx

# Substitua template_yyyyy pelo ID do template "Solicitação de Acesso"
VITE_EMAILJS_TEMPLATE_ID_ACCESS=template_yyyyy
EOF

echo "✅ Arquivo .env criado em apps/marketing-site/frontend/.env"
echo ""
echo "📋 Configurações adicionadas:"
echo "  ✅ Service ID: service_b356vgs"
echo "  ✅ Public Key: EigDHTvAsFSxLIw3A"
echo "  ⏳ Template IDs: template_xxxxx e template_yyyyy"
echo ""
echo "📝 Próximo passo:"
echo "  Criar os 2 templates no EmailJS e substituir os IDs no .env"

