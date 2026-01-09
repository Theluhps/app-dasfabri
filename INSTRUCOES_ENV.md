# 📝 CRIAR ARQUIVO .env MANUALMENTE

## ✅ CONFIGURAÇÕES PRONTAS

- ✅ Service ID: `service_b356vgs`
- ✅ Public Key: `EigDHTvAsFSxLIw3A`
- ⏳ Template IDs: Aguardando criação dos templates

---

## 📋 CRIAR ARQUIVO .env

### Passo 1: Criar o arquivo

1. Abra o terminal
2. Navegue até: `apps/marketing-site/frontend/`
3. Crie o arquivo `.env`:

```bash
cd apps/marketing-site/frontend
touch .env
```

### Passo 2: Adicionar conteúdo

Abra o arquivo `.env` e cole este conteúdo:

```env
# EmailJS Configuration
# Service ID já configurado
VITE_EMAILJS_SERVICE_ID=service_b356vgs

# Public Key já configurado
VITE_EMAILJS_PUBLIC_KEY=EigDHTvAsFSxLIw3A

# Template IDs - ADICIONAR DEPOIS DE CRIAR OS TEMPLATES
# Substitua template_xxxxx pelo ID do template "Contato Demonstração"
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_xxxxx

# Substitua template_yyyyy pelo ID do template "Solicitação de Acesso"
VITE_EMAILJS_TEMPLATE_ID_ACCESS=template_yyyyy
```

### Passo 3: Salvar o arquivo

Salve o arquivo `.env`

---

## 📋 PRÓXIMOS PASSOS

### 1. Criar Templates no EmailJS

Siga o guia: `ADICIONAR_TEMPLATE_IDS.md`

### 2. Atualizar Template IDs

Depois de criar os templates, edite o arquivo `.env` e substitua:
- `template_xxxxx` → Template ID do "Contato Demonstração"
- `template_yyyyy` → Template ID do "Solicitação de Acesso"

### 3. Fazer Build

```bash
cd apps/marketing-site/frontend
npm run build
```

### 4. Upload para Hostgator

Faça upload da pasta `dist/` para Hostgator.

---

## ✅ CHECKLIST

- [ ] Arquivo `.env` criado
- [ ] Service ID adicionado: `service_b356vgs`
- [ ] Public Key adicionada: `EigDHTvAsFSxLIw3A`
- [ ] Templates criados no EmailJS
- [ ] Template IDs atualizados no `.env`
- [ ] Build feito
- [ ] Upload para Hostgator
- [ ] Teste realizado

---

**Última atualização:** Janeiro 2025

