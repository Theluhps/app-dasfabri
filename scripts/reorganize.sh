#!/bin/bash

# Script de Reorganização Big Tech - Dasfabri
# Reorganiza o projeto em estrutura profissional estilo Google/Microsoft

set -e

echo "🏗️  Iniciando reorganização Big Tech..."
echo ""

BASE_DIR="$(pwd)"

# Criar estrutura de pastas
echo "📁 Criando estrutura de pastas..."
mkdir -p apps/marketing-site/frontend
mkdir -p apps/marketing-site/backend
mkdir -p apps/saas-platform/backend/app/{api/v1,core,models,schemas,services}
mkdir -p apps/saas-platform/backend/{alembic/versions,tests/{unit,integration,e2e},scripts}
mkdir -p infrastructure/{docker,kubernetes,terraform,scripts}
mkdir -p shared/{types,utils,constants}
mkdir -p docs/{public/{api,user-guide},internal/{architecture,design,processes,security}}
mkdir -p presentations/{commercial,technical}
mkdir -p data/{databases,seeds}
mkdir -p scripts
mkdir -p .github/workflows

echo "✅ Estrutura criada"
echo ""

# 1. MOVER SITE DE MARKETING
echo "📦 Movendo site de marketing..."
if [ -d "Dasfabri/Dasfabri-Platform" ]; then
    echo "   → Movendo Dasfabri-Platform para apps/marketing-site/frontend/"
    cp -r "Dasfabri/Dasfabri-Platform"/* "apps/marketing-site/frontend/" 2>/dev/null || true
    echo "   ✓ Site de marketing movido"
fi

if [ -d "Dasfabri/backend" ] && [ -f "Dasfabri/backend/main.py" ]; then
    # Verificar se é backend de marketing (menor)
    LINES=$(wc -l < "Dasfabri/backend/main.py" 2>/dev/null || echo "0")
    if [ "$LINES" -lt 50 ]; then
        echo "   → Movendo backend de marketing para apps/marketing-site/backend/"
        cp -r "Dasfabri/backend"/* "apps/marketing-site/backend/" 2>/dev/null || true
        echo "   ✓ Backend de marketing movido"
    fi
fi

# 2. MOVER SISTEMA SAAS
echo "📦 Movendo sistema SaaS..."
if [ -d "backend" ]; then
    echo "   → Movendo backend principal para apps/saas-platform/backend/"
    
    # Mover estrutura principal
    if [ -d "backend/api" ]; then
        cp -r "backend/api"/* "apps/saas-platform/backend/app/api/v1/" 2>/dev/null || true
    fi
    
    if [ -d "backend/models" ]; then
        cp -r "backend/models"/* "apps/saas-platform/backend/app/models/" 2>/dev/null || true
    fi
    
    # Mover arquivos principais
    [ -f "backend/main.py" ] && cp "backend/main.py" "apps/saas-platform/backend/main.py"
    [ -f "backend/database.py" ] && cp "backend/database.py" "apps/saas-platform/backend/app/core/database.py"
    [ -f "backend/auth.py" ] && cp "backend/auth.py" "apps/saas-platform/backend/app/core/security.py"
    [ -f "backend/schemas.py" ] && cp "backend/schemas.py" "apps/saas-platform/backend/app/schemas/__init__.py"
    [ -f "backend/requirements.txt" ] && cp "backend/requirements.txt" "apps/saas-platform/backend/requirements.txt"
    [ -f "backend/alembic.ini" ] && cp "backend/alembic.ini" "apps/saas-platform/backend/alembic.ini"
    
    # Mover migrações
    if [ -d "backend/migrations" ]; then
        cp -r "backend/migrations"/* "apps/saas-platform/backend/alembic/" 2>/dev/null || true
    fi
    
    # Mover scripts
    if [ -d "backend/scripts" ]; then
        cp -r "backend/scripts"/* "apps/saas-platform/backend/scripts/" 2>/dev/null || true
    fi
    
    echo "   ✓ Sistema SaaS movido"
fi

# 3. MOVER BANCO DE DADOS
echo "📦 Movendo banco de dados..."
if [ -f "kue_marketing.db" ]; then
    cp "kue_marketing.db" "data/databases/kue_marketing.db"
    echo "   ✓ Banco de dados movido"
fi

# 4. MOVER APRESENTAÇÕES
echo "📦 Movendo apresentações..."
if [ -d "Apresentações" ]; then
    # Mover comerciais
    if [ -d "Apresentações/Importação" ]; then
        cp -r "Apresentações/Importação"/* "presentations/commercial/" 2>/dev/null || true
    fi
    if [ -f "Apresentações/PPT Apresentação comercial.pptx" ]; then
        cp "Apresentações/PPT Apresentação comercial.pptx" "presentations/commercial/" 2>/dev/null || true
    fi
    
    # Mover técnicas
    if [ -d "Apresentações/Técnica" ]; then
        cp -r "Apresentações/Técnica"/* "presentations/technical/" 2>/dev/null || true
    fi
    
    echo "   ✓ Apresentações movidas"
fi

# 5. MOVER SCRIPTS
echo "📦 Movendo scripts..."
[ -f "limpar_projeto_seguro.sh" ] && cp "limpar_projeto_seguro.sh" "scripts/cleanup.sh"
[ -f "Dasfabri/start.sh" ] && cp "Dasfabri/start.sh" "infrastructure/scripts/start.sh"
echo "   ✓ Scripts movidos"

# 6. CRIAR ARQUIVOS DE CONFIGURAÇÃO
echo "📝 Criando arquivos de configuração..."

# .gitignore para documentação sigilosa
cat > "docs/internal/.gitignore" << 'EOF'
# Documentação sigilosa - NÃO COMMITAR
*
!.gitignore
EOF

# README principal
cat > "README.md" << 'EOF'
# Dasfabri - Sistema SaaS de Comércio Exterior

Sistema completo de gestão de comércio exterior com arquitetura moderna e escalável.

## 📁 Estrutura do Projeto

- `apps/` - Aplicações (marketing-site, saas-platform)
- `infrastructure/` - Infraestrutura e deploy
- `docs/` - Documentação (pública e interna)
- `data/` - Bancos de dados
- `scripts/` - Scripts de manutenção

## 🚀 Início Rápido

Ver documentação em `docs/public/getting-started.md`

## ⚠️ Documentação Sigilosa

A documentação em `docs/internal/` é sigilosa e não deve ser commitada.
EOF

# .env.example
cat > ".env.example" << 'EOF'
# Database
DATABASE_URL=sqlite:///./data/databases/kue_marketing.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_V1_STR=/api/v1
PROJECT_NAME=Dasfabri API

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]
EOF

echo "   ✓ Arquivos de configuração criados"

# 7. CRIAR ESTRUTURA DE DOCUMENTAÇÃO SIGILOSA
echo "📝 Criando estrutura de documentação sigilosa..."
cat > "docs/internal/README.md" << 'EOF'
# ⚠️ DOCUMENTAÇÃO SIGILOSA

Esta pasta contém documentação interna e sigilosa da Dasfabri.

## ⛔ IMPORTANTE

- **NÃO COMMITAR** esta pasta no Git
- Acesso restrito apenas a membros autorizados
- Contém informações sobre arquitetura, design e processos internos

## 📁 Estrutura

- `architecture/` - Arquitetura do sistema
- `design/` - Decisões de design
- `processes/` - Processos internos
- `security/` - Políticas de segurança
EOF

echo "   ✓ Documentação sigilosa configurada"

echo ""
echo "✅ Reorganização concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Revisar estrutura criada em apps/, docs/, data/"
echo "   2. Atualizar imports nos arquivos movidos"
echo "   3. Testar que tudo funciona"
echo "   4. Remover pastas antigas após confirmação"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Documentação sigilosa em docs/internal/ está protegida"
echo "   - Arquivos foram COPIADOS (não movidos) para segurança"
echo "   - Revise antes de excluir pastas antigas"

