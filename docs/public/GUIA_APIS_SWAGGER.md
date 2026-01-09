# 📚 GUIA COMPLETO DAS APIs - SWAGGER

## 🎯 Como Acessar o Swagger

1. Inicie o servidor backend:
   ```bash
   cd apps/saas-platform/backend
   uvicorn main:app --reload
   ```

2. Acesse o Swagger UI:
   ```
   http://localhost:8000/docs
   ```

3. Ou a documentação alternativa (ReDoc):
   ```
   http://localhost:8000/redoc
   ```

---

## 📋 APIS IMPLEMENTADAS

### 1. 🏛️ **Control Tower API** (`/api/v1/control-tower`)

**O que faz:** Dashboard unificado mostrando toda a supply chain em uma única visão.

#### Endpoints:

##### `GET /api/v1/control-tower/summary`
**O que faz:** Retorna um resumo geral do Control Tower com métricas consolidadas.

**Resposta:**
```json
{
  "total_processes": 150,
  "active_processes": 45,
  "pending_approvals": 12,
  "critical_alerts": 3,
  "compliance_rate": 95.5,
  "on_time_delivery_rate": 95.0,
  "total_value": 0.0,
  "currency": "USD"
}
```

**Uso:** Use para obter KPIs gerais da empresa em tempo real.

---

##### `GET /api/v1/control-tower/dashboard`
**O que faz:** Retorna o dashboard completo com todos os dados agregados.

**Resposta inclui:**
- Resumo geral (summary)
- Status de importações (import_statuses)
- Status de exportações (export_statuses)
- Alertas críticos (critical_alerts)
- Eventos recentes (recent_events)
- Overview de compliance (compliance_overview)
- Resumo financeiro (financial_summary)
- Resumo logístico (logistics_summary)

**Uso:** Use para popular o dashboard principal do Control Tower no frontend.

---

##### `GET /api/v1/control-tower/processes/all`
**O que faz:** Lista todos os processos (importação + exportação) em uma única lista.

**Parâmetros:**
- `status` (opcional): Filtrar por status
- `limit` (opcional): Limite de resultados (padrão: 50, máximo: 100)

**Uso:** Use para exibir uma lista unificada de todos os processos.

---

### 2. 🇧🇷 **Drawback API** (`/api/v1/drawback`)

**O que faz:** Gestão completa de Drawback (regime especial brasileiro de isenção/restituição de impostos).

#### Endpoints:

##### `GET /api/v1/drawback/acts`
**O que faz:** Lista todos os atos de drawback da empresa.

**Parâmetros:**
- `status` (opcional): Filtrar por status (draft, submitted, approved, rejected, cancelled)
- `act_type` (opcional): Filtrar por tipo (suspension, exemption, refund)

**Resposta:** Lista de atos de drawback com informações completas.

**Uso:** Use para exibir a lista de atos de drawback no módulo.

---

##### `POST /api/v1/drawback/acts`
**O que faz:** Cria um novo ato de drawback.

**Body:**
```json
{
  "act_type": "exemption",
  "description": "Ato de drawback para isenção de impostos",
  "total_value": 50000.00,
  "currency": "BRL",
  "import_process_id": 123,
  "expiration_date": "2025-12-31T00:00:00",
  "notes": "Observações adicionais"
}
```

**Resposta:** Ato criado com número gerado automaticamente (ex: `DB-1-000001`).

**Uso:** Use no formulário de criação de novo ato de drawback.

---

##### `GET /api/v1/drawback/acts/{act_id}`
**O que faz:** Obtém detalhes de um ato de drawback específico.

**Uso:** Use para exibir os detalhes de um ato na tela de visualização.

---

##### `PATCH /api/v1/drawback/acts/{act_id}`
**O que faz:** Atualiza um ato de drawback existente.

**Body (campos opcionais):**
```json
{
  "description": "Nova descrição",
  "total_value": 60000.00,
  "status": "submitted",
  "notes": "Atualizado"
}
```

**Uso:** Use para editar atos em rascunho.

---

##### `POST /api/v1/drawback/acts/{act_id}/submit`
**O que faz:** Submete um ato de drawback para aprovação (muda status de `draft` para `submitted`).

**Uso:** Use no botão "Submeter" do formulário de ato.

---

##### `POST /api/v1/drawback/acts/{act_id}/approve`
**O que faz:** Aprova um ato de drawback e gera automaticamente um crédito de drawback.

**Resposta:**
```json
{
  "message": "Ato aprovado e crédito gerado com sucesso",
  "act_id": 123,
  "credit_id": 456,
  "credit_number": "DC-1-000001"
}
```

**Uso:** Use no botão "Aprovar" do workflow de aprovação.

---

##### `GET /api/v1/drawback/credits`
**O que faz:** Lista todos os créditos de drawback da empresa.

**Parâmetros:**
- `is_active` (opcional): Filtrar apenas créditos ativos

**Uso:** Use para exibir a lista de créditos disponíveis.

---

##### `GET /api/v1/drawback/credits/{credit_id}`
**O que faz:** Obtém detalhes de um crédito específico.

**Uso:** Use para exibir detalhes de um crédito, incluindo valor disponível e usado.

---

### 3. 📦 **Products API** (`/api/v1/products`)

**O que faz:** Catálogo centralizado de produtos com classificação automática.

#### Endpoints:

##### `GET /api/v1/products/`
**O que faz:** Lista produtos do catálogo com filtros e paginação.

**Parâmetros:**
- `search` (opcional): Buscar por nome, código ou descrição
- `category` (opcional): Filtrar por categoria
- `supplier_id` (opcional): Filtrar por fornecedor
- `is_active` (opcional): Filtrar apenas produtos ativos
- `limit` (padrão: 50, máximo: 100)
- `offset` (padrão: 0)

**Uso:** Use para exibir a lista de produtos no catálogo.

---

##### `POST /api/v1/products/`
**O que faz:** Cria um novo produto no catálogo.

**Body:**
```json
{
  "code": "PROD-001",
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "ncm": "9999.99.99",
  "origin_country": "China",
  "weight": 10.5,
  "unit": "kg",
  "category": "Eletrônicos",
  "unit_price": 100.00,
  "currency": "USD",
  "supplier_id": 1
}
```

**Uso:** Use no formulário de cadastro de novo produto.

---

##### `GET /api/v1/products/{product_id}`
**O que faz:** Obtém detalhes completos de um produto.

**Resposta inclui:** Histórico de importações/exportações, classificação NCM, etc.

**Uso:** Use para exibir detalhes do produto na tela de visualização.

---

##### `PATCH /api/v1/products/{product_id}`
**O que faz:** Atualiza informações de um produto.

**Uso:** Use no formulário de edição de produto.

---

##### `DELETE /api/v1/products/{product_id}`
**O que faz:** Desativa um produto (soft delete - não remove, apenas marca como inativo).

**Uso:** Use no botão "Desativar" do produto.

---

##### `POST /api/v1/products/{product_id}/classify`
**O que faz:** Classifica automaticamente o produto (sugere NCM usando IA/ML).

**Resposta:**
```json
{
  "message": "Produto classificado com sucesso",
  "ncm": "9999.99.99",
  "confidence": 85.5
}
```

**Uso:** Use no botão "Classificar Automaticamente" do produto.

---

##### `GET /api/v1/products/categories/`
**O que faz:** Lista todas as categorias de produtos.

**Uso:** Use para popular dropdown de categorias.

---

##### `POST /api/v1/products/categories/`
**O que faz:** Cria uma nova categoria de produtos.

**Uso:** Use no formulário de criação de categoria.

---

### 4. 🏭 **Warehouse API** (`/api/v1/warehouses`)

**O que faz:** Gestão completa de armazéns, inventário e movimentações de estoque.

#### Endpoints:

##### `GET /api/v1/warehouses/`
**O que faz:** Lista todos os armazéns da empresa.

**Parâmetros:**
- `status` (opcional): Filtrar por status (active, inactive, maintenance)

**Uso:** Use para exibir a lista de armazéns.

---

##### `POST /api/v1/warehouses/`
**O que faz:** Cria um novo armazém.

**Body:**
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

**Uso:** Use no formulário de cadastro de armazém.

---

##### `GET /api/v1/warehouses/{warehouse_id}`
**O que faz:** Obtém detalhes de um armazém específico.

**Uso:** Use para exibir informações do armazém.

---

##### `GET /api/v1/warehouses/{warehouse_id}/inventory`
**O que faz:** Lista todos os itens do inventário de um armazém.

**Uso:** Use para exibir o estoque do armazém.

---

##### `POST /api/v1/warehouses/{warehouse_id}/inventory`
**O que faz:** Adiciona um item ao inventário do armazém.

**Body:**
```json
{
  "product_id": 1,
  "import_process_id": 123,
  "quantity": 100.0,
  "unit": "kg",
  "location": "A-12-3",
  "batch_number": "BATCH-001"
}
```

**Uso:** Use quando uma mercadoria chega ao armazém.

---

##### `POST /api/v1/warehouses/{warehouse_id}/movements`
**O que faz:** Registra uma movimentação de estoque (entrada, saída, transferência, ajuste).

**Body:**
```json
{
  "movement_type": "entry",
  "inventory_item_id": 1,
  "quantity": 50.0,
  "unit": "kg",
  "reference_number": "NF-001",
  "notes": "Entrada de mercadoria"
}
```

**Tipos de movimentação:**
- `entry`: Entrada
- `exit`: Saída
- `transfer`: Transferência
- `adjustment`: Ajuste
- `loss`: Perda

**Uso:** Use para registrar qualquer movimentação de estoque.

---

##### `GET /api/v1/warehouses/{warehouse_id}/movements`
**O que faz:** Lista todas as movimentações de um armazém.

**Parâmetros:**
- `movement_type` (opcional): Filtrar por tipo
- `limit` (padrão: 50)

**Uso:** Use para exibir o histórico de movimentações.

---

### 5. 🤖 **Classification API** (`/api/v1/classification`)

**O que faz:** Classificação automática de produtos usando IA/ML para determinar NCM.

#### Endpoints:

##### `POST /api/v1/classification/classify`
**O que faz:** Classifica um produto baseado em suas características.

**Body:**
```json
{
  "product_name": "Smartphone",
  "description": "Smartphone Android 128GB",
  "origin_country": "China",
  "weight": 0.2,
  "unit": "kg",
  "category": "Eletrônicos"
}
```

**Resposta:**
```json
{
  "ncm": "8517.12.00",
  "description": "NCM sugerido para Smartphone",
  "confidence": 85.5,
  "alternatives": [
    {
      "ncm": "8517.11.00",
      "description": "Alternativa 1",
      "confidence": 75.0
    }
  ]
}
```

**Uso:** Use para classificar produtos automaticamente ao cadastrar.

---

##### `POST /api/v1/classification/products/{product_id}/classify`
**O que faz:** Classifica um produto existente no catálogo.

**Uso:** Use no botão "Classificar" da tela de produto.

---

##### `POST /api/v1/classification/processes/import/{process_id}/classify`
**O que faz:** Classifica um processo de importação.

**Uso:** Use para aplicar NCM automaticamente em processos de importação.

---

##### `POST /api/v1/classification/processes/export/{process_id}/classify`
**O que faz:** Classifica um processo de exportação.

**Uso:** Use para aplicar NCM automaticamente em processos de exportação.

---

##### `GET /api/v1/classification/ncm/{ncm_code}/info`
**O que faz:** Obtém informações sobre um código NCM (alíquotas, restrições, etc).

**Resposta:**
```json
{
  "ncm": "9999.99.99",
  "description": "Descrição do NCM",
  "tax_rate": 18.0,
  "requires_license": false,
  "restrictions": []
}
```

**Uso:** Use para exibir informações detalhadas sobre um NCM.

---

### 6. 🏛️ **Advanced Customs API** (`/api/v1/customs`)

**O que faz:** Módulo avançado de alfândega com integração Siscomex e validações automáticas.

#### Endpoints:

##### `GET /api/v1/customs/processes/{process_id}/status`
**O que faz:** Obtém o status de desembaraço aduaneiro de um processo.

**Parâmetros:**
- `process_type`: "import" ou "export" (obrigatório)

**Resposta:**
```json
{
  "process_id": 123,
  "process_type": "import",
  "duimp_number": "DUIMP-00000123",
  "status": "in_analysis",
  "customs_broker": "Despachante ABC",
  "submitted_at": "2025-01-01T00:00:00",
  "cleared_at": null,
  "issues": []
}
```

**Status possíveis:**
- `pending`: Pendente
- `in_analysis`: Em análise
- `approved`: Aprovado
- `rejected`: Rejeitado

**Uso:** Use para exibir o status de desembaraço na tela de processo.

---

##### `POST /api/v1/customs/processes/{process_id}/validate`
**O que faz:** Valida se um processo tem todos os documentos necessários para desembaraço.

**Parâmetros:**
- `process_type`: "import" ou "export" (obrigatório)

**Resposta:**
```json
{
  "is_valid": false,
  "errors": ["Documento X faltando"],
  "warnings": ["Documento Y com data próxima do vencimento"],
  "required_documents": ["Invoice", "Bill of Lading", "Packing List"],
  "missing_documents": ["Bill of Lading"]
}
```

**Uso:** Use antes de submeter para desembaraço, para verificar se está tudo ok.

---

##### `POST /api/v1/customs/processes/{process_id}/submit`
**O que faz:** Submete um processo para desembaraço aduaneiro.

**Parâmetros:**
- `process_type`: "import" ou "export" (obrigatório)

**Validações:**
- Verifica se todos os documentos obrigatórios estão presentes
- Verifica se não há erros de compliance

**Resposta:**
```json
{
  "message": "Processo submetido para desembaraço com sucesso",
  "duimp_number": "DUIMP-00000123",
  "process_id": 123
}
```

**Uso:** Use no botão "Submeter para Desembaraço" do processo.

---

##### `GET /api/v1/customs/siscomex/{duimp_number}`
**O que faz:** Consulta o status de uma DUIMP no Siscomex.

**Resposta:**
```json
{
  "duimp_number": "DUIMP-00000123",
  "status": "Em análise",
  "last_update": "2025-01-03T18:00:00",
  "details": {
    "numero_duimp": "DUIMP-00000123",
    "situacao": "Em análise",
    "data_entrada": "2025-01-01T00:00:00",
    "despachante": "Nome do Despachante"
  }
}
```

**Uso:** Use para sincronizar status com o Siscomex.

---

##### `POST /api/v1/customs/siscomex/sync`
**O que faz:** Sincroniza o status de um processo com o Siscomex.

**Parâmetros:**
- `process_id`: ID do processo
- `process_type`: "import" ou "export" (obrigatório)

**Uso:** Use no botão "Sincronizar com Siscomex".

---

## 🔐 Autenticação

**Todas as APIs requerem autenticação!**

No Swagger:
1. Clique no botão **"Authorize"** no topo
2. Use o endpoint `/api/v1/auth/login` para obter o token
3. Cole o token no campo "Value" (formato: `Bearer {token}`)
4. Clique em "Authorize"

---

## 📊 Fluxo de Uso Recomendado

### 1. Control Tower
```
GET /control-tower/dashboard → Exibir dashboard principal
```

### 2. Drawback
```
POST /drawback/acts → Criar ato
POST /drawback/acts/{id}/submit → Submeter
POST /drawback/acts/{id}/approve → Aprovar (gera crédito)
GET /drawback/credits → Ver créditos gerados
```

### 3. Produtos
```
POST /products/ → Cadastrar produto
POST /products/{id}/classify → Classificar automaticamente
GET /products/ → Listar produtos
```

### 4. Warehouse
```
POST /warehouses/ → Criar armazém
POST /warehouses/{id}/inventory → Adicionar item
POST /warehouses/{id}/movements → Registrar movimentação
```

### 5. Classificação
```
POST /classification/classify → Classificar produto
POST /classification/processes/import/{id}/classify → Classificar processo
```

### 6. Alfândega
```
POST /customs/processes/{id}/validate → Validar documentos
POST /customs/processes/{id}/submit → Submeter para desembaraço
GET /customs/processes/{id}/status → Ver status
```

---

## 🎯 Próximos Passos

1. **Testar no Swagger:** Acesse `/docs` e teste cada endpoint
2. **Criar Frontend:** Implementar componentes React para cada módulo
3. **Integrar:** Conectar frontend com essas APIs
4. **Melhorar:** Adicionar validações, tratamento de erros, etc.

---

**Todas as APIs estão prontas e documentadas! 🚀**

