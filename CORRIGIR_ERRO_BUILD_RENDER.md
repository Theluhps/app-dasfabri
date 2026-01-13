# 🔧 CORRIGIR ERRO DE BUILD NO RENDER

**Erro:** `Cannot import 'setuptools.build_meta'`  
**Causa:** Falta setuptools e versão do Python incorreta

---

## ✅ SOLUÇÃO RÁPIDA

### 1. Adicionar Variável de Ambiente

No Render, vá em **"Environment"** e adicione:

- **NAME:** `PYTHON_VERSION`
- **Value:** `3.11.0`

⚠️ **IMPORTANTE:** O Render está usando Python 3.13, mas você precisa 3.11.0

---

### 2. Atualizar Build Command

No Render, vá em **"Settings"** → **"Build Command"** e mude para:

```bash
pip install --upgrade pip setuptools wheel && pip install -r requirements.txt
```

**OU** se não funcionar, tente:

```bash
python -m pip install --upgrade pip setuptools wheel && pip install -r requirements.txt
```

---

## 📋 PASSOS COMPLETOS

1. **No Render Dashboard:**
   - Vá no seu Web Service (`app-dasfabri`)
   - Clique em **"Environment"**
   - Adicione variável: `PYTHON_VERSION` = `3.11.0`

2. **Atualizar Build Command:**
   - Vá em **"Settings"**
   - Role até **"Build Command"**
   - Mude para: `pip install --upgrade pip setuptools wheel && pip install -r requirements.txt`

3. **Fazer Deploy Novamente:**
   - Clique em **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🚨 SE AINDA DER ERRO

Se ainda der erro, tente este Build Command alternativo:

```bash
python -m pip install --upgrade pip setuptools wheel && python -m pip install -r requirements.txt
```

---

**Faça essas mudanças e tente deploy novamente!** 🚀
