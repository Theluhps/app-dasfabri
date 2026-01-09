# 🚀 Como Iniciar o Frontend

## Status Atual
- ✅ **Backend**: Rodando em http://localhost:8000
- ✅ **Swagger UI**: Disponível em http://localhost:8000/docs
- ❌ **Frontend**: Não está rodando

## Iniciar o Frontend

### Opção 1: Usando o script (recomendado)
```bash
cd apps/marketing-site/frontend
npm run dev
```

### Opção 2: Passo a passo

1. **Navegar para o diretório do frontend:**
   ```bash
   cd apps/marketing-site/frontend
   ```

2. **Instalar dependências (se necessário):**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Aguardar a mensagem:**
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

5. **Abrir no navegador:**
   - Acesse: http://localhost:5173
   - Ou o Vite abrirá automaticamente

## Módulos Disponíveis

Após iniciar, você pode acessar:

- **Dashboard**: http://localhost:5173/dashboard
- **Products Management**: http://localhost:5173/products
- **Warehouses Management**: http://localhost:5173/warehouses
- **Classification NCM**: http://localhost:5173/classification
- **Advanced Customs**: http://localhost:5173/customs
- **Watchlist**: http://localhost:5173/watchlist
- **Tasks**: http://localhost:5173/tasks
- **Map**: http://localhost:5173/map

## Troubleshooting

### Porta 5173 já está em uso
```bash
# Verificar processo
lsof -ti:5173

# Parar processo
kill $(lsof -ti:5173)

# Ou usar outra porta
npm run dev -- --port 5174
```

### Erro ao instalar dependências
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
```

### Frontend não conecta com backend
- Verifique se o backend está rodando: http://localhost:8000
- Verifique o console do navegador (F12) para erros
- Verifique se a URL da API está correta em `src/config/api.ts`

## Importante

O frontend precisa do backend rodando para funcionar completamente. Certifique-se de que:
- ✅ Backend está rodando em http://localhost:8000
- ✅ Frontend está rodando em http://localhost:5173
- ✅ Não há erros no console do navegador
