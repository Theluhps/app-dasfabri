# 🔧 RESOLVER ERRO: "Insufficient authentication scopes"

## ❌ ERRO ENCONTRADO

```
412 Gmail_API: Request had insufficient authentication scopes
```

**Causa:** O Gmail não está dando as permissões corretas para o EmailJS enviar emails.

---

## ✅ SOLUÇÃO: RECONECTAR GMAIL COM PERMISSÕES CORRETAS

### Passo 1: Desconectar Gmail

1. No modal do EmailJS, clique em **"Disconnect"** (ao lado de `dasfsociais@gmail.com`)
2. Aguarde a desconexão

### Passo 2: Reconectar Gmail

1. Clique novamente em **"Connect Account"**
2. **IMPORTANTE:** Quando o Google pedir permissões, certifique-se de:
   - ✅ Marcar **"Send email on your behalf"** (Enviar email em seu nome)
   - ✅ Aceitar **TODAS** as permissões solicitadas
   - ✅ Não pular nenhuma etapa

### Passo 3: Verificar Permissões no Google

Se ainda não funcionar, verifique as permissões diretamente no Google:

1. Acesse: https://myaccount.google.com/permissions
2. Procure por **"EmailJS"** ou **"Third-party apps"**
3. Se encontrar, clique em **"Remove"** e reconecte
4. Se não encontrar, continue para o próximo passo

### Passo 4: Usar App Password (Alternativa)

Se o problema persistir, você pode usar App Password:

1. No EmailJS, ao invés de "Gmail", escolha **"Gmail (Custom SMTP)"**
2. Configure com:
   - **SMTP Server:** `smtp.gmail.com`
   - **Port:** `587`
   - **Username:** `dasfsociais@gmail.com`
   - **Password:** Use o App Password do Gmail (não a senha normal)
   - **From Email:** `dasfsociais@gmail.com`

**Como gerar App Password:**
1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione **"Mail"** e **"Other (Custom name)"**
3. Digite: `EmailJS`
4. Clique em **"Generate"**
5. Copie a senha gerada (16 caracteres, sem espaços)
6. Use essa senha no EmailJS

---

## 🎯 SOLUÇÃO RÁPIDA (RECOMENDADA)

### Opção 1: Reconectar com Permissões Completas

1. **Desconecte** o Gmail no EmailJS
2. **Reconecte** e aceite **TODAS** as permissões
3. Marque a caixa **"Send test email to verify configuration"**
4. Clique em **"Create Service"**

### Opção 2: Usar Gmail Custom SMTP

1. No EmailJS, escolha **"Gmail (Custom SMTP)"** ao invés de "Gmail"
2. Configure com App Password (veja Passo 4 acima)
3. Teste o envio

---

## ✅ DEPOIS DE RESOLVER

1. Anote o **Service ID**: `service_b356vgs` ✅ (já tem!)
2. Continue criando os templates de email
3. Configure o arquivo `.env` no frontend

---

## 📋 CHECKLIST

- [ ] Desconectou Gmail no EmailJS
- [ ] Reconectou Gmail aceitando TODAS as permissões
- [ ] Teste de email funcionou
- [ ] Service ID anotado: `service_b356vgs`
- [ ] Pronto para criar templates

---

**Última atualização:** Janeiro 2025

