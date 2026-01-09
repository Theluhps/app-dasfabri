# 🔍 DIAGNÓSTICO: Por que os emails não são enviados?

## ❌ PROBLEMA IDENTIFICADO

Os emails **NÃO estão sendo enviados** porque o **SMTP não está configurado** no backend.

### Como funciona atualmente:

1. **Frontend envia dados** → Backend recebe em `/api/v1/public/contact`
2. **Backend salva no banco** → Dados são salvos em `access_requests`
3. **Backend tenta enviar email** → Mas falha silenciosamente se SMTP não estiver configurado

### Código relevante (`app/core/email.py`):

```python
# Se não houver configuração de SMTP, apenas loga
if not SMTP_USER or not SMTP_PASSWORD:
    logger.warning("SMTP não configurado. Email não será enviado.")
    logger.info(f"Email que seria enviado para {to_email}: {subject}")
    return False  # ← Retorna False, mas não falha a requisição
```

**Isso significa:**
- ✅ Os dados são salvos no banco
- ❌ Os emails **NÃO são enviados**
- ⚠️ O usuário vê sucesso, mas você não recebe o email

---

## ✅ SOLUÇÃO

### Passo 1: Configurar SMTP no Backend

1. **Criar arquivo `.env`** em `apps/saas-platform/backend/`:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-app-password-aqui
SMTP_FROM_EMAIL=seu-email@gmail.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

2. **Criar App Password no Gmail:**
   - Acesse: https://myaccount.google.com/apppasswords
   - Gere uma senha para "Dasfabri Backend"
   - Use essa senha no `SMTP_PASSWORD`

3. **Reiniciar o servidor backend:**
```bash
cd apps/saas-platform/backend
python -m uvicorn main:app --reload
```

### Passo 2: Verificar se está funcionando

Após configurar, teste enviando um formulário e verifique:

1. **Logs do backend:**
   - Deve aparecer: `INFO: Email enviado com sucesso para dasfsociais@gmail.com`
   - Se aparecer: `WARNING: SMTP não configurado` → Ainda não está configurado

2. **Caixa de entrada:**
   - Verifique `dasfsociais@gmail.com`
   - Verifique a pasta de spam

---

## 🔍 COMO VERIFICAR SE ESTÁ CONFIGURADO

### Opção 1: Verificar logs do backend

Quando alguém preenche o formulário, você deve ver nos logs:

```
INFO: Email enviado com sucesso para dasfsociais@gmail.com
```

Se ver:
```
WARNING: SMTP não configurado. Email não será enviado.
```

→ Significa que o `.env` não está configurado ou não está sendo carregado.

### Opção 2: Testar endpoint diretamente

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

Verifique os logs do backend para ver se o email foi enviado.

---

## 📋 CHECKLIST

- [ ] Arquivo `.env` criado em `apps/saas-platform/backend/`
- [ ] `SMTP_USER` configurado com email Gmail
- [ ] `SMTP_PASSWORD` configurado com App Password
- [ ] `SMTP_TO_EMAIL=dasfsociais@gmail.com`
- [ ] Servidor backend reiniciado
- [ ] Teste realizado e email recebido
- [ ] Logs verificados (sem warnings de SMTP)

---

## ⚠️ IMPORTANTE

**Mesmo sem SMTP configurado:**
- ✅ Os dados são salvos no banco de dados
- ✅ O usuário vê mensagem de sucesso
- ❌ Você **NÃO recebe o email**

**Com SMTP configurado:**
- ✅ Dados salvos no banco
- ✅ Email enviado para `dasfsociais@gmail.com`
- ✅ Você recebe notificação imediata

---

**Documentação completa:** Veja `CONFIGURAR_EMAIL.md`

