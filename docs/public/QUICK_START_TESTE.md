# 🚀 QUICK START - Teste das APIs

## ⚡ Início Rápido

### 1. Iniciar o Backend

```bash
cd apps/saas-platform/backend
uvicorn main:app --reload
```

✅ Servidor rodando em: `http://localhost:8000`

---

### 2. Acessar o Swagger

Abra no navegador: **http://localhost:8000/docs**

---

### 3. Autenticação (OBRIGATÓRIA)

#### Passo 1: Fazer Login
1. No Swagger, encontre: **`POST /api/v1/auth/login`**
2. Clique em **"Try it out"**
3. Preencha:
   ```json
   {
     "email": "seu-email@exemplo.com",
     "password": "sua-senha"
   }
   ```
4. Clique em **"Execute"**
5. Copie o `access_token` da resposta

#### Passo 2: Autorizar
1. Clique no botão **"Authorize"** (cadeado) no topo
2. No campo "Value", cole: `Bearer {seu-token}`
3. Clique em **"Authorize"**
4. Clique em **"Close"**

✅ Agora você pode testar todas as APIs!

---

## 🎯 Testes Rápidos (5 minutos)

### Teste 1: Control Tower Summary
1. **`GET /api/v1/control-tower/summary`**
2. Clique em "Try it out" → "Execute"
3. ✅ Deve retornar KPIs consolidados

### Teste 2: Criar Produto
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

### Teste 3: Criar Ato de Drawback
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
3. ✅ Deve criar o ato com número gerado

---

## 📊 Verificar Resultados

### Ver dados no banco:
```bash
cd apps/saas-platform/backend
sqlite3 ../../data/databases/kue_marketing.db

# Exemplos de queries:
.tables
SELECT * FROM products;
SELECT * FROM drawback_acts;
SELECT * FROM warehouses;
```

---

## 🐛 Problemas Comuns

### Erro 401 (Unauthorized)
- **Solução:** Faça login novamente e atualize o token

### Erro 404 (Not Found)
- **Solução:** Verifique se o ID existe

### Servidor não inicia
- **Solução:** Verifique se a porta 8000 está livre
- **Alternativa:** Use outra porta: `uvicorn main:app --reload --port 8001`

---

## ✅ Checklist de Teste

- [ ] Servidor iniciado
- [ ] Swagger acessível
- [ ] Login realizado
- [ ] Token autorizado
- [ ] Control Tower testado
- [ ] Drawback testado
- [ ] Products testado
- [ ] Warehouse testado
- [ ] Classification testado
- [ ] Customs testado

---

## 📚 Documentação Completa

- **Guia Completo:** `docs/public/GUIA_APIS_SWAGGER.md`
- **Guia de Testes:** `docs/public/GUIA_TESTE_APIS.md`

---

**Boa sorte! 🚀**

