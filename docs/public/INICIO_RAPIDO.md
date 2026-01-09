# ⚡ INÍCIO RÁPIDO - TESTE DAS APIs

## 🚀 Servidor Iniciado!

O backend está rodando em: **http://localhost:8000**

---

## 📱 Acesse o Swagger

**URL:** http://localhost:8000/docs

---

## 🔐 Passo 1: Autenticação

### 1.1 Fazer Login

1. No Swagger, encontre: **`POST /api/v1/auth/login`**
2. Clique em **"Try it out"**
3. Preencha o body:
   ```json
   {
     "email": "seu-email@exemplo.com",
     "password": "sua-senha"
   }
   ```
4. Clique em **"Execute"**
5. **Copie o `access_token`** da resposta

### 1.2 Autorizar

1. Clique no botão **"Authorize"** 🔒 (cadeado no topo)
2. No campo **"Value"**, cole: `Bearer {seu-token}`
   - Exemplo: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Clique em **"Authorize"**
4. Clique em **"Close"**

✅ Agora você está autenticado!

---

## 🧪 Passo 2: Testar APIs

### Teste Rápido 1: Control Tower

1. **`GET /api/v1/control-tower/summary`**
2. Clique em **"Try it out"**
3. Clique em **"Execute"**
4. ✅ Deve retornar KPIs consolidados

### Teste Rápido 2: Criar Produto

1. **`POST /api/v1/products/`**
2. Body:
   ```json
   {
     "code": "TEST-001",
     "name": "Produto Teste",
     "description": "Produto para teste",
     "currency": "USD"
   }
   ```
3. ✅ Deve criar o produto

### Teste Rápido 3: Criar Ato de Drawback

1. **`POST /api/v1/drawback/acts`**
2. Body:
   ```json
   {
     "act_type": "exemption",
     "description": "Ato de teste",
     "total_value": 1000.00,
     "currency": "BRL"
   }
   ```
3. ✅ Deve criar o ato

---

## 📊 Verificar Resultados

### Ver no Swagger:
- Os endpoints retornam dados JSON
- Status 200 = Sucesso
- Status 401 = Precisa autenticar
- Status 404 = Recurso não encontrado

### Ver no Banco de Dados:
```bash
cd apps/saas-platform/backend
sqlite3 ../../data/databases/kue_marketing.db

# Ver tabelas
.tables

# Ver produtos
SELECT * FROM products;

# Ver atos de drawback
SELECT * FROM drawback_acts;
```

---

## 🎯 Checklist de Teste

- [ ] Servidor rodando (http://localhost:8000/docs)
- [ ] Login realizado
- [ ] Token autorizado
- [ ] Control Tower testado
- [ ] Drawback testado
- [ ] Products testado
- [ ] Warehouse testado
- [ ] Classification testado
- [ ] Customs testado

---

## 🐛 Problemas?

### Servidor não inicia
```bash
# Verificar se porta está livre
lsof -i :8000

# Usar outra porta
uvicorn main:app --reload --port 8001
```

### Erro 401 (Unauthorized)
- Faça login novamente
- Atualize o token no Swagger

### Erro 500 (Internal Server Error)
- Verifique os logs do terminal
- Verifique se o banco de dados existe

---

## 📚 Documentação Completa

- **Quick Start:** `QUICK_START_TESTE.md`
- **Guia Completo:** `GUIA_TESTE_APIS.md`
- **Referência APIs:** `GUIA_APIS_SWAGGER.md`

---

**Boa sorte com os testes! 🚀**

