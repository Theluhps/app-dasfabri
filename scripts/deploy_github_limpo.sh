#!/bin/bash

# 🚀 Script para Deploy Limpo no GitHub
# Limpa arquivos deletados e faz push da estrutura atual

set -e

echo "🚀 DEPLOY LIMPO NO GITHUB"
echo "=========================="
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

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  ATENÇÃO: Há mudanças não commitadas!${NC}"
    echo ""
    echo "Arquivos modificados/novos:"
    git status --short | head -20
    echo ""
    read -p "Deseja continuar? (s/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "❌ Cancelado pelo usuário"
        exit 1
    fi
fi

echo "📋 Passo 1: Adicionando todos os arquivos novos..."
git add -A

echo ""
echo "📋 Passo 2: Removendo arquivos deletados do git..."
# Remover arquivos que foram deletados localmente mas ainda estão no git
git add -u

echo ""
echo "📋 Passo 3: Verificando status..."
echo ""
git status --short | head -30

echo ""
read -p "📝 Deseja fazer commit? (s/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado pelo usuário"
    exit 1
fi

echo ""
read -p "📝 Mensagem do commit (ou Enter para padrão): " commit_message

if [ -z "$commit_message" ]; then
    commit_message="🚀 Deploy limpo: Estrutura Big Tech organizada"
fi

echo ""
echo "📝 Fazendo commit..."
git commit -m "$commit_message"

echo ""
echo "📋 Passo 4: Verificando branch atual..."
# Compatível com versões antigas do git
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "Branch atual: $current_branch"

echo ""
read -p "📤 Deseja fazer push para origin/$current_branch? (s/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Push cancelado pelo usuário"
    echo "💡 Você pode fazer push manualmente depois com: git push origin $current_branch"
    exit 0
fi

echo ""
echo "📤 Fazendo push..."
echo ""
read -p "⚠️  ATENÇÃO: Se o GitHub tiver estrutura diferente, você quer fazer FORCE PUSH? (s/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "⚠️  Fazendo FORCE PUSH..."
    git push origin "$current_branch" --force
else
    echo "📤 Fazendo push normal..."
    git push origin "$current_branch"
fi

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo "🌐 Verifique no GitHub: https://github.com/Theluhps/Dasfabri"
