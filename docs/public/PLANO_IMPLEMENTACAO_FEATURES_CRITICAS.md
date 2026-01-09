# PLANO DE IMPLEMENTAÇÃO - FEATURES CRÍTICAS
## Baseado nas Recomendações dos Investidores

**Data:** Janeiro 2025  
**Prioridade:** URGENTE  
**Prazo:** 2-4 semanas

---

## SPRINT 1 (2 semanas) - QUICK WINS

### 1. Watchlist/Favorites System ✅ EM PROGRESSO

**Backend:**
- [ ] Adicionar campo `is_favorite` no modelo `ImportProcess`
- [ ] Criar migration para adicionar coluna `is_favorite`
- [ ] Criar endpoint `POST /api/v1/import-processes/{id}/favorite` (toggle)
- [ ] Criar endpoint `GET /api/v1/import-processes/favorites` (listar favoritos)
- [ ] Adicionar filtro `favorites_only` no endpoint de listagem

**Frontend:**
- [ ] Criar componente `WatchlistWidget.tsx` (sidebar ou card)
- [ ] Adicionar botão de favoritar (ícone estrela) na tabela de processos
- [ ] Criar página `/watchlist` para visualizar todos os favoritos
- [ ] Adicionar filtro "Apenas Favoritos" na listagem de processos
- [ ] Persistir favoritos no localStorage (fallback)

**Estimativa:** 1-2 dias

---

### 2. CSV Upload/Import ✅ PRÓXIMO

**Backend:**
- [ ] Criar endpoint `POST /api/v1/products/import-csv`
- [ ] Criar endpoint `POST /api/v1/import-processes/import-csv`
- [ ] Validar formato CSV (headers obrigatórios)
- [ ] Processar CSV em lote (bulk insert)
- [ ] Retornar relatório de importação (sucessos, erros)

**Frontend:**
- [ ] Criar componente `CSVUploadDialog.tsx`
- [ ] Adicionar botão "Importar CSV" na página de Produtos
- [ ] Adicionar botão "Importar CSV" na página de Processos
- [ ] Criar template CSV para download
- [ ] Mostrar preview antes de importar
- [ ] Mostrar relatório de importação após upload

**Estimativa:** 2-3 dias

---

## SPRINT 2 (3 semanas) - PRODUCTIVITY

### 3. Task Management Básico

**Backend:**
- [ ] Criar modelo `Task` (id, title, description, process_id, due_date, status, assigned_to)
- [ ] Criar endpoints CRUD para tasks
- [ ] Criar endpoint `GET /api/v1/tasks/pending` (tarefas pendentes)
- [ ] Criar endpoint `GET /api/v1/tasks/overdue` (tarefas atrasadas)

**Frontend:**
- [ ] Criar componente `TaskManagement.tsx`
- [ ] Criar componente `TaskList.tsx` (sidebar ou widget)
- [ ] Adicionar widget de tarefas no dashboard
- [ ] Criar página `/tasks` para gerenciar tarefas
- [ ] Notificações para tarefas próximas do vencimento

**Estimativa:** 3-4 dias

---

### 4. Bulk Actions (Ações em Massa)

**Backend:**
- [ ] Criar endpoint `POST /api/v1/import-processes/bulk-approve` (aprovar múltiplos)
- [ ] Criar endpoint `POST /api/v1/import-processes/bulk-update` (atualizar múltiplos)
- [ ] Criar endpoint `POST /api/v1/import-processes/bulk-export` (exportar múltiplos)
- [ ] Criar endpoint `POST /api/v1/documents/bulk-approve` (aprovar documentos)

**Frontend:**
- [ ] Adicionar checkbox "Selecionar todos" nas tabelas
- [ ] Adicionar checkbox individual em cada linha
- [ ] Criar barra de ações em massa (aparece quando itens selecionados)
- [ ] Implementar ações: Aprovar, Rejeitar, Exportar, Atribuir responsável
- [ ] Mostrar contador de itens selecionados

**Estimativa:** 2-3 dias

---

## SPRINT 3 (4 semanas) - WOW FACTOR

### 5. Mapa Global Interativo

**Backend:**
- [ ] Criar endpoint `GET /api/v1/tracking/map-data` (coordenadas de embarques)
- [ ] Integrar com APIs de tracking (se disponível)
- [ ] Retornar dados de localização em tempo real

**Frontend:**
- [ ] Integrar biblioteca de mapas (Leaflet ou Google Maps)
- [ ] Criar componente `GlobalMap.tsx`
- [ ] Adicionar pins de embarques no mapa
- [ ] Mostrar popup com detalhes ao clicar no pin
- [ ] Adicionar filtros (origem, destino, status)
- [ ] Adicionar animação de rota (linha conectando origem-destino)

**Estimativa:** 4-5 dias

---

### 6. Dashboard Customizável (Fase 1)

**Backend:**
- [ ] Criar modelo `DashboardWidget` (user_id, widget_type, position, config)
- [ ] Criar endpoints para salvar/carregar layout do dashboard
- [ ] Criar endpoint `GET /api/v1/dashboard/widgets` (widgets disponíveis)

**Frontend:**
- [ ] Criar componente `CustomizableDashboard.tsx`
- [ ] Implementar drag-and-drop para reorganizar widgets
- [ ] Adicionar botão "Personalizar Dashboard"
- [ ] Criar modal de seleção de widgets
- [ ] Salvar preferências no localStorage (fallback) e backend

**Estimativa:** 5-6 dias

---

## PRIORIDADES ADICIONAIS

### Completar Frontend dos Módulos Faltantes:

1. **Products Management UI** (2-3 dias)
   - Listagem, cadastro, edição, categorias

2. **Warehouses Management UI** (2-3 dias)
   - Inventário, movimentações, relatórios

3. **Classification NCM UI** (3-4 dias)
   - Busca, sugestões, validação, histórico

4. **Advanced Customs UI** (3-4 dias)
   - Processos, validações, submissões

---

## CRONOGRAMA SUGERIDO

**Semana 1:**
- Watchlist/Favorites (2 dias)
- CSV Upload (3 dias)

**Semana 2:**
- Task Management (3 dias)
- Bulk Actions (2 dias)

**Semana 3:**
- Mapa Global (5 dias)

**Semana 4:**
- Dashboard Customizável (5 dias)

**Total:** 4 semanas para features críticas

---

## PRÓXIMOS PASSOS IMEDIATOS

1. ✅ Criar plano de implementação
2. ⏳ Adicionar campo `is_favorite` no backend
3. ⏳ Criar endpoints de watchlist
4. ⏳ Implementar componente de Watchlist no frontend
5. ⏳ Implementar CSV Upload

