
import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/hooks/use-current-user';
import PendingApprovals from '@/components/workflow/PendingApprovals';
import UserRoleSelector from '@/components/workflow/UserRoleSelector';
import { ClipboardCheck, History, Filter, Plus } from 'lucide-react';
import { useWorkflow } from '@/hooks/use-workflow';
import { ApprovalHistoryList } from '@/components/workflow/ApprovalHistoryList';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ApprovalCenter: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const { processWorkflows } = useWorkflow();
  const [activeTab, setActiveTab] = React.useState('pending');
  const [showFilters, setShowFilters] = useState(false);
  const [showSimulateDialog, setShowSimulateDialog] = useState(false);
  const { addNotification } = useNotifications();
  const { createApprovalRequest } = useWorkflow();
  
  // Estado do formulário de simulação
  const [simulateForm, setSimulateForm] = useState({
    processId: '',
    category: 'compras',
    stepId: '',
    comments: ''
  });

  // Filtros para o histórico de aprovações
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    processId: '',
    category: 'all' // Novo filtro por categoria
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Função para simular uma nova aprovação pendente
  const handleSimulateApproval = () => {
    setShowSimulateDialog(true);
  };

  const handleSubmitSimulation = () => {
    if (simulateForm.processId && simulateForm.stepId) {
      // Criar aprovação simulada
      createApprovalRequest(
        simulateForm.processId,
        simulateForm.stepId,
        currentUser.role,
        simulateForm.comments
      );
      
      addNotification({
        title: "Nova aprovação criada",
        message: `Aprovação criada para o processo ${simulateForm.processId}`,
        type: "success",
        category: "workflow"
      });
      
      setShowSimulateDialog(false);
      setSimulateForm({
        processId: '',
        category: 'compras',
        stepId: '',
        comments: ''
      });
    }
  };

  return (
    <PageLayout 
      title="Centro de Aprovações" 
      description="Gerencie todas as aprovações de processos e workflows"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <UserRoleSelector />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSimulateApproval}
            className="hidden sm:flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Simular Nova Aprovação
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Aprovações do Usuário: {currentUser.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-1.5">
                <ClipboardCheck className="h-4 w-4" />
                Aprovações Pendentes
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1.5">
                <History className="h-4 w-4" />
                Histórico de Aprovações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <PendingApprovals userRole={currentUser.role} userId={currentUser.id} />
            </TabsContent>
            
            <TabsContent value="history">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Histórico de Aprovações</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
              </div>
              
              {showFilters && (
                <div className="p-4 mb-4 border rounded-md bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Categoria</label>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                      >
                        <option value="all">Todas</option>
                        <option value="compras">Compras</option>
                        <option value="administrativo">Administrativo</option>
                        <option value="financeiro">Financeiro</option>
                        <option value="logistica">Logística</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Status</label>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="all">Todos</option>
                        <option value="approved">Aprovados</option>
                        <option value="rejected">Rejeitados</option>
                        <option value="pending">Pendentes</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Período</label>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      >
                        <option value="all">Todos</option>
                        <option value="today">Hoje</option>
                        <option value="week">Esta Semana</option>
                        <option value="month">Este Mês</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">ID do Processo</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="Ex: IMP-2023-001"
                        value={filters.processId}
                        onChange={(e) => handleFilterChange('processId', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <ApprovalHistoryList 
                filters={filters}
                userRole={currentUser.role}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog para Simular Nova Aprovação */}
      <Dialog open={showSimulateDialog} onOpenChange={setShowSimulateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Simular Nova Aprovação</DialogTitle>
            <DialogDescription>
              Crie uma nova solicitação de aprovação para teste
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="processId">ID do Processo</Label>
              <Input
                id="processId"
                placeholder="Ex: IMP-2023-001"
                value={simulateForm.processId}
                onChange={(e) => setSimulateForm(prev => ({ ...prev, processId: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={simulateForm.category}
                onValueChange={(value) => setSimulateForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compras">Compras</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="logistica">Logística</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stepId">ID da Etapa</Label>
              <Input
                id="stepId"
                placeholder="Ex: step-1"
                value={simulateForm.stepId}
                onChange={(e) => setSimulateForm(prev => ({ ...prev, stepId: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comments">Comentários (opcional)</Label>
              <Textarea
                id="comments"
                placeholder="Adicione comentários sobre a aprovação..."
                value={simulateForm.comments}
                onChange={(e) => setSimulateForm(prev => ({ ...prev, comments: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSimulateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitSimulation}>
              Criar Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ApprovalCenter;
