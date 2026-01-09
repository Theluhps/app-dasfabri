# 📋 ANÁLISE: Para Onde Vão as Solicitações e Contatos

## 🔍 SITUAÇÃO ATUAL

### 1. **Formulário de Contato/Demonstração (CTAForm.tsx)**
**Localização:** `apps/marketing-site/frontend/src/components/cta/CTAForm.tsx`

**Problema:** ❌ **NÃO ESTÁ ENVIANDO DADOS PARA LUGAR NENHUM**
- O formulário apenas mostra uma mensagem de sucesso
- Redireciona para `/auth/register` após 3 segundos
- **Os dados são perdidos** (nome, email, empresa, mensagem)

**Código atual:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitted(true);
  // After form submission, we'd normally wait for API response before redirecting
  // For demo purposes, we'll just show success message
  setTimeout(() => {
    navigate('/auth/register');
  }, 3000);
};
```

---

### 2. **Formulário de Registro/Acesso (Register.tsx)**
**Localização:** `apps/marketing-site/frontend/src/pages/auth/Register.tsx`

**Problema:** ⚠️ **ENDPOINT REQUER AUTENTICAÇÃO E NÃO ESTÁ REGISTRADO**
- Tenta enviar para `/api/v1/access-requests/`
- O endpoint requer autenticação (`current_user: User = Depends(get_current_user)`)
- Visitantes do site **não estão autenticados**, então a requisição falha
- O endpoint não está registrado no `main.py` (está comentado)

**Código atual:**
```typescript
const response = await fetch('/api/v1/access-requests/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone,
    position: data.position,
  }),
});
```

**Endpoint no backend:**
```python
@router.post("/", response_model=AccessRequestResponse)
def create_access_request(
    request: AccessRequestCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)  # ❌ Requer autenticação!
):
```

---

## 🎯 SOLUÇÃO NECESSÁRIA

### 1. Criar Endpoints Públicos
- ✅ Endpoint público para contatos/demonstração: `/api/v1/public/contact`
- ✅ Endpoint público para solicitações de acesso: `/api/v1/public/access-request`

### 2. Salvar Dados no Banco
- ✅ Criar tabela `contact_requests` para contatos
- ✅ Usar tabela `access_requests` existente (mas sem requerer autenticação)

### 3. Integração com Email (Futuro)
- ⏳ Enviar email para equipe de vendas quando houver novo contato
- ⏳ Enviar email de confirmação para o solicitante
- ⏳ Notificar admins sobre novas solicitações

### 4. Atualizar Frontend
- ✅ Atualizar `CTAForm.tsx` para enviar dados
- ✅ Atualizar `Register.tsx` para usar endpoint público

---

## 📊 FLUXO ATUAL vs FLUXO CORRETO

### ❌ FLUXO ATUAL (QUEBRADO)

```
Visitante preenche formulário
    ↓
Dados são perdidos (CTAForm)
    OU
Requisição falha (Register - 401 Unauthorized)
    ↓
Nenhum dado é salvo
Nenhum email é enviado
Nenhuma notificação é criada
```

### ✅ FLUXO CORRETO (A IMPLEMENTAR)

```
Visitante preenche formulário
    ↓
Envia para endpoint público
    ↓
Dados são salvos no banco
    ↓
Email é enviado para equipe de vendas
Email de confirmação é enviado ao solicitante
Notificação é criada para admins
    ↓
Solicitação aparece no painel admin
```

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Criar endpoints públicos no backend
2. ✅ Atualizar frontend para usar os novos endpoints
3. ⏳ Implementar salvamento no banco de dados
4. ⏳ Implementar envio de emails
5. ⏳ Criar painel admin para visualizar solicitações

---

**Status:** 🔴 **CRÍTICO** - Nenhuma solicitação está sendo recebida atualmente!

