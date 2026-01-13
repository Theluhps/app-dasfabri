# 🔧 CORRIGIR VERSÃO DO PYTHON NO RENDER

**Erro:** `TypeError: ForwardRef._evaluate() missing 1 required keyword-only argument: 'recursive_guard'`

**Causa:** 
- O Render está usando Python 3.13.4 (muito novo)
- Pydantic 1.10.11 não é compatível com Python 3.13
- FastAPI 0.100.0 também pode ter problemas

**Solução:** Forçar uso de Python 3.11.0

---

## ✅ SOLUÇÃO IMEDIATA

### Passo 1: Adicionar/Verificar Variável PYTHON_VERSION

No Render Dashboard:

1. Vá no Web Service (`app-dasfabri`)
2. Clique em **"Environment"**
3. Procure por `PYTHON_VERSION`
4. Se não existir, adicione:
   - **NAME:** `PYTHON_VERSION`
   - **Value:** `3.11.0`
5. Se existir mas estiver diferente, mude para `3.11.0`
6. Clique em **"Save Changes"**

### Passo 2: Fazer Novo Deploy

1. Clique em **"Manual Deploy"** → **"Deploy latest commit"**
2. Aguarde build
3. Agora deve instalar Python 3.11.0

---

## 🔍 VERIFICAR NO LOG

Após o deploy, verifique nos logs:

**Antes (errado):**
```
==> Installing Python version 3.13.4...
==> Using Python version 3.13.4 (default)
```

**Depois (correto):**
```
==> Installing Python version 3.11.0...
==> Using Python version 3.11.0 via environment variable PYTHON_VERSION
```

---

## ⚠️ IMPORTANTE

A variável `PYTHON_VERSION` deve estar configurada **ANTES** do build. Se você adicionar depois, precisa fazer um novo deploy.

---

**Adicione a variável PYTHON_VERSION=3.11.0 e faça deploy novamente!** 🚀
