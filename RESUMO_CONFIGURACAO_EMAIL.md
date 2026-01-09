# 📧 RESUMO: Configuração de Email para dasfsociais@gmail.com

## ✅ O QUE FOI IMPLEMENTADO

### 1. Serviço de Email (`app/core/email.py`)
- ✅ Função `send_email()` - Envio genérico via SMTP
- ✅ Função `send_contact_notification()` - Notifica sobre novos contatos
- ✅ Função `send_access_request_notification()` - Notifica sobre solicitações de acesso
- ✅ Emails formatados em HTML com informações completas

### 2. Integração nos Endpoints
- ✅ `/api/v1/public/contact` - Envia email quando há novo contato
- ✅ `/api/v1/public/access-request` - Envia email quando há nova solicitação

### 3. Email de Destino
- 📧 **dasfsociais@gmail.com** (configurável via `SMTP_TO_EMAIL`)

---

## ⚙️ CONFIGURAÇÃO NECESSÁRIA

### Passo 1: Criar App Password no Gmail

1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "Email" e "Outro (nome personalizado)"
3. Digite: "Dasfabri Backend"
4. **COPIE A SENHA GERADA** (16 caracteres)

### Passo 2: Criar arquivo `.env`

No diretório `apps/saas-platform/backend/`, crie um arquivo `.env`:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx
SMTP_FROM_EMAIL=seu-email@gmail.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

**Substitua:**
- `seu-email@gmail.com` → Seu email Gmail
- `xxxx-xxxx-xxxx-xxxx` → A App Password (sem espaços ou hífens)

### Passo 3: Reiniciar o Servidor

```bash
cd apps/saas-platform/backend
python -m uvicorn main:app --reload
```

---

## 📧 O QUE SERÁ ENVIADO

### Email de Contato/Demonstração
**Assunto:** 🎯 Nova Solicitação de Contato - [Nome da Empresa]

**Conteúdo:**
- Nome do contato
- Email do contato
- Nome da empresa
- Mensagem (se houver)

### Email de Solicitação de Acesso
**Assunto:** 🔐 Nova Solicitação de Acesso - [Nome da Empresa]

**Conteúdo:**
- Nome do solicitante
- Email do solicitante
- Nome da empresa
- Telefone (se fornecido)
- Cargo (se fornecido)

---

## 🧪 TESTE

Após configurar, teste preenchendo um formulário no site ou fazendo uma requisição:

```bash
curl -X POST http://localhost:8000/api/v1/public/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "company": "Empresa Teste",
    "message": "Mensagem de teste"
  }'
```

Verifique se o email chegou em **dasfsociais@gmail.com**.

---

## ⚠️ IMPORTANTE

- Se as variáveis de ambiente não estiverem configuradas, o sistema **não falhará**, apenas não enviará emails
- Os logs mostrarão avisos se o SMTP não estiver configurado
- Emails são enviados de forma assíncrona (não bloqueiam a resposta da API)

---

**Documentação completa:** Veja `CONFIGURAR_EMAIL.md` para mais detalhes.

