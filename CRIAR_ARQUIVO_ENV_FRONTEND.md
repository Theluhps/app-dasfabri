# 📝 Criar Arquivo .env no Frontend

## ⚠️ IMPORTANTE

O arquivo `.env` não pode ser criado automaticamente por questões de segurança. Você precisa criá-lo manualmente.

---

## 🚀 PASSO A PASSO

### 1. Navegue até a pasta do frontend:
```bash
cd apps/marketing-site/frontend
```

### 2. Crie o arquivo `.env`:

**No macOS/Linux:**
```bash
cat > .env << 'EOF'
# Configuração da API Backend
# Para desenvolvimento local, use:
VITE_API_URL=http://localhost:8000
EOF
```

**Ou crie manualmente:**
1. Abra um editor de texto
2. Crie um novo arquivo chamado `.env` (sem extensão)
3. Cole o conteúdo abaixo:

```env
# Configuração da API Backend
# Para desenvolvimento local, use:
VITE_API_URL=http://localhost:8000
```

### 3. Verifique se foi criado:
```bash
cat .env
```

Você deve ver:
```
# Configuração da API Backend
# Para desenvolvimento local, use:
VITE_API_URL=http://localhost:8000
```

---

## 🔄 Para Produção

Se você quiser usar o backend do Render em produção, crie também o arquivo `.env.production`:

```env
# Configuração da API Backend para Produção
VITE_API_URL=https://dasfabri-api.onrender.com
```

**OU** se você tiver domínio customizado:
```env
VITE_API_URL=https://app.dasfabri.com.br
```

---

## ✅ Depois de Criar

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   # Pare o servidor (Ctrl+C)
   # Inicie novamente:
   npm run dev
   ```

2. **Teste a conexão:**
   - Abra o console do navegador (F12)
   - Tente criar um processo de importação
   - Verifique se não há erros de conexão

---

## 🎯 URLs Disponíveis

### Desenvolvimento Local:
- `http://localhost:8000` (se o backend estiver rodando localmente)

### Render (Produção):
- `https://dasfabri-api.onrender.com` (URL padrão do Render)
- `https://app.dasfabri.com.br` (se você configurou domínio customizado)

---

## ⚠️ IMPORTANTE

- O arquivo `.env` **NÃO** deve ser commitado no Git (já está no .gitignore)
- Cada desenvolvedor deve criar seu próprio `.env`
- Para produção, use `.env.production` ou configure no Render Dashboard

---

## 🚨 Se Não Funcionar

1. **Verifique se o backend está rodando:**
   - Local: `http://localhost:8000/docs` deve abrir a documentação da API
   - Render: Verifique se o serviço está online

2. **Verifique o console do navegador:**
   - Abra F12 → Console
   - Procure por erros de conexão

3. **Verifique se o arquivo .env está no lugar certo:**
   - Deve estar em: `apps/marketing-site/frontend/.env`
   - Não em: `apps/marketing-site/.env` ou na raiz do projeto

---

**Pronto! Agora você pode testar a conexão com o backend.** 🎉
