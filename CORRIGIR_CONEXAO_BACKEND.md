# 🔧 Correção: Conexão Frontend com Backend

## Problema Identificado

O frontend estava usando dados **mockados** (localStorage) e não estava conectado ao backend real. Isso causava:
- ❌ Processos não eram salvos no banco de dados
- ❌ Busca não funcionava (só buscava em dados locais)
- ❌ Nada era criado no sistema (apenas simulações)

## Solução Implementada

### 1. ✅ Criado Serviço Real de API
**Arquivo:** `apps/marketing-site/frontend/src/services/importProcessesApiService.ts`

Este serviço faz chamadas reais ao backend:
- `createImportProcess()` - Criar processo
- `listImportProcesses()` - Listar processos
- `updateImportProcess()` - Atualizar processo
- `searchImportProcesses()` - Buscar processos
- `getImportProcessById()` - Obter processo por ID
- `deleteImportProcess()` - Deletar processo

### 2. ✅ Atualizado Hook useProcessesData
**Arquivo:** `apps/marketing-site/frontend/src/components/import/processes/useProcessesData.tsx`

Agora o hook:
- Carrega processos do backend na inicialização
- Salva processos no backend ao criar/editar
- Busca processos no backend ao pesquisar
- Mostra erros se o backend não estiver disponível

### 3. ⚠️ Configuração Necessária: VITE_API_URL

**IMPORTANTE:** Você precisa configurar a variável de ambiente `VITE_API_URL` para apontar para o backend.

#### Para Desenvolvimento Local:
Crie o arquivo `apps/marketing-site/frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

#### Para Produção (Render):
Crie o arquivo `apps/marketing-site/frontend/.env.production`:
```env
VITE_API_URL=https://app-dasfabri.onrender.com
```

Ou configure no Render Dashboard:
1. Vá em **Environment** → **Environment Variables**
2. Adicione: `VITE_API_URL` = `https://app-dasfabri.onrender.com`

## Como Testar

1. **Certifique-se de que o backend está rodando:**
   - Local: `http://localhost:8000`
   - Render: Verifique se o serviço está online

2. **Configure a URL da API:**
   - Crie o arquivo `.env` com `VITE_API_URL`

3. **Reinicie o frontend:**
   ```bash
   cd apps/marketing-site/frontend
   npm run dev
   ```

4. **Teste criar um processo:**
   - Crie um novo processo de importação
   - Verifique se aparece na lista
   - Recarregue a página - o processo deve persistir

5. **Teste a busca:**
   - Digite algo na barra de busca
   - Os resultados devem vir do backend

## Próximos Passos

1. ✅ Configurar `VITE_API_URL` no `.env`
2. ✅ Testar criação de processos
3. ✅ Testar busca
4. ✅ Verificar se outros módulos também precisam de conexão real

## Notas Técnicas

- O frontend agora usa `fetcher()` do `@/config/api` que já inclui autenticação
- Erros são tratados e mostrados em toast notifications
- Se o backend não estiver disponível, mostra mensagem de erro clara
- A busca é feita no backend, não mais localmente
