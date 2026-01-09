# 📧 CONFIGURAR EMAILJS - ENVIO DIRETO DO FRONTEND

## 🎯 O QUE É EMAILJS?

EmailJS é um serviço que permite **enviar emails diretamente do frontend** sem precisar de backend. É perfeito para formulários de contato e funciona mesmo em sites estáticos.

**Vantagens:**
- ✅ Funciona sem backend
- ✅ Gratuito até 200 emails/mês
- ✅ Fácil de configurar
- ✅ Funciona em produção
- ✅ Ideal para marketing e vendas trabalharem leads

---

## 📋 PASSO 1: Criar Conta no EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"** (cadastre-se)
3. Crie uma conta gratuita
4. Confirme seu email

---

## 📋 PASSO 2: Configurar Serviço de Email

### 2.1. Adicionar Serviço de Email

1. No dashboard do EmailJS, vá em **"Email Services"**
2. Clique em **"Add New Service"**
3. Selecione **"Gmail"**
4. Conecte sua conta Gmail (`dasfsociais@gmail.com`)
5. Autorize o acesso
6. **Anote o Service ID** (ex: `service_xxxxx`)

---

## 📋 PASSO 3: Criar Templates de Email

### 3.1. Template para Contato/Demonstração

1. Vá em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Nome: **"Contato Demonstração"**
4. Configurações:
   - **To Email:** `dasfsociais@gmail.com`
   - **From Name:** `{{from_name}}`
   - **Reply To:** `{{from_email}}`
   - **Subject:** `Nova Solicitação de Demonstração - {{company}}`

5. **Conteúdo do Email:**
```
Nova Solicitação de Demonstração

Nome: {{from_name}}
Email: {{from_email}}
Empresa: {{company}}
País: {{country}}
Telefone: {{phone}}
Mensagem: {{message}}

---
Enviado através do site Dasfabri
```

6. **Anote o Template ID** (ex: `template_xxxxx`)

### 3.2. Template para Solicitação de Acesso

1. Crie outro template: **"Solicitação de Acesso"**
2. Configurações:
   - **To Email:** `dasfsociais@gmail.com`
   - **From Name:** `{{from_name}}`
   - **Reply To:** `{{from_email}}`
   - **Subject:** `Nova Solicitação de Acesso - {{company}}`

3. **Conteúdo do Email:**
```
Nova Solicitação de Acesso ao Sistema

Nome: {{from_name}}
Email: {{from_email}}
Empresa: {{company}}
País: {{country}}
Telefone: {{phone}}
Cargo: {{position}}

---
Enviado através do site Dasfabri
```

4. **Anote o Template ID** (ex: `template_yyyyy`)

---

## 📋 PASSO 4: Obter Public Key

1. No dashboard do EmailJS, vá em **"Account"** → **"General"**
2. Copie a **"Public Key"** (ex: `xxxxxxxxxxxxx`)

---

## 📋 PASSO 5: Configurar no Frontend

### 5.1. Instalar EmailJS

```bash
cd apps/marketing-site/frontend
npm install @emailjs/browser
```

### 5.2. Criar arquivo `.env` no frontend

Crie o arquivo `apps/marketing-site/frontend/.env`:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_xxxxx
VITE_EMAILJS_TEMPLATE_ID_ACCESS=template_yyyyy
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
```

**Substitua:**
- `service_xxxxx` → Service ID que você anotou
- `template_xxxxx` → Template ID do contato
- `template_yyyyy` → Template ID do acesso
- `xxxxxxxxxxxxx` → Public Key

### 5.3. Fazer build

```bash
npm run build
```

---

## ✅ TESTAR

1. Preencha um formulário no site
2. Verifique a caixa de entrada de `dasfsociais@gmail.com`
3. Você deve receber o email imediatamente!

---

## 📊 COMO FUNCIONA AGORA

### Prioridade de Envio:

1. **EmailJS** (primeira tentativa)
   - Funciona sem backend
   - Email vai direto para `dasfsociais@gmail.com`
   - Ideal para marketing/vendas

2. **Backend** (fallback)
   - Se EmailJS não estiver configurado
   - Salva no banco e envia email

3. **LocalStorage** (backup)
   - Sempre salva os dados
   - Você pode recuperar depois

---

## 💰 PLANOS EMAILJS

- **Free:** 200 emails/mês
- **Starter:** $15/mês - 1.000 emails
- **Business:** $45/mês - 10.000 emails

Para começar, o plano gratuito é suficiente!

---

## 🔍 RECUPERAR LEADS DO LOCALSTORAGE

Se quiser ver os leads salvos no localStorage:

```javascript
// No console do navegador (F12):
JSON.parse(localStorage.getItem('contact_submissions'))
JSON.parse(localStorage.getItem('access_requests'))
```

---

## ✅ CHECKLIST

- [ ] Conta EmailJS criada
- [ ] Serviço Gmail configurado
- [ ] Template "Contato Demonstração" criado
- [ ] Template "Solicitação de Acesso" criado
- [ ] Public Key copiada
- [ ] Arquivo `.env` criado no frontend
- [ ] EmailJS instalado (`npm install @emailjs/browser`)
- [ ] Build feito
- [ ] Teste realizado
- [ ] Email recebido em `dasfsociais@gmail.com`

---

**Última atualização:** Janeiro 2025

