
import React from 'react';
import { useWorkflow } from '@/hooks/use-workflow';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApprovalRequest, ApprovalRole } from '@/types/workflow';
import { Check, ChevronRight, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ProcessWorkflowStatusProps {
  processId: string;
  userRole: ApprovalRole;
  userId: string;
}

const ProcessWorkflowStatus: React.FC<ProcessWorkflowStatusProps> = ({ processId, userRole, userId }) => {
  const { 
    getWorkflowForProcess, 
    getWorkflowById, 
    getCurrentStep,
    getNextStep,
    createApprovalRequest 
  } = useWorkflow();

  const processWorkflow = getWorkflowForProcess(processId);
  
  if (!processWorkflow) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status do Processo</CardTitle>
          <CardDescription>Não há workflow ativo para este processo</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="default" 
            onClick={() => {/* Iniciar workflow aqui */}}
            className="w-full"
          >
            Iniciar Workflow
          </Button>
        </CardContent>
      </Card>
    );
  }

  const workflow = getWorkflowById(processWorkflow.workflowId);
  const currentStep = getCurrentStep(processId);
  const nextStep = getNextStep(processId);

  if (!workflow || !currentStep) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status do Processo</CardTitle>
          <CardDescription>Erro ao carregar detalhes do workflow</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const canRequestApproval = currentStep.requiredRole === userRole;

  // Funções para renderizar ícones de status baseado no status da aprovação
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Função para obter a última solicitação para a etapa atual
  const getLastRequestForStep = (stepId: string, history: ApprovalRequest[]): ApprovalRequest | undefined => {
    return [...history]
      .filter(req => req.stepId === stepId)
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())[0];
  };
  
  const handleRequestApproval = () => {
    if (canRequestApproval) {
      createApprovalRequest(processId, userId, userRole);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Workflow: {workflow.name}</CardTitle>
        <CardDescription>
          {processWorkflow.status === 'active' 
            ? 'Workflow em andamento' 
            : processWorkflow.status === 'completed' 
              ? 'Workflow concluído' 
              : 'Workflow cancelado'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-medium">{workflow.steps.findIndex(s => s.id === currentStep.id) + 1}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Etapa atual: {currentStep.name}</h3>
              <p className="text-sm text-gray-500">{currentStep.description}</p>
            </div>
          </div>

          {nextStep && (
            <div className="flex items-start space-x-2">
              <div className="pt-2">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Próxima etapa: {nextStep.name}</h4>
                <p className="text-xs text-gray-500">{nextStep.description}</p>
              </div>
            </div>
          )}

          {/* Status da última solicitação */}
          {processWorkflow.approvalHistory.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Histórico de Aprovações:</h4>
              <div className="space-y-2">
                {workflow.steps.map(step => {
                  const lastRequest = getLastRequestForStep(step.id, processWorkflow.approvalHistory);
                  
                  if (!lastRequest) return null;
                  
                  return (
                    <div key={step.id} className="flex items-center justify-between text-sm">
                      <span>{step.name}:</span>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center ${
                          lastRequest.status === 'approved' 
                            ? 'text-green-600' 
                            : lastRequest.status === 'rejected'
                              ? 'text-red-600'
                              : 'text-amber-600'
                        }`}>
                          {getStatusIcon(lastRequest.status)}
                          <span className="ml-1">
                            {lastRequest.status === 'approved' 
                              ? 'Aprovado' 
                              : lastRequest.status === 'rejected'
                                ? 'Rejeitado'
                                : 'Pendente'}
                          </span>
                        </span>
                        <span className="text-gray-400">
                          {lastRequest.responseDate 
                            ? format(new Date(lastRequest.responseDate), 'dd/MM/yyyy')
                            : '-'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botão de solicitar aprovação */}
          {processWorkflow.status === 'active' && canRequestApproval && (
            <Button 
              className="w-full mt-4"
              onClick={handleRequestApproval}
            >
              Solicitar Aprovação
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessWorkflowStatus;
