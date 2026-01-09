# ✅ PRÓXIMOS PASSOS - EMAILJS CONFIGURADO

## 🎉 PARABÉNS! Serviço Gmail criado com sucesso!

**Service ID:** `service_b356vgs` ✅

---

## 📋 AGORA VOCÊ PRECISA:

### 1️⃣ CRIAR TEMPLATE "CONTATO DEMONSTRAÇÃO"

1. No EmailJS, vá em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Configure:

   **Nome:** `Contato Demonstração`

   **To Email:** `dasfsociais@gmail.com`

   **From Name:** `{{from_name}}`

   **Reply To:** `{{from_email}}`

   **Subject:** `Nova Solicitação de Demonstração - {{company}}`

   **Conteúdo:**
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

4. Clique em **"Save"**
5. **ANOTE O TEMPLATE ID** (ex: `template_xxxxx`)

---

### 2️⃣ CRIAR TEMPLATE "SOLICITAÇÃO DE ACESSO"

1. Clique em **"Create New Template"** novamente
2. Configure:

   **Nome:** `Solicitação de Acesso`

   **To Email:** `dasfsociais@gmail.com`

   **From Name:** `{{from_name}}`

   **Reply To:** `{{from_email}}`

   **Subject:** `Nova Solicitação de Acesso - {{company}}`

   **Conteúdo:**
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

3. Clique em **"Save"**
4. **ANOTE O TEMPLATE ID** (ex: `template_yyyyy`)

---

### 3️⃣ OBTER PUBLIC KEY

1. No EmailJS, vá em **"Account"** → **"General"**
2. Procure por **"Public Key"**
3. **COPIE A PUBLIC KEY** (ex: `xxxxxxxxxxxxx`)

---

### 4️⃣ CRIAR ARQUIVO .env NO FRONTEND

Crie o arquivo: `apps/marketing-site/frontend/.env`

```env
VITE_EMAILJS_SERVICE_ID=service_b356vgs
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_xxxxx
VITE_EMAILJS_TEMPLATE_ID_ACCESS=template_yyyyy
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
```

**Substitua:**
- `template_xxxxx` → Template ID do "Contato Demonstração"
- `template_yyyyy` → Template ID do "Solicitação de Acesso"
- `xxxxxxxxxxxxx` → Public Key

---

### 5️⃣ REBUILD E UPLOAD

```bash
cd apps/marketing-site/frontend
npm run build
```

Depois, faça upload da pasta `dist/` para Hostgator.

---

## ✅ CHECKLIST

- [x] Serviço Gmail criado (`service_b356vgs`)
- [ ] Template "Contato Demonstração" criado
- [ ] Template "Solicitação de Acesso" criado
- [ ] Public Key copiada
- [ ] Arquivo `.env` criado no frontend
- [ ] Build feito (`npm run build`)
- [ ] Upload para Hostgator
- [ ] Teste realizado no site

---

## 🧪 TESTAR

Depois de fazer upload:

1. Acesse o site em produção
2. Preencha o formulário de demonstração
3. Verifique a caixa de entrada de `dasfsociais@gmail.com`
4. Você deve receber o email imediatamente! 🎉

---

**Última atualização:** Janeiro 2025

