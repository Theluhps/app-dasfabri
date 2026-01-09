# 📝 CRIAR ARQUIVO .env MANUALMENTE

## ⚠️ IMPORTANTE

O arquivo `.env` precisa ser criado **ANTES** do build para que as variáveis do EmailJS sejam incluídas no código compilado.

---

## 📋 PASSO A PASSO

### 1. Criar o arquivo

No terminal, execute:

```bash
cd apps/marketing-site/frontend
nano .env
```

### 2. Cole este conteúdo

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_b356vgs
VITE_EMAILJS_PUBLIC_KEY=EigDHTvAsFSxLIw3A
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_0undr9w
VITE_EMAILJS_TEMPLATE_ID_ACCESS=template_gmra0qh
```

### 3. Salvar

- No nano: `Ctrl+O` (salvar), Enter, `Ctrl+X` (sair)
- Ou no editor de código: Salvar normalmente

### 4. Verificar

```bash
cat .env
```

Você deve ver as 4 variáveis listadas acima.

### 5. Fazer Build

```bash
npm run build
```

---

## ✅ DEPOIS DO BUILD

1. Verifique se a pasta `dist/` foi gerada
2. Faça upload da pasta `dist/` para Hostgator
3. Teste os formulários no site

---

## 🎯 CONFIGURAÇÕES

- Service ID: `service_b356vgs`
- Public Key: `EigDHTvAsFSxLIw3A`
- Template ID Contato: `template_0undr9w`
- Template ID Acesso: `template_gmra0qh`

---

**Última atualização:** Janeiro 2025

