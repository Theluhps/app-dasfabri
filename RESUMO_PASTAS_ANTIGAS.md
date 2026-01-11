# 📋 RESUMO: PASTAS ANTIGAS

## ✅ PASTAS JÁ DELETADAS

- ✅ `Dasfabri Platform/` - **DELETADA** (não existe mais)
- ✅ `backend/` (antiga) - **DELETADA** (movida para `apps/saas-platform/backend/`)

---

## ⚠️ PASTAS QUE AINDA EXISTEM

### 1. `Dasfabri/` (316KB)
- **Tipo:** Submodule (tem `.git` dentro)
- **Conteúdo:** package.json, setup.py, wsgi.py, .gitignore
- **Status:** Ainda está no git
- **Ação:** Pode ser removida (código já está em `apps/`)

### 2. `Apresentaçoes/` (possível duplicata)
- **Tipo:** Pasta com apresentações
- **Status:** Pode ser duplicata de `presentations/`
- **Ação:** Verificar se tem conteúdo único

---

## 🗑️ COMO REMOVER

### Opção 1: Script Automático

```bash
cd "/Users/thelhps/Desktop/Dasfabri Sistema SaaS"
./scripts/limpar_pastas_antigas.sh
```

### Opção 2: Manual

```bash
# Remover Dasfabri do git
git rm -r --cached Dasfabri/

# Se quiser remover Apresentaçoes também
git rm -r --cached Apresentaçoes/

# Fazer commit
git commit -m "🗑️ Remove pastas antigas"

# Push
git push origin main --force
```

---

## ⚠️ IMPORTANTE

- **Remover do git:** Remove do controle de versão, mas mantém localmente
- **Deletar localmente:** `rm -rf Dasfabri/` (só depois de confirmar que não precisa)

---

## 📊 TAMANHO

- `Dasfabri/`: 316KB (pequeno, mas desnecessário)
- Removendo vai limpar o repositório

---

**Execute o script para remover automaticamente!** 🚀
