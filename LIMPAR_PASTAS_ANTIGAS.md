# 🗑️ LIMPAR PASTAS ANTIGAS

**Status atual:**
- ✅ `Dasfabri Platform/` - **DELETADA** (não existe mais)
- ✅ `backend/` antiga - **DELETADA** (movida para `apps/saas-platform/backend/`)
- ⚠️ `Dasfabri/` - **AINDA EXISTE** (precisa verificar se é necessária)

---

## 📋 PASTAS ENCONTRADAS

### ✅ Pastas que NÃO existem mais:
- `Dasfabri Platform/` ✅
- `backend/` (antiga) ✅

### ⚠️ Pastas que ainda existem:
- `Dasfabri/` - Precisa verificar conteúdo

---

## 🔍 VERIFICAR PASTA 'Dasfabri'

A pasta `Dasfabri/` ainda existe. Precisamos verificar:

1. **O que tem dentro?**
2. **É um submodule?** (tem `.git` dentro?)
3. **Ainda é necessária?**

---

## 🗑️ COMO DELETAR (Se não for necessária)

### Opção 1: Deletar do Git e Localmente

```bash
cd "/Users/thelhps/Desktop/Dasfabri Sistema SaaS"

# 1. Remover do git
git rm -r --cached Dasfabri/

# 2. Deletar localmente
rm -rf Dasfabri/

# 3. Fazer commit
git add .gitignore
git commit -m "Remove pasta antiga Dasfabri"

# 4. Push
git push origin main --force
```

### Opção 2: Apenas Remover do Git (Manter Localmente)

```bash
# Remover do git mas manter localmente
git rm -r --cached Dasfabri/
git commit -m "Remove pasta Dasfabri do git"
git push origin main --force
```

---

## ⚠️ ATENÇÃO

**Antes de deletar, verifique:**
- ✅ Se tem algo importante dentro
- ✅ Se é um submodule (pode ter código importante)
- ✅ Se não está sendo usado em outro lugar

---

## 📋 OUTRAS PASTAS PARA VERIFICAR

- `Apresentaçoes/` - Pode ter conteúdo duplicado com `presentations/`
- `.benchmarks/` - Pode ser deletado (gerado automaticamente)
- `.pytest_cache/` - Pode ser deletado (gerado automaticamente)

---

**Vou verificar o conteúdo da pasta 'Dasfabri' agora!** 🔍
