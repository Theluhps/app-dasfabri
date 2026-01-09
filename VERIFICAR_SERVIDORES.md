# 🔍 Verificar Status dos Servidores

## Problema: Frontend não consegue conectar ao backend

### 1. Verificar se o backend está rodando

```bash
# Verificar processo na porta 8000
lsof -ti:8000

# Ou testar diretamente
curl http://localhost:8000/health
```

### 2. Se o backend NÃO estiver rodando

**Inicie o backend:**

```bash
cd apps/saas-platform/backend
source ../../../venv/bin/activate
uvicorn main:app --reload
```

Você deve ver:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 3. Verificar se o frontend está rodando

```bash
# Verificar processo na porta 5173
lsof -ti:5173

# Ou testar diretamente
curl http://localhost:5173
```

### 4. Se o frontend NÃO estiver rodando

**Inicie o frontend:**

```bash
cd apps/marketing-site/frontend
npm run dev
```

Você deve ver:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 5. Ordem correta de inicialização

1. **Primeiro**: Inicie o backend
   ```bash
   cd apps/saas-platform/backend
   uvicorn main:app --reload
   ```

2. **Depois**: Inicie o frontend (em outro terminal)
   ```bash
   cd apps/marketing-site/frontend
   npm run dev
   ```

### 6. Verificar CORS

O backend já está configurado para aceitar requisições do frontend:
- CORS está habilitado em `main.py`
- `allow_origins=["*"]` permite todas as origens

### 7. Testar conexão manualmente

No navegador, abra o Console (F12) e execute:

```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Se der erro, o backend não está acessível.

### 8. Solução rápida

```bash
# Terminal 1 - Backend
cd apps/saas-platform/backend
source ../../../venv/bin/activate
uvicorn main:app --reload

# Terminal 2 - Frontend
cd apps/marketing-site/frontend
npm run dev
```

### 9. URLs importantes

- **Backend API**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173

### 10. Erro comum

Se aparecer "Não foi possível conectar ao servidor":
- ✅ Verifique se o backend está rodando
- ✅ Verifique se está na porta 8000
- ✅ Verifique se não há firewall bloqueando
- ✅ Verifique o console do navegador (F12) para mais detalhes

