#!/bin/bash

# 🚀 Script para Deploy do Zero no GitHub
# Limpa tudo e faz push completo da estrutura atual

set -e

echo "🚀 DEPLOY DO ZERO NO GITHUB"
echo "============================"
echo ""
echo "⚠️  ATENÇÃO: Isso vai substituir TUDO no GitHub!"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está em um repositório git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Erro: Não é um repositório git!${NC}"
    exit 1
fi

# Confirmar
read -p "⚠️  Você tem CERTEZA que quer substituir tudo no GitHub? (digite 'SIM' para confirmar): " confirmacao

if [ "$confirmacao" != "SIM" ]; then
    echo "❌ Cancelado pelo usuário"
    exit 0
fi

echo ""
echo "📋 Passo 1: Removendo node_modules do git..."
if [ -d "apps/marketing-site/frontend/node_modules" ]; then
    git rm -r --cached apps/marketing-site/frontend/node_modules 2>/dev/null || true
    echo "  ✅ node_modules removido do git"
fi

echo ""
echo "📋 Passo 2: Removendo arquivos grandes..."
# Remover apresentações grandes (opcional - descomente se quiser)
# git rm --cached "presentations/commercial/PPT Apresentação comercial.pptx" 2>/dev/null || true
# git rm --cached "presentations/commercial/Importação.key" 2>/dev/null || true
# git rm --cached "presentations/technical/Proposta tecnica po management.key" 2>/dev/null || true

echo ""
echo "📋 Passo 3: Adicionando todos os arquivos..."
git add -A

echo ""
echo "📋 Passo 4: Verificando status..."
echo ""
git status --short | head -30

echo ""
read -p "📝 Deseja fazer commit? (s/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado pelo usuário"
    exit 0
fi

echo ""
read -p "📝 Mensagem do commit (ou Enter para padrão): " commit_message

if [ -z "$commit_message" ]; then
    commit_message="🚀 Deploy do zero: Estrutura Big Tech completa"
fi

echo ""
echo "📝 Fazendo commit..."
git commit -m "$commit_message" || echo "⚠️  Nenhuma mudança para commitar"

echo ""
echo "📋 Passo 5: Verificando branch..."
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "Branch atual: $current_branch"

echo ""
echo "⚠️  ATENÇÃO: Vou fazer FORCE PUSH agora!"
echo "Isso vai SUBSTITUIR tudo no GitHub!"
echo ""
read -p "Confirma FORCE PUSH? (digite 'FORCE' para confirmar): " force_confirm

if [ "$force_confirm" != "FORCE" ]; then
    echo "❌ Force push cancelado"
    echo "💡 Você pode fazer manualmente depois com:"
    echo "   git push origin $current_branch --force"
    exit 0
fi

echo ""
echo "📤 Fazendo FORCE PUSH..."
echo "⏳ Isso pode levar alguns minutos..."
echo ""

# Aumentar buffer do git
git config http.postBuffer 524288000

# Tentar push
if git push origin "$current_branch" --force; then
    echo ""
    echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
    echo ""
    echo "🌐 Verifique no GitHub: https://github.com/Theluhps/Dasfabri"
else
    echo ""
    echo -e "${RED}❌ Erro no push!${NC}"
    echo ""
    echo "💡 Possíveis soluções:"
    echo "   1. Verificar conexão com internet"
    echo "   2. Tentar novamente: git push origin $current_branch --force"
    echo "   3. Verificar se há arquivos muito grandes (>100MB)"
    exit 1
fi
