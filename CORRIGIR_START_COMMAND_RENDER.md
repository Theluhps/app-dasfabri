# 🔧 CORRIGIR START COMMAND NO RENDER

**Problema:** `Could not import module "main"`

**Causa:** O Python não está encontrando o módulo `app` porque o PYTHONPATH não está configurado.

---

## ✅ SOLUÇÃO

### Opção 1: Adicionar PYTHONPATH no Start Command (Recomendado)

No Render, vá em **"Settings"** → **"Start Command"** e mude para:

```bash
export PYTHONPATH=/opt/render/project/src/apps/saas-platform/backend:$PYTHONPATH && uvicorn main:app --host 0.0.0.0 --port $PORT
```

**OU** mais simples:

```bash
PYTHONPATH=/opt/render/project/src/apps/saas-platform/backend uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Opção 2: Usar Python -m (Alternativa)

```bash
cd /opt/render/project/src/apps/saas-platform/backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Opção 3: Adicionar Variável de Ambiente PYTHONPATH

1. No Render, vá em **"Environment"**
2. Adicione variável:
   - **NAME:** `PYTHONPATH`
   - **Value:** `/opt/render/project/src/apps/saas-platform/backend`
3. **Start Command** fica simples:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

---

## 🎯 RECOMENDAÇÃO FINAL

**Use a Opção 3** (adicionar PYTHONPATH como variável de ambiente):

1. **Environment Variables:**
   - Adicione: `PYTHONPATH` = `/opt/render/project/src/apps/saas-platform/backend`

2. **Start Command:**
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

Isso é mais limpo e fácil de manter.

---

**Faça essas mudanças e tente deploy novamente!** 🚀
