# 📝 COMO CRIAR O ARQUIVO .env

## ⚡ MÉTODO RÁPIDO

### Passo 1: Criar o arquivo

No terminal, execute:

```bash
cd apps/saas-platform/backend
touch .env
```

### Passo 2: Abrir o arquivo

Abra o arquivo `.env` no editor de texto.

### Passo 3: Colar este conteúdo

```env
# Configurações de Email (SMTP)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=SEU-EMAIL@gmail.com
SMTP_PASSWORD=bmdeyjwlrwuhsvyt
SMTP_FROM_EMAIL=SEU-EMAIL@gmail.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

### Passo 4: Substituir o email

**Substitua `SEU-EMAIL@gmail.com` pelo seu email Gmail real.**

**Exemplo:**
Se seu email for `contato@dasfabri.com`, o arquivo deve ficar:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@dasfabri.com
SMTP_PASSWORD=bmdeyjwlrwuhsvyt
SMTP_FROM_EMAIL=contato@dasfabri.com
SMTP_TO_EMAIL=dasfsociais@gmail.com
```

### Passo 5: Salvar

Salve o arquivo.

---

## ✅ VERIFICAÇÃO

Após criar o arquivo, verifique:

1. **Localização:** `apps/saas-platform/backend/.env`
2. **Conteúdo:** Deve ter as 6 linhas de SMTP
3. **Email:** Deve estar substituído (não pode ter "SEU-EMAIL")
4. **Senha:** Deve estar sem espaços: `bmdeyjwlrwuhsvyt`

---

## 🚀 PRÓXIMO PASSO

Após criar o `.env`, **reinicie o servidor backend**:

```bash
cd apps/saas-platform/backend
python -m uvicorn main:app --reload
```

---

## 🧪 TESTAR

1. Preencha um formulário no site
2. Verifique os logs do backend
3. Verifique a caixa de entrada de `dasfsociais@gmail.com`

---

**Última atualização:** Janeiro 2025

