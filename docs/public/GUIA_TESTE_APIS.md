# 🧪 GUIA DE TESTE DAS APIs

## 🚀 Como Testar no Swagger

### 1. Iniciar o Backend

```bash
cd apps/saas-platform/backend
uvicorn main:app --reload
```

O servidor estará rodando em: `http://localhost:8000`

### 2. Acessar o Swagger

Abra no navegador: `http://localhost:8000/docs`

### 3. Autenticação

**IMPORTANTE:** Todas as APIs requerem autenticação!

1. No Swagger, clique no botão **"Authorize"** (cadeado) no topo
2. Use o endpoint `/api/v1/auth/login` para obter o token:
   ```json
   {
     "email": "seu-email@exemplo.com",
     "password": "sua-senha"
   }
   ```
3. Copie o token retornado (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
4. No campo "Value", cole: `Bearer {seu-token}`
5. Clique em "Authorize"

---

## 📋 Testes Recomendados por API

### 1. 🏛️ Control Tower API

#### Teste 1: Resumo Geral
- **Endpoint:** `GET /api/v1/control-tower/summary`
- **O que testa:** Retorna KPIs consolidados
- **Resultado esperado:** JSON com total_processes, active_processes, pending_approvals, etc.

#### Teste 2: Dashboard Completo
- **Endpoint:** `GET /api/v1/control-tower/dashboard`
- **O que testa:** Retorna dashboard completo com todos os dados
- **Resultado esperado:** JSON completo com summary, statuses, alerts, events, etc.

#### Teste 3: Lista de Processos
- **Endpoint:** `GET /api/v1/control-tower/processes/all`
- **Parâmetros opcionais:** `status`, `limit`
- **Resultado esperado:** Lista de processos (import + export)

---

### 2. 🇧🇷 Drawback API

#### Teste 1: Listar Atos
- **Endpoint:** `GET /api/v1/drawback/acts`
- **O que testa:** Lista todos os atos de drawback
- **Resultado esperado:** Array de atos (pode estar vazio inicialmente)

#### Teste 2: Criar Ato
- **Endpoint:** `POST /api/v1/drawback/acts`
- **Body:**
  ```json
  {
    "act_type": "exemption",
    "description": "Ato de drawback para isenção de impostos",
    "total_value": 50000.00,
    "currency": "BRL"
  }
  ```
- **Resultado esperado:** Ato criado com número gerado (ex: `DB-1-000001`)

#### Teste 3: Submeter Ato
- **Endpoint:** `POST /api/v1/drawback/acts/{act_id}/submit`
- **O que testa:** Submete ato para aprovação
- **Resultado esperado:** Status muda de `draft` para `submitted`

#### Teste 4: Aprovar Ato
- **Endpoint:** `POST /api/v1/drawback/acts/{act_id}/approve`
- **O que testa:** Aprova ato e gera crédito automaticamente
- **Resultado esperado:** Status `approved` + crédito gerado

#### Teste 5: Listar Créditos
- **Endpoint:** `GET /api/v1/drawback/credits`
- **Resultado esperado:** Lista de créditos gerados

---

### 3. 📦 Products API

#### Teste 1: Listar Produtos
- **Endpoint:** `GET /api/v1/products/`
- **Parâmetros opcionais:** `search`, `category`, `supplier_id`, `is_active`, `limit`, `offset`
- **Resultado esperado:** Lista de produtos

#### Teste 2: Criar Produto
- **Endpoint:** `POST /api/v1/products/`
- **Body:**
  ```json
  {
    "code": "PROD-001",
    "name": "Smartphone Android",
    "description": "Smartphone Android 128GB",
    "ncm": "8517.12.00",
    "origin_country": "China",
    "weight": 0.2,
    "unit": "kg",
    "category": "Eletrônicos",
    "unit_price": 1000.00,
    "currency": "USD"
  }
  ```
- **Resultado esperado:** Produto criado

#### Teste 3: Classificar Produto
- **Endpoint:** `POST /api/v1/products/{product_id}/classify`
- **O que testa:** Classificação automática de NCM
- **Resultado esperado:** NCM sugerido com confiança

---

### 4. 🏭 Warehouse API

#### Teste 1: Listar Armazéns
- **Endpoint:** `GET /api/v1/warehouses/`
- **Resultado esperado:** Lista de armazéns

#### Teste 2: Criar Armazém
- **Endpoint:** `POST /api/v1/warehouses/`
- **Body:**
  ```json
  {
    "code": "WH-001",
    "name": "Armazém Principal",
    "description": "Armazém central",
    "address": "Rua Exemplo, 123",
    "city": "São Paulo",
    "state": "SP",
    "country": "Brasil",
    "total_capacity": 10000.00
  }
  ```
- **Resultado esperado:** Armazém criado

#### Teste 3: Adicionar Item ao Inventário
- **Endpoint:** `POST /api/v1/warehouses/{warehouse_id}/inventory`
- **Body:**
  ```json
  {
    "product_id": 1,
    "quantity": 100.0,
    "unit": "kg",
    "location": "A-12-3"
  }
  ```
- **Resultado esperado:** Item adicionado ao inventário

#### Teste 4: Registrar Movimentação
- **Endpoint:** `POST /api/v1/warehouses/{warehouse_id}/movements`
- **Body:**
  ```json
  {
    "movement_type": "entry",
    "inventory_item_id": 1,
    "quantity": 50.0,
    "unit": "kg",
    "reference_number": "NF-001"
  }
  ```
- **Resultado esperado:** Movimentação registrada

---

### 5. 🤖 Classification API

#### Teste 1: Classificar Produto
- **Endpoint:** `POST /api/v1/classification/classify`
- **Body:**
  ```json
  {
    "product_name": "Smartphone",
    "description": "Smartphone Android 128GB",
    "origin_country": "China",
    "category": "Eletrônicos"
  }
  ```
- **Resultado esperado:** NCM sugerido com confiança e alternativas

#### Teste 2: Classificar Processo de Importação
- **Endpoint:** `POST /api/v1/classification/processes/import/{process_id}/classify`
- **Resultado esperado:** NCM aplicado ao processo

---

### 6. 🏛️ Advanced Customs API

#### Teste 1: Validar Documentos
- **Endpoint:** `POST /api/v1/customs/processes/{process_id}/validate`
- **Query:** `process_type=import` ou `process_type=export`
- **Resultado esperado:** Validação com lista de documentos faltando

#### Teste 2: Submeter para Desembaraço
- **Endpoint:** `POST /api/v1/customs/processes/{process_id}/submit`
- **Query:** `process_type=import`
- **Resultado esperado:** Processo submetido com DUIMP gerado

#### Teste 3: Ver Status
- **Endpoint:** `GET /api/v1/customs/processes/{process_id}/status`
- **Query:** `process_type=import`
- **Resultado esperado:** Status de desembaraço

---

## ✅ Checklist de Testes

- [ ] Control Tower - Summary
- [ ] Control Tower - Dashboard
- [ ] Drawback - Criar Ato
- [ ] Drawback - Submeter Ato
- [ ] Drawback - Aprovar Ato (gera crédito)
- [ ] Drawback - Listar Créditos
- [ ] Products - Criar Produto
- [ ] Products - Classificar Produto
- [ ] Warehouse - Criar Armazém
- [ ] Warehouse - Adicionar Item
- [ ] Warehouse - Registrar Movimentação
- [ ] Classification - Classificar Produto
- [ ] Customs - Validar Documentos
- [ ] Customs - Submeter para Desembaraço

---

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)
- **Causa:** Token inválido ou expirado
- **Solução:** Faça login novamente e atualize o token no Swagger

### Erro 404 (Not Found)
- **Causa:** ID inválido ou recurso não existe
- **Solução:** Verifique se o ID existe antes de usar

### Erro 422 (Validation Error)
- **Causa:** Dados inválidos no body
- **Solução:** Verifique o formato do JSON e campos obrigatórios

### Erro 500 (Internal Server Error)
- **Causa:** Erro no servidor
- **Solução:** Verifique os logs do backend

---

## 📊 Resultados Esperados

Após testar todas as APIs, você deve ter:

1. ✅ **Control Tower** funcionando com dados consolidados
2. ✅ **Drawback** com atos criados e créditos gerados
3. ✅ **Products** com produtos cadastrados e classificados
4. ✅ **Warehouse** com armazéns e inventário
5. ✅ **Classification** sugerindo NCMs
6. ✅ **Customs** validando e submetendo processos

---

## 🎯 Próximos Passos

1. Testar todas as APIs no Swagger
2. Verificar se os dados estão sendo salvos no banco
3. Testar o frontend conectado às APIs
4. Implementar componentes restantes (Products, Warehouse, etc.)
5. Adicionar tratamento de erros no frontend

---

**Boa sorte com os testes! 🚀**

