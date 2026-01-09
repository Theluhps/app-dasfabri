# 📝 ADICIONAR TEMPLATE IDs NO .env

## ✅ O QUE JÁ ESTÁ CONFIGURADO

- ✅ Service ID: `service_b356vgs`
- ✅ Public Key: `EigDHTvAsFSxLIw3A`
- ✅ Arquivo `.env` criado

---

## 📋 O QUE FALTA

Você precisa criar os 2 templates no EmailJS e depois adicionar os Template IDs no arquivo `.env`.

---

## 🎯 PASSO 1: CRIAR TEMPLATES NO EMAILJS

### Template 1: "Contato Demonstração"

1. EmailJS → **"Email Templates"** → **"Create New Template"**
2. Configure:
   - **Nome:** `Contato Demonstração`
   - **To Email:** `dasfsociais@gmail.com`
   - **From Name:** `{{from_name}}`
   - **Reply To:** `{{from_email}}`
   - **Subject:** `Nova Solicitação de Demonstração - {{company}}`
   - **Conteúdo:**
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
3. Clique em **"Save"**
4. **COPIE O TEMPLATE ID** (ex: `template_abc123`)

### Template 2: "Solicitação de Acesso"

1. **"Create New Template"** novamente
2. Configure:
   - **Nome:** `Solicitação de Acesso`
   - **To Email:** `dasfsociais@gmail.com`
   - **From Name:** `{{from_name}}`
   - **Reply To:** `{{from_email}}`
   - **Subject:** `Nova Solicitação de Acesso - {{company}}`
   - **Conteúdo:**
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
4. **COPIE O TEMPLATE ID** (ex: `template_xyz789`)

---

## 🎯 PASSO 2: ATUALIZAR ARQUIVO .env

Abra o arquivo: `apps/marketing-site/frontend/.env`

Substitua:
- `template_xxxxx` → Template ID do "Contato Demonstração"
- `template_yyyyy` → Template ID do "Solicitação de Acesso"

**Exemplo:**
```env
VITE_EMAILJS_SERVICE_ID=service_b356vgs
VITE_EMAILJS_PUBLIC_KEY=EigDHTvAsFSxLIw3A
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_abc123
VITE_EMAILJS_TEMPLATE_ID_ACCESS=template_xyz789
```

---

## ✅ DEPOIS DE ATUALIZAR

1. Fazer rebuild:
   ```bash
   cd apps/marketing-site/frontend
   npm run build
   ```

2. Upload da pasta `dist/` para Hostgator

3. Testar o formulário no site!

---

**Última atualização:** Janeiro 2025

