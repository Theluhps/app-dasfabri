# 🧪 Guia Completo de Testes - Dasfabri Platform

## 📋 Pré-requisitos

1. **Backend rodando:**
   ```bash
   cd apps/saas-platform/backend
   source ../../../venv/bin/activate
   uvicorn main:app --reload
   ```
   Servidor deve estar em: `http://localhost:8000`

2. **Frontend rodando:**
   ```bash
   cd apps/marketing-site/frontend
   npm run dev
   ```
   Aplicação deve estar em: `http://localhost:5173`

3. **Usuário de teste:**
   - Faça login na aplicação
   - Ou crie uma conta nova

---

## 🎯 Testes por Feature

### ✅ SPRINT 1 - Produtividade Imediata

#### 1. Watchlist/Favoritos
**URL:** `/watchlist`

**Testes:**
- [ ] Acesse a página de Favoritos
- [ ] Marque um processo como favorito (ícone de estrela na tabela de processos)
- [ ] Verifique se aparece na página de Favoritos
- [ ] Desmarque um favorito
- [ ] Verifique se foi removido da lista

**Onde testar:**
- Menu lateral: "Favoritos"
- Tabela de processos: ícone de estrela em cada linha

#### 2. CSV Upload
**URL:** `/products` ou `/import/processes`

**Testes:**
- [ ] Clique em "Importar CSV" na página de Produtos
- [ ] Baixe o template CSV
- [ ] Preencha o template com dados de exemplo
- [ ] Faça upload do arquivo
- [ ] Verifique se os produtos foram importados
- [ ] Teste com arquivo inválido (deve mostrar erros)
- [ ] Repita o teste na página de Processos

**Onde testar:**
- Página de Produtos: botão "Importar CSV" no header
- Página de Processos: botão "Importar CSV" no header

---

### ✅ SPRINT 2 - Gestão e Ações em Massa

#### 3. Task Management
**URL:** `/tasks`

**Testes:**
- [ ] Acesse a página de Tarefas
- [ ] Crie uma nova tarefa
- [ ] Edite uma tarefa existente
- [ ] Marque uma tarefa como concluída
- [ ] Filtre tarefas por status, prioridade ou tipo
- [ ] Delete uma tarefa
- [ ] Verifique tarefas pendentes no Dashboard

**Onde testar:**
- Menu lateral: "Tarefas"
- Dashboard: widget "Tarefas Pendentes"

#### 4. Bulk Actions
**URL:** `/import/processes`

**Testes:**
- [ ] Marque múltiplos processos com os checkboxes
- [ ] Verifique se a barra de ações aparece na parte inferior
- [ ] Clique em "Aprovar" para aprovar múltiplos processos
- [ ] Verifique se os processos foram aprovados
- [ ] Teste "Limpar Seleção"
- [ ] Teste "Selecionar Todos" no header da tabela

**Onde testar:**
- Tabela de processos: checkbox na primeira coluna
- Barra flutuante: aparece quando itens estão selecionados

---

### ✅ SPRINT 3 - Visualização e Customização

#### 5. Mapa Global
**URL:** `/map`

**Testes:**
- [ ] Acesse a página do Mapa Global
- [ ] Verifique se os embarques aparecem como pins no mapa
- [ ] Clique em um pin para ver detalhes
- [ ] Filtre por status (dropdown no topo)
- [ ] Clique em um embarque na lista lateral
- [ ] Verifique se o mapa destaca o embarque selecionado
- [ ] Teste o botão "Atualizar"

**Onde testar:**
- Menu lateral: "Mapa Global"
- Pins coloridos no mapa SVG
- Lista de embarques na parte inferior

#### 6. Dashboard Customizável
**URL:** `/dashboard`

**Testes:**
- [ ] Acesse o Dashboard
- [ ] Clique em "Configurar Widgets" (botão no header)
- [ ] Selecione/deselecione widgets
- [ ] Salve a configuração
- [ ] Verifique se os widgets aparecem/desaparecem
- [ ] Teste "Resetar" para voltar ao padrão
- [ ] Verifique se a configuração persiste após recarregar a página

**Onde testar:**
- Dashboard: botão "Configurar Widgets" no canto superior direito
- Dialog de configuração: lista de widgets disponíveis

---

### ✅ Módulos Frontend Completos

#### 7. Products Management
**URL:** `/products`

**Testes:**
- [ ] Liste produtos
- [ ] Crie um novo produto
- [ ] Edite um produto existente
- [ ] Delete (desative) um produto
- [ ] Busque produtos pelo nome
- [ ] Classifique um produto automaticamente (botão com ícone de estrela)
- [ ] Importe produtos via CSV

**Onde testar:**
- Menu lateral: "Produtos"
- Tabela completa com CRUD
- Botão de classificação automática

#### 8. Warehouses Management
**URL:** `/warehouses`

**Testes:**
- [ ] Liste armazéns
- [ ] Crie um novo armazém
- [ ] Edite um armazém
- [ ] Selecione um armazém para ver inventário
- [ ] Verifique movimentações de estoque
- [ ] Teste as abas (Armazéns, Inventário, Movimentações)

**Onde testar:**
- Menu lateral: "Armazéns"
- Interface com abas

#### 9. Classification NCM
**URL:** `/classification`

**Testes:**
- [ ] Preencha o formulário de classificação
- [ ] Clique em "Classificar Produto"
- [ ] Verifique o NCM sugerido e confiança
- [ ] Veja alternativas de classificação
- [ ] Clique em "Consultar NCM" para ver detalhes
- [ ] Use a consulta rápida na parte inferior
- [ ] Verifique informações de alíquota e restrições

**Onde testar:**
- Menu lateral: "Classificação NCM"
- Formulário completo de classificação

#### 10. Advanced Customs
**URL:** `/customs`

**Testes:**
- [ ] Digite um ID de processo e selecione tipo (import/export)
- [ ] Clique em "Buscar" para ver status
- [ ] Clique em "Validar Documentos"
- [ ] Verifique erros e avisos
- [ ] Teste "Submeter à Alfândega" (se status for pending)
- [ ] Busque um DUIMP no Siscomex
- [ ] Sincronize dados do Siscomex

**Onde testar:**
- Menu lateral: "Alfândega"
- Interface completa de desembaraço

---

## 🔍 Checklist de Integração

### Backend APIs
- [ ] Todas as rotas respondem corretamente
- [ ] Autenticação funciona
- [ ] Validações de dados estão ativas
- [ ] Erros retornam mensagens claras

### Frontend
- [ ] Todas as páginas carregam sem erros
- [ ] Navegação entre páginas funciona
- [ ] Formulários validam dados
- [ ] Mensagens de sucesso/erro aparecem
- [ ] Loading states funcionam
- [ ] Dark mode funciona (se aplicável)

### Integração Backend-Frontend
- [ ] Dados são carregados corretamente
- [ ] Criação/edição salva no backend
- [ ] Deletar remove do backend
- [ ] Filtros e buscas funcionam
- [ ] Upload de CSV funciona

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to backend"
**Solução:**
- Verifique se o backend está rodando em `http://localhost:8000`
- Verifique o console do navegador para erros CORS
- Confirme que o token de autenticação está sendo enviado

### Erro: "404 Not Found" em rotas
**Solução:**
- Verifique se as rotas estão registradas em `App.tsx`
- Confirme que os componentes foram importados corretamente

### Erro: "White screen"
**Solução:**
- Abra o console do navegador (F12)
- Verifique erros JavaScript
- Limpe o cache do navegador
- Verifique se `npm install` foi executado

### Erro: "CSV upload fails"
**Solução:**
- Verifique se o arquivo está no formato correto
- Confirme que o backend está rodando
- Verifique o token de autenticação
- Veja os logs do backend para detalhes

---

## 📊 Resultados Esperados

### ✅ Sucesso
- Todas as features funcionam como esperado
- Dados são salvos e carregados corretamente
- Interface é responsiva e intuitiva
- Mensagens de feedback aparecem

### ⚠️ Atenção
- Alguns recursos podem precisar de dados de teste
- Integrações externas (Siscomex) podem ser mockadas
- Alguns endpoints podem retornar dados vazios inicialmente

---

## 🎯 Próximos Passos Após Testes

1. **Documentar bugs encontrados**
2. **Priorizar correções**
3. **Adicionar testes automatizados**
4. **Melhorar UX baseado em feedback**
5. **Otimizar performance**

---

## 📝 Notas

- Todos os testes devem ser feitos com um usuário autenticado
- Alguns recursos podem precisar de dados pré-existentes
- Testes de integração com APIs externas podem ser limitados
- Documente qualquer comportamento inesperado

---

**Última atualização:** Janeiro 2025
**Versão da plataforma:** 1.0.0

