import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/hooks/use-current-user';
import ProcessWorkflowStatus from '@/components/workflow/ProcessWorkflowStatus';
import ApprovalHistory from '@/components/workflow/ApprovalHistory';
import UserRoleSelector from '@/components/workflow/UserRoleSelector';
import { ClipboardCheck, Info, History } from 'lucide-react';
import StartWorkflowDialog from '@/components/workflow/StartWorkflowDialog';
import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/hooks/use-workflow';

const ProcessDetail: React.FC = () => {
  const { processId } = useParams<{ processId: string }>();
  const { currentUser } = useCurrentUser();
  const { getWorkflowForProcess } = useWorkflow();
  const [activeTab, setActiveTab] = useState('details');
  const [showStartWorkflow, setShowStartWorkflow] = useState(false);

  if (!processId) {
    return (
      <PageLayout title="Erro" description="ID do processo não fornecido">
        <div>Processo não encontrado</div>
      </PageLayout>
    );
  }

  // Verifica se já existe um workflow para este processo
  const hasWorkflow = !!getWorkflowForProcess(processId);

  const handleStartWorkflow = () => {
    setShowStartWorkflow(true);
  };

  return (
    <PageLayout 
      title={`Processo ${processId}`}
      description="Detalhes do processo e fluxo de aprovação"
    >
      <div className="flex justify-end mb-4">
        <UserRoleSelector />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="details" className="flex items-center gap-1.5">
            <Info className="h-4 w-4" />
            Detalhes do Processo
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-1.5">
            <ClipboardCheck className="h-4 w-4" />
            Status do Workflow
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1.5">
            <History className="h-4 w-4" />
            Histórico de Aprovações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Processo {processId}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Dados fictícios do processo para demo */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Informações Gerais</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-500">ID:</div>
                    <div>{processId}</div>
                    <div className="text-gray-500">Cliente:</div>
                    <div>Cliente ABC Ltda</div>
                    <div className="text-gray-500">Produto:</div>
                    <div>Equipamento Industrial</div>
                    <div className="text-gray-500">Origem:</div>
                    <div>Alemanha</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Detalhes da Operação</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-500">Status:</div>
                    <div>Em Andamento</div>
                    <div className="text-gray-500">Data de Criação:</div>
                    <div>10/05/2025</div>
                    <div className="text-gray-500">Valor:</div>
                    <div>EUR 45,000.00</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflow">
          {hasWorkflow ? (
            <ProcessWorkflowStatus
              processId={processId}
              userRole={currentUser.role}
              userId={currentUser.id}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Nenhum workflow iniciado</h3>
                <p className="text-gray-500 mb-6">Inicie um workflow para este processo.</p>
                <Button onClick={handleStartWorkflow}>Iniciar Workflow</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <ApprovalHistory processId={processId} />
        </TabsContent>
      </Tabs>
      
      <StartWorkflowDialog 
        processId={processId}
        open={showStartWorkflow}
        onOpenChange={setShowStartWorkflow}
      />
    </PageLayout>
  );
};

export default ProcessDetail;
