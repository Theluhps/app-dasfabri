# 📧 CONFIGURAÇÃO DE EMAIL - GUIA COMPLETO

## 🎯 Objetivo

Configurar o envio automático de emails para **dasfsociais@gmail.com** quando houver:
- Nova solicitação de contato/demonstração
- Nova solicitação de acesso ao sistema

---

## 📋 PASSO 1: Configurar Gmail (App Password)

Para usar Gmail como servidor SMTP, você precisa criar uma **App Password** (senha de aplicativo).

### 1.1. Ativar verificação em duas etapas
1. Acesse: https://myaccount.google.com/security
2. Ative a "Verificação em duas etapas" se ainda não estiver ativada

### 1.2. Criar App Password
1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "Aplicativo": **Email**
3. Selecione "Dispositivo": **Outro (nome personalizado)**
4. Digite: **Dasfabri Backend**
5. Clique em **Gerar**
6. **COPIE A SENHA GERADA** (16 caracteres, sem espaços)

---

## 📋 PASSO 2: Configurar Variáveis de Ambiente

### 2.1. Criar arquivo `.env`

No diretório `apps/saas-platform/backend/`, crie um arquivo `.env`:

```bash
cd apps/saas-platform/backend
touch .env
```

### 2.2. Adicionar configurações

Abra o arquivo `.env` e adicione:

```env
# Configurações de Email (SMTP)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_FROM_EMAIL=seu-email@gmail.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

**Substitua:**
- `seu-email@gmail.com` → Seu email Gmail
- `xxxx xxxx xxxx xxxx` → A App Password gerada (sem espaços)

**Exemplo:**
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@dasfabri.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM_EMAIL=contato@dasfabri.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

---

## 📋 PASSO 3: Testar Configuração

### 3.1. Reiniciar o servidor backend

```bash
cd apps/saas-platform/backend
python -m uvicorn main:app --reload
```

### 3.2. Testar envio de email

Preencha um formulário no site ou faça uma requisição de teste:

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

### 3.3. Verificar email

Verifique se o email chegou em **dasfsociais@gmail.com**.

---

## 🔧 ALTERNATIVAS: Outros Serviços de Email

### Opção 1: SendGrid
```env
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=sua-api-key-sendgrid
SMTP_FROM_EMAIL=noreply@dasfabri.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

### Opção 2: Mailgun
```env
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@seu-dominio.mailgun.org
SMTP_PASSWORD=sua-senha-mailgun
SMTP_FROM_EMAIL=noreply@dasfabri.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

### Opção 3: Amazon SES
```env
SMTP_SERVER=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=sua-access-key
SMTP_PASSWORD=sua-secret-key
SMTP_FROM_EMAIL=noreply@dasfabri.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

---

## ⚠️ TROUBLESHOOTING

### Erro: "SMTP Authentication failed"
- Verifique se a App Password está correta
- Certifique-se de que a verificação em duas etapas está ativada
- Remova espaços da App Password

### Erro: "Connection refused"
- Verifique se o SMTP_SERVER e SMTP_PORT estão corretos
- Alguns provedores bloqueiam conexões SMTP (verifique firewall)

### Email não chega
- Verifique a pasta de spam
- Verifique os logs do servidor: `tail -f logs/app.log`
- Teste com outro email primeiro

### Email não é enviado (mas não há erro)
- Verifique se as variáveis de ambiente estão sendo carregadas
- Adicione logs: `logger.info(f"SMTP_USER: {SMTP_USER}")` (sem mostrar a senha)

---

## 📊 LOGS

Os logs de envio de email aparecem no console do servidor:

```
INFO: Email enviado com sucesso para dasfsociais@gmail.com
```

Ou em caso de erro:

```
ERROR: Erro ao enviar email para dasfsociais@gmail.com: [detalhes do erro]
```

---

## ✅ CHECKLIST

- [ ] Verificação em duas etapas ativada no Gmail
- [ ] App Password criada e copiada
- [ ] Arquivo `.env` criado
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor reiniciado
- [ ] Teste de envio realizado
- [ ] Email recebido em dasfsociais@gmail.com

---

**Última atualização:** Janeiro 2025

