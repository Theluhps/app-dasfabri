#!/bin/bash

# Script para criar/atualizar arquivo .env com configurações do EmailJS

cat > "apps/marketing-site/frontend/.env" << 'EOF'
# EmailJS Configuration
# Service ID já configurado
VITE_EMAILJS_SERVICE_ID=service_b356vgs

# Public Key já configurado
VITE_EMAILJS_PUBLIC_KEY=EigDHTvAsFSxLIw3A

# Template IDs
# Template ID do "Contato Demonstração"
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_0undr9w

# Template ID do "Solicitação de Acesso"
VITE_EMAILJS_TEMPLATE_ID_ACCESS=template_gmra0qh
EOF

echo "✅ Arquivo .env criado/atualizado em apps/marketing-site/frontend/.env"
echo ""
echo "📋 Configurações:"
echo "  ✅ Service ID: service_b356vgs"
echo "  ✅ Public Key: EigDHTvAsFSxLIw3A"
echo "  ✅ Template ID Contato: template_0undr9w"
echo "  ✅ Template ID Acesso: template_gmra0qh"
echo ""
echo "🚀 Próximo passo: npm run build"

