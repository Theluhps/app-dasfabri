# ⚡ CONFIGURAÇÃO RÁPIDA DE EMAIL

## ✅ SENHA DE APP JÁ CRIADA

Você já criou a App Password: `bmde yjwl rwuh svyt`

---

## 📝 PASSO 1: Editar arquivo .env

**Localização:** `apps/saas-platform/backend/.env`

**Abra o arquivo e substitua:**
- `SEU-EMAIL@gmail.com` → **Seu email Gmail real**

**Exemplo:**
Se seu email for `contato@dasfabri.com` ou `seuemail@gmail.com`, o arquivo deve ficar assim:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seuemail@gmail.com
SMTP_PASSWORD=bmdeyjwlrwuhsvyt
SMTP_FROM_EMAIL=seuemail@gmail.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

**⚠️ IMPORTANTE:**
- A senha no arquivo deve estar **SEM ESPAÇOS**: `bmdeyjwlrwuhsvyt`
- O email deve ser o **mesmo** que você usou para criar a App Password

---

## 🚀 PASSO 2: Reiniciar o servidor backend

Após editar o `.env`, reinicie o servidor:

```bash
cd apps/saas-platform/backend
python -m uvicorn main:app --reload
```

---

## ✅ PASSO 3: Testar

1. Preencha um formulário no site
2. Verifique os logs do backend:
   - Deve aparecer: `INFO: Email enviado com sucesso para dasfsociais@gmail.com`
3. Verifique a caixa de entrada de `dasfsociais@gmail.com`

---

## 🐛 Se não funcionar

### Verificar logs do backend:
```bash
# Procure por estas mensagens:
WARNING: SMTP não configurado  # ← Ainda não está configurado
INFO: Email enviado com sucesso  # ← Funcionando!
ERROR: Erro ao enviar email  # ← Problema de autenticação
```

### Erros comuns:

1. **"SMTP Authentication failed"**
   - Verifique se o email no `.env` está correto
   - Verifique se a senha está sem espaços
   - Certifique-se de que a verificação em duas etapas está ativada

2. **"SMTP não configurado"**
   - Verifique se o arquivo `.env` está na pasta correta
   - Reinicie o servidor após criar/editar o `.env`

---

**Última atualização:** Janeiro 2025

