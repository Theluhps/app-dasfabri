# 🌐 Configurar Domínio app.dasfabri.com.br

## 🎯 Objetivo

Fazer com que quando a pessoa acessar o sistema, apareça `app.dasfabri.com.br` na barra do navegador.

---

## 📋 O QUE PRECISA SER CONFIGURADO

### 1. **Backend (Render)** → `app.dasfabri.com.br/api`
### 2. **Frontend (Hostgator)** → `app.dasfabri.com.br`

---

## 🚀 PASSO A PASSO COMPLETO

### PARTE 1: CONFIGURAR DOMÍNIO NO RENDER (Backend)

#### Passo 1.1: Adicionar Domínio Customizado no Render

1. Acesse: https://dashboard.render.com
2. Faça login
3. Vá no seu **Web Service** (backend da plataforma)
4. Clique em **"Settings"** (menu lateral)
5. Role até **"Custom Domains"**
6. Clique em **"Add Custom Domain"**
7. Digite: `app.dasfabri.com.br`
8. Clique em **"Save"**

#### Passo 1.2: Render Vai Mostrar Instruções de DNS

O Render vai mostrar algo como:
```
Tipo: CNAME
Nome: app
Valor: dasfabri-api-xxxxx.onrender.com
```

**⚠️ ANOTE ESSAS INFORMAÇÕES!** Você vai precisar delas no próximo passo.

---

### PARTE 2: CONFIGURAR DNS NO REGISTRO.BR

#### Passo 2.1: Acessar o Registro.br

1. Acesse: https://registro.br
2. Faça login com sua conta
3. Vá em **"Meus Domínios"**
4. Clique no domínio: `dasfabri.com.br`
5. Clique em **"DNS"** ou **"Zona DNS"**

#### Passo 2.2: Adicionar Registro CNAME

1. Clique em **"Adicionar Registro"** ou **"Novo Registro"**
2. Selecione tipo: **CNAME**
3. Preencha:
   - **Nome/Host:** `app`
   - **Valor/Destino:** O valor que o Render mostrou (ex: `dasfabri-api-xxxxx.onrender.com`)
   - **TTL:** `3600` (ou deixe padrão)
4. Clique em **"Salvar"** ou **"Adicionar"**

#### Passo 2.3: Aguardar Propagação DNS

- ⏱️ **Tempo:** 1-24 horas (geralmente 1-2 horas)
- 🔍 **Verificar:** Use https://dnschecker.org
- Digite: `app.dasfabri.com.br`
- Deve mostrar o CNAME apontando para o Render

---

### PARTE 3: CONFIGURAR DOMÍNIO NO HOSTGATOR (Frontend)

#### Passo 3.1: Adicionar Subdomínio no Hostgator

1. Acesse o **cPanel** do Hostgator
2. Vá em **"Subdomínios"** ou **"Subdomains"**
3. Clique em **"Criar Subdomínio"** ou **"Create Subdomain"**
4. Preencha:
   - **Subdomínio:** `app`
   - **Domínio:** `dasfabri.com.br`
   - **Diretório:** `/public_html/app` (ou crie uma pasta específica)
5. Clique em **"Criar"** ou **"Create"**

#### Passo 3.2: Configurar DNS no Registro.br para Frontend

**Opção A: Usar o mesmo domínio (Recomendado)**

Se você quer que `app.dasfabri.com.br` aponte para o **frontend** (Hostgator):

1. No Registro.br, adicione um registro **A**:
   - **Nome:** `app`
   - **Tipo:** **A**
   - **Valor:** IP do servidor Hostgator (peça ao suporte ou veja no cPanel)
   - **TTL:** `3600`

**⚠️ PROBLEMA:** Você não pode ter dois registros CNAME e A com o mesmo nome!

**Solução:** Use **subdomínios diferentes:**
- `app.dasfabri.com.br` → Frontend (Hostgator) - Registro A
- `api.dasfabri.com.br` → Backend (Render) - Registro CNAME

#### Passo 3.3: Configuração Recomendada

**Melhor Estrutura:**

1. **Frontend:**
   - Domínio: `app.dasfabri.com.br`
   - DNS: Registro **A** apontando para IP do Hostgator
   - Servidor: Hostgator

2. **Backend:**
   - Domínio: `api.dasfabri.com.br` (ou `app-api.dasfabri.com.br`)
   - DNS: Registro **CNAME** apontando para Render
   - Servidor: Render

3. **Configurar Frontend para usar Backend:**
   - No arquivo `.env.production` do frontend:
   ```env
   VITE_API_URL=https://api.dasfabri.com.br
   ```

---

### PARTE 4: CONFIGURAR SSL/HTTPS

#### Passo 4.1: SSL no Render (Backend)

1. No Render Dashboard, vá no seu Web Service
2. Clique em **"Settings"**
3. Role até **"SSL"**
4. O Render **automaticamente** configura SSL para domínios customizados
5. Aguarde alguns minutos após configurar o DNS

#### Passo 4.2: SSL no Hostgator (Frontend)

1. No cPanel do Hostgator
2. Vá em **"SSL/TLS Status"** ou **"Let's Encrypt SSL"**
3. Selecione o domínio: `app.dasfabri.com.br`
4. Clique em **"Run AutoSSL"** ou **"Install SSL"**
5. Aguarde alguns minutos

---

## 🎯 CONFIGURAÇÃO FINAL RECOMENDADA

### Estrutura de Domínios:

```
app.dasfabri.com.br          → Frontend (Hostgator)
api.dasfabri.com.br          → Backend (Render)
dasfabri.com.br              → Site Marketing (Hostgator)
```

### DNS no Registro.br:

| Tipo | Nome | Valor | Descrição |
|------|------|-------|-----------|
| A | `app` | IP do Hostgator | Frontend da plataforma |
| CNAME | `api` | `dasfabri-api-xxxxx.onrender.com` | Backend API |
| A | `@` | IP do Hostgator | Site marketing (raiz) |

### Variáveis de Ambiente:

**Frontend (`.env.production`):**
```env
VITE_API_URL=https://api.dasfabri.com.br
```

**Backend (Render Dashboard):**
```
CORS_ORIGINS=https://app.dasfabri.com.br,https://dasfabri.com.br
```

---

## ✅ CHECKLIST FINAL

- [ ] Domínio `app.dasfabri.com.br` configurado no Hostgator
- [ ] Registro A criado no Registro.br para `app`
- [ ] Domínio `api.dasfabri.com.br` configurado no Render
- [ ] Registro CNAME criado no Registro.br para `api`
- [ ] DNS propagado (verificar em dnschecker.org)
- [ ] SSL configurado no Hostgator
- [ ] SSL configurado no Render (automático)
- [ ] Frontend buildado com `VITE_API_URL=https://api.dasfabri.com.br`
- [ ] Frontend uploadado para Hostgator
- [ ] Testar acesso: `https://app.dasfabri.com.br`

---

## 🚨 PROBLEMAS COMUNS

### Problema 1: "DNS não propagou"
**Solução:**
- Aguarde até 24 horas
- Limpe cache do DNS: `sudo dscacheutil -flushcache` (Mac) ou `ipconfig /flushdns` (Windows)
- Use https://dnschecker.org para verificar

### Problema 2: "SSL não funciona"
**Solução:**
- Aguarde alguns minutos após configurar DNS
- Verifique se o DNS está propagado primeiro
- No Hostgator, force renovação do SSL

### Problema 3: "Erro 404 no frontend"
**Solução:**
- Verifique se os arquivos estão na pasta correta no Hostgator
- Configure `.htaccess` para SPA (Single Page Application)
- Verifique permissões das pastas

### Problema 4: "CORS Error"
**Solução:**
- Verifique `CORS_ORIGINS` no Render
- Adicione `https://app.dasfabri.com.br` na lista
- Reinicie o serviço no Render

---

## 📝 ARQUIVO .htaccess PARA SPA

Crie o arquivo `.htaccess` na pasta do frontend no Hostgator:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🎉 PRONTO!

Depois de seguir todos os passos:
- ✅ `app.dasfabri.com.br` → Abre o frontend da plataforma
- ✅ `api.dasfabri.com.br` → API do backend
- ✅ SSL/HTTPS funcionando
- ✅ Tudo conectado e funcionando

---

**Tempo estimado:** 2-4 horas (maioria é esperar propagação DNS)
