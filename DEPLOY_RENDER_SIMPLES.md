# 🚀 DEPLOY NO RENDER - PASSO A PASSO SIMPLES

**Siga estes passos na ordem:**

---

## PASSO 1: CRIAR WEB SERVICE

1. Acesse: https://dashboard.render.com
2. Faça login
3. Clique no botão **"New +"** (canto superior direito)
4. Clique em **"Web Service"**
5. Se for a primeira vez, clique em **"Connect GitHub"** e autorize
6. Selecione o repositório: **`Theluhps/app-dasfabri`**
7. Clique em **"Connect"**

---

## PASSO 2: PREENCHER OS CAMPOS

### Nome:
```
dasfabri-api
```

### Região:
```
Oregon (US West)
```
(ou escolha a mais próxima do Brasil)

### Branch:
```
main
```

### Root Directory:
```
apps/saas-platform/backend
```
⚠️ **IMPORTANTE: Copie exatamente isso!**

### Build Command:
```
pip install -r requirements.txt
```

### Start Command:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## PASSO 3: CRIAR BANCO DE DADOS

1. Ainda no Dashboard, clique em **"New +"** novamente
2. Clique em **"PostgreSQL"**
3. Preencha:
   - **Name:** `dasfabri-db`
   - **Database:** `dasfabri_prod`
   - **User:** `dasfabri_user`
   - **Region:** Mesma que você escolheu antes
4. Clique em **"Create Database"**
5. Aguarde criar (1-2 minutos)
6. Depois que criar, clique no banco de dados
7. Procure por **"Internal Database URL"**
8. **COPIE essa URL** (vai precisar no próximo passo)

---

## PASSO 4: ADICIONAR VARIÁVEIS DE AMBIENTE

1. Volte para o Web Service que você criou
2. Clique em **"Environment"** (menu lateral)
3. Clique em **"Add Environment Variable"**
4. Adicione estas variáveis uma por uma:

### Variável 1:
- **Key:** `DATABASE_URL`
- **Value:** Cole a URL que você copiou do PostgreSQL

### Variável 2:
- **Key:** `SECRET_KEY`
- **Value:** `minha-chave-secreta-super-segura-123456` (pode ser qualquer texto longo)

### Variável 3:
- **Key:** `ALGORITHM`
- **Value:** `HS256`

### Variável 4:
- **Key:** `ACCESS_TOKEN_EXPIRE_MINUTES`
- **Value:** `1440`

### Variável 5:
- **Key:** `CORS_ORIGINS`
- **Value:** `https://app.dasfabri.com.br,https://dasfabri.com.br`

### Variável 6:
- **Key:** `ENVIRONMENT`
- **Value:** `production`

### Variável 7:
- **Key:** `DEBUG`
- **Value:** `false`

---

## PASSO 5: FAZER DEPLOY

1. Depois de adicionar todas as variáveis, clique em **"Save Changes"**
2. Clique em **"Manual Deploy"** (canto superior direito)
3. Clique em **"Deploy latest commit"**
4. Aguarde (pode levar 5-10 minutos)
5. Você verá os logs aparecendo
6. Quando aparecer **"Your service is live"**, está pronto!

---

## PASSO 6: CONFIGURAR DOMÍNIO (OPCIONAL)

1. No Web Service, clique em **"Settings"**
2. Role a página até encontrar **"Custom Domains"**
3. Clique em **"Add Custom Domain"**
4. Digite: `app.dasfabri.com.br`
5. Clique em **"Save"**
6. Render vai mostrar instruções de DNS
7. Configure no seu provedor de domínio (Registro.br):
   - **Tipo:** CNAME
   - **Nome:** `app`
   - **Valor:** O hostname que o Render mostrar (ex: `dasfabri-api.onrender.com`)
8. Aguarde algumas horas para propagar

---

## ✅ PRONTO!

Depois do deploy, acesse:
- **URL do Render:** `https://dasfabri-api.onrender.com/docs`
- **Seu domínio:** `https://app.dasfabri.com.br/docs` (depois de configurar DNS)

Você deve ver a documentação da API (Swagger).

---

## 🚨 SE DER ERRO

### Erro: "Module not found"
- Verifique se o **Root Directory** está correto: `apps/saas-platform/backend`

### Erro: "Database connection failed"
- Verifique se a **DATABASE_URL** está correta
- Use a **"Internal Database URL"** (não a External)

### Erro: "Port already in use"
- Verifique se o **Start Command** tem `$PORT` (não um número fixo)

---

**É só isso! Siga os passos na ordem e está feito!** 🚀
