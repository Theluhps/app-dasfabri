# 🧪 GUIA DE TESTE RÁPIDO - Dasfabri API

## ✅ Status do Servidor

- **URL Base:** `http://localhost:8000`
- **Swagger UI:** `http://localhost:8000/docs`
- **Health Check:** `http://localhost:8000/health`

## 🔐 Autenticação

### 1. Login via Swagger UI

1. Acesse: `http://localhost:8000/docs`
2. Encontre o endpoint: `POST /api/v1/auth/login`
3. Clique em "Try it out"
4. Use **form-data** (não JSON):
   - `username`: email do usuário
   - `password`: senha do usuário
5. Execute e copie o `access_token`

### 2. Usar Token nos Endpoints

1. No Swagger UI, clique no botão **"Authorize"** (cadeado no topo)
2. Cole o token no campo "Value"
3. Clique em "Authorize"
4. Agora todos os endpoints usarão o token automaticamente

### 3. Login via cURL (para testes)

```bash
# Login (form-data)
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=seu@email.com&password=suasenha"

# Usar token em requisições
TOKEN="seu_token_aqui"
curl -X GET "http://localhost:8000/api/v1/dashboard/predictive-kpis" \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Endpoints para Testar

### Dashboard API

1. **KPIs Preditivos**
   - `GET /api/v1/dashboard/predictive-kpis`
   - Retorna KPIs com previsões

2. **Alertas Proativos**
   - `GET /api/v1/dashboard/proactive-alerts`
   - Retorna alertas que requerem atenção

3. **Dados de Performance**
   - `GET /api/v1/dashboard/performance-data?period=month`
   - Retorna dados de performance

### Tracking API

1. **Status de Rastreamento**
   - `GET /api/v1/tracking/{shipment_id}`
   - Exemplo: `GET /api/v1/tracking/1`

2. **Eventos de Rastreamento**
   - `GET /api/v1/tracking/{shipment_id}/events`
   - Retorna histórico de eventos

3. **Atualizar Rastreamento**
   - `POST /api/v1/tracking/{shipment_id}/refresh`
   - Força atualização de dados

### Compliance API

1. **Verificações de Compliance**
   - `GET /api/v1/compliance/{process_id}/checks`
   - Exemplo: `GET /api/v1/compliance/1/checks`

2. **Resumo de Compliance**
   - `GET /api/v1/compliance/{process_id}/summary`
   - Retorna taxa de compliance

3. **Executar Verificação**
   - `POST /api/v1/compliance/{process_id}/run`
   - Executa verificações automáticas

4. **Exportar Relatório**
   - `GET /api/v1/compliance/{process_id}/report`
   - Retorna PDF do relatório

### Comments API

1. **Listar Comentários**
   - `GET /api/v1/comments/processes/{process_id}/comments`
   - Exemplo: `GET /api/v1/comments/processes/1/comments`

2. **Criar Comentário**
   - `POST /api/v1/comments/processes/{process_id}/comments`
   - Body: `{"text": "Meu comentário", "mentions": [1, 2]}`

3. **Responder Comentário**
   - `POST /api/v1/comments/comments/{comment_id}/reply`
   - Body: `{"text": "Minha resposta"}`

4. **Sugestões de @mention**
   - `GET /api/v1/comments/users/mention-suggestions?q=nome`
   - Retorna usuários para mencionar

## 🎨 Testando Frontend

### 1. Iniciar Frontend

```bash
cd apps/marketing-site/frontend
npm install  # se necessário
npm run dev
```

### 2. Acessar Sistema

- URL: `http://localhost:5173` (ou porta configurada)
- Login: Use credenciais ou modo demo

### 3. Módulos Integrados

1. **Dashboard Inteligente**
   - Acesse: Dashboard → Aba "Inteligente"
   - Deve carregar KPIs e alertas do backend

2. **Rastreamento em Tempo Real**
   - Acesse: Import → Processo → Aba "Rastreamento"
   - Deve mostrar eventos de rastreamento

3. **Compliance Checker**
   - Acesse: Import → Processo → Aba "Compliance"
   - Deve mostrar verificações de compliance

4. **Comentários e Colaboração**
   - Acesse: Import → Processo → Aba "Comentários"
   - Deve permitir criar comentários e respostas

## 🐛 Troubleshooting

### Erro 401 (Não Autenticado)

- Verifique se fez login e obteve o token
- Verifique se o token está sendo enviado no header `Authorization: Bearer {token}`
- No Swagger, use o botão "Authorize"

### Erro 404 (Não Encontrado)

- Verifique se o ID do recurso existe
- Verifique se a rota está correta
- Consulte `/docs` para ver rotas disponíveis

### Erro 500 (Erro do Servidor)

- Verifique os logs do servidor
- Verifique se o banco de dados está acessível
- Verifique se todas as dependências estão instaladas

### Frontend não conecta ao Backend

- Verifique se o backend está rodando em `http://localhost:8000`
- Verifique a variável `VITE_API_URL` no frontend
- Verifique CORS no backend

## 📝 Checklist de Testes

- [ ] Servidor backend rodando
- [ ] Swagger UI acessível
- [ ] Login funcionando
- [ ] Token sendo aceito
- [ ] Dashboard API retornando dados
- [ ] Tracking API funcionando
- [ ] Compliance API funcionando
- [ ] Comments API funcionando
- [ ] Frontend conectando ao backend
- [ ] Componentes carregando dados

## 🚀 Próximos Passos

1. Criar usuário de teste no banco
2. Testar todos os endpoints no Swagger
3. Testar integração frontend-backend
4. Verificar erros e corrigir
5. Implementar testes automatizados

