
import { ApprovalRequest, ProcessWorkflow, WorkflowDefinition } from '@/types/workflow';
import { toast } from "@/hooks/use-toast";

export const approveRequest = (
  requestId: string, 
  responderId: string, 
  pendingApprovals: ApprovalRequest[],
  processWorkflows: ProcessWorkflow[],
  workflows: WorkflowDefinition[],
  setPendingApprovals: React.Dispatch<React.SetStateAction<ApprovalRequest[]>>,
  setProcessWorkflows: React.Dispatch<React.SetStateAction<ProcessWorkflow[]>>,
  comments?: string
): boolean => {
  // Encontrar a solicitação
  const requestIndex = pendingApprovals.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    toast({
      title: "Erro ao aprovar",
      description: "Solicitação não encontrada.",
      variant: "destructive"
    });
    return false;
  }

  const request = pendingApprovals[requestIndex];
  
  // Atualizar a solicitação
  const updatedRequest: ApprovalRequest = {
    ...request,
    status: 'approved',
    responderId,
    responseDate: new Date(),
    comments: comments || request.comments
  };

  // Remover da lista de aprovações pendentes
  setPendingApprovals(prev => prev.filter(req => req.id !== requestId));
  
  // Atualizar a solicitação no histórico
  setProcessWorkflows(prev => 
    prev.map(workflow => 
      workflow.processId === request.processId
        ? { 
            ...workflow, 
            approvalHistory: workflow.approvalHistory.map(req => 
              req.id === requestId ? updatedRequest : req
            )
          }
        : workflow
    )
  );

  // Se aprovada, avançar para a próxima etapa se houver
  const processWorkflow = processWorkflows.find(w => w.processId === request.processId);
  if (processWorkflow) {
    const workflow = workflows.find(w => w.id === processWorkflow.workflowId);
    if (workflow) {
      const currentStep = workflow.steps.find(step => step.id === request.stepId);
      if (currentStep && currentStep.nextStepId) {
        // Avançar para próxima etapa
        setProcessWorkflows(prev => 
          prev.map(workflow => 
            workflow.processId === request.processId
              ? { ...workflow, currentStepId: currentStep.nextStepId! }
              : workflow
          )
        );
        
        toast({
          title: "Aprovação concluída",
          description: `O processo ${request.processId} avançou para a próxima etapa.`,
        });
      } else {
        // Workflow completo
        setProcessWorkflows(prev => 
          prev.map(workflow => 
            workflow.processId === request.processId
              ? { ...workflow, status: 'completed' }
              : workflow
          )
        );
        
        toast({
          title: "Workflow concluído",
          description: `O workflow para o processo ${request.processId} foi concluído com sucesso.`,
        });
      }
    }
  }
  return true;
};

export const rejectRequest = (
  requestId: string, 
  responderId: string, 
  pendingApprovals: ApprovalRequest[],
  setPendingApprovals: React.Dispatch<React.SetStateAction<ApprovalRequest[]>>,
  setProcessWorkflows: React.Dispatch<React.SetStateAction<ProcessWorkflow[]>>,
  comments?: string
): boolean => {
  // Encontrar a solicitação
  const requestIndex = pendingApprovals.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    toast({
      title: "Erro ao rejeitar",
      description: "Solicitação não encontrada.",
      variant: "destructive"
    });
    return false;
  }

  const request = pendingApprovals[requestIndex];
  
  // Atualizar a solicitação
  const updatedRequest: ApprovalRequest = {
    ...request,
    status: 'rejected',
    responderId,
    responseDate: new Date(),
    comments: comments || request.comments
  };

  // Remover da lista de aprovações pendentes
  setPendingApprovals(prev => prev.filter(req => req.id !== requestId));
  
  // Atualizar a solicitação no histórico
  setProcessWorkflows(prev => 
    prev.map(workflow => 
      workflow.processId === request.processId
        ? { 
            ...workflow, 
            approvalHistory: workflow.approvalHistory.map(req => 
              req.id === requestId ? updatedRequest : req
            )
          }
        : workflow
    )
  );

  toast({
    title: "Solicitação rejeitada",
    description: `A solicitação para o processo ${request.processId} foi rejeitada.`,
  });
  return true;
};
