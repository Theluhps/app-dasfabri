# 📧 RESUMO: CONFIGURAÇÃO EMAILJS

## ✅ O QUE JÁ ESTÁ PRONTO

- ✅ EmailJS instalado (`@emailjs/browser`)
- ✅ Serviço de email criado (`emailService.ts`)
- ✅ Formulários atualizados (CTAForm e Register)
- ✅ Build concluído com sucesso
- ✅ Sistema de fallback implementado

---

## 🎯 O QUE FALTA FAZER

### 1. Configurar EmailJS (5-10 minutos)

#### Passo 1: Criar Conta
1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"**
3. Crie conta gratuita
4. Confirme email

#### Passo 2: Conectar Gmail
1. Dashboard → **"Email Services"**
2. **"Add New Service"** → **"Gmail"**
3. Conecte `dasfsociais@gmail.com`
4. **Anote o Service ID** (ex: `service_xxxxx`)

#### Passo 3: Criar Template "Contato"
1. **"Email Templates"** → **"Create New Template"**
2. Nome: `Contato Demonstração`
3. Configurações:
   - **To Email:** `dasfsociais@gmail.com`
   - **From Name:** `{{from_name}}`
   - **Reply To:** `{{from_email}}`
   - **Subject:** `Nova Solicitação de Demonstração - {{company}}`
4. Conteúdo:
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
5. **Anote o Template ID** (ex: `template_xxxxx`)

#### Passo 4: Criar Template "Acesso"
1. **"Create New Template"**
2. Nome: `Solicitação de Acesso`
3. Configurações:
   - **To Email:** `dasfsociais@gmail.com`
   - **From Name:** `{{from_name}}`
   - **Reply To:** `{{from_email}}`
   - **Subject:** `Nova Solicitação de Acesso - {{company}}`
4. Conteúdo:
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
5. **Anote o Template ID** (ex: `template_yyyyy`)

#### Passo 5: Obter Public Key
1. **"Account"** → **"General"**
2. Copie a **"Public Key"** (ex: `xxxxxxxxxxxxx`)

---

### 2. Criar Arquivo .env

Crie o arquivo: `apps/marketing-site/frontend/.env`

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_xxxxx
VITE_EMAILJS_TEMPLATE_ID_ACCESS=template_yyyyy
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
```

**Substitua:**
- `service_xxxxx` → Service ID do Passo 2
- `template_xxxxx` → Template ID do Passo 3
- `template_yyyyy` → Template ID do Passo 4
- `xxxxxxxxxxxxx` → Public Key do Passo 5

---

### 3. Rebuild e Upload

```bash
cd apps/marketing-site/frontend
npm run build
```

Depois, faça upload da pasta `dist/` para Hostgator.

---

## 🧪 TESTAR

1. Acesse o site em produção
2. Preencha o formulário de demonstração
3. Verifique a caixa de entrada de `dasfsociais@gmail.com`
4. Você deve receber o email imediatamente!

---

## 💡 COMO FUNCIONA

### Prioridade de Envio:

1. **EmailJS** (primeira tentativa)
   - ✅ Funciona sem backend
   - ✅ Email direto para `dasfsociais@gmail.com`
   - ✅ Ideal para marketing/vendas

2. **Backend** (fallback)
   - Se EmailJS não estiver configurado
   - Salva no banco e envia email

3. **LocalStorage** (backup)
   - Sempre salva os dados
   - Você pode recuperar depois

---

## 📊 RECUPERAR LEADS

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
- [ ] Build feito (`npm run build`)
- [ ] Upload para Hostgator
- [ ] Teste realizado
- [ ] Email recebido em `dasfsociais@gmail.com`

---

**Última atualização:** Janeiro 2025

