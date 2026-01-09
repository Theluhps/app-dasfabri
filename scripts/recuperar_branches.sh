#!/bin/bash

# 🔄 Script para Recuperar Branches do GitHub

set -e

echo "🔄 RECUPERANDO BRANCHES DO GITHUB"
echo "================================"
echo ""

# Atualizar referências
echo "📥 Atualizando referências do GitHub..."
git fetch origin --prune

echo ""
echo "📋 Branches encontradas no GitHub:"
git branch -r | grep -v "HEAD"

echo ""
read -p "Deseja recuperar todas as branches? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado pelo usuário"
    exit 0
fi

# Recuperar cada branch
echo ""
echo "🔄 Recuperando branches..."

# DATA
if git show-ref --verify --quiet refs/remotes/origin/DATA; then
    if ! git show-ref --verify --quiet refs/heads/DATA; then
        echo "  ✅ Recuperando DATA..."
        git checkout -b DATA origin/DATA
    else
        echo "  ⚠️  DATA já existe localmente"
    fi
fi

# master
if git show-ref --verify --quiet refs/remotes/origin/master; then
    if ! git show-ref --verify --quiet refs/heads/master; then
        echo "  ✅ Recuperando master..."
        git checkout -b master origin/master
    else
        echo "  ⚠️  master já existe localmente"
    fi
fi

# codespace
if git show-ref --verify --quiet refs/remotes/origin/codespace-stunning-bassoon-4vqg559xvjw2jg6g; then
    if ! git show-ref --verify --quiet refs/heads/codespace; then
        echo "  ✅ Recuperando codespace..."
        git checkout -b codespace origin/codespace-stunning-bassoon-4vqg559xvjw2jg6g
    else
        echo "  ⚠️  codespace já existe localmente"
    fi
fi

echo ""
echo "✅ Branches recuperadas!"
echo ""
echo "📋 Branches locais agora:"
git branch

echo ""
echo "💡 Para voltar para main:"
echo "   git checkout main"
