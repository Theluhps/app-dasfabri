# 🚀 Como Iniciar o Sistema Completo

## ⚠️ IMPORTANTE: Dois Servidores Necessários

O sistema precisa de **DOIS servidores rodando simultaneamente**:

1. **Backend** (FastAPI) - Porta 8000
2. **Frontend** (Vite/React) - Porta 5173

## 📋 Passo a Passo

### Terminal 1 - Backend

```bash
cd apps/saas-platform/backend
source ../../../venv/bin/activate
uvicorn main:app --reload
```

**Você deve ver:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2 - Frontend

```bash
cd apps/marketing-site/frontend
npm run dev
```

**Você deve ver:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## 🌐 URLs

- **Frontend (Interface)**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs

## ⚠️ Problema Comum

Se você ver JSON no navegador em vez da interface React:
- ❌ Frontend não está rodando
- ✅ Backend está rodando (por isso mostra o JSON da API)

**Solução**: Inicie o frontend no Terminal 2!

## 🔍 Verificar Status

```bash
# Verificar backend
lsof -ti:8000

# Verificar frontend
lsof -ti:5173
```

## 📝 Script Rápido

Crie dois terminais e execute:

**Terminal 1:**
```bash
cd apps/saas-platform/backend && source ../../../venv/bin/activate && uvicorn main:app --reload
```

**Terminal 2:**
```bash
cd apps/marketing-site/frontend && npm run dev
```

Depois acesse: **http://localhost:5173**

