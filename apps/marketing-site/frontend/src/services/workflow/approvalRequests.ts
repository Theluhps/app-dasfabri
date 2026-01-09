
import { ApprovalRequest, ApprovalRole, ProcessWorkflow, WorkflowDefinition } from '@/types/workflow';
import { toast } from "@/hooks/use-toast";
import { useNotificationSound } from '@/hooks/use-notification-sound';

export const createApprovalRequest = (
  processId: string, 
  requesterId: string, 
  requesterRole: ApprovalRole,
  processWorkflows: ProcessWorkflow[],
  workflows: WorkflowDefinition[],
  setPendingApprovals: React.Dispatch<React.SetStateAction<ApprovalRequest[]>>,
  setProcessWorkflows: React.Dispatch<React.SetStateAction<ProcessWorkflow[]>>,
  comments?: string
): boolean => {
  const processWorkflow = processWorkflows.find(w => w.processId === processId);
  if (!processWorkflow) {
    toast({
      title: "Erro ao criar solicitação",
      description: `Nenhum workflow encontrado para o processo ${processId}.`,
      variant: "destructive"
    });
    return false;
  }

  const workflow = workflows.find(w => w.id === processWorkflow.workflowId);
  if (!workflow) {
    toast({
      title: "Erro ao criar solicitação",
      description: "Workflow não encontrado.",
      variant: "destructive"
    });
    return false;
  }

  const currentStep = workflow.steps.find(step => step.id === processWorkflow.currentStepId);
  if (!currentStep) {
    toast({
      title: "Erro ao criar solicitação",
      description: "Nenhuma etapa atual definida para este processo.",
      variant: "destructive"
    });
    return false;
  }

  // Criar nova solicitação de aprovação
  const newRequest: ApprovalRequest = {
    id: `req-${Date.now()}`,
    processId,
    stepId: currentStep.id,
    requesterId,
    requesterRole,
    requestDate: new Date(),
    status: 'pending',
    comments
  };

  // Adicionar à lista de aprovações pendentes
  setPendingApprovals(prev => [...prev, newRequest]);
  
  // Adicionar ao histórico de aprovações do processo
  setProcessWorkflows(prev => 
    prev.map(workflow => 
      workflow.processId === processId
        ? { 
            ...workflow, 
            approvalHistory: [...workflow.approvalHistory, newRequest] 
          }
        : workflow
    )
  );

  toast({
    title: "Solicitação de aprovação criada",
    description: `Uma nova solicitação foi criada para o processo ${processId}.`,
  });
  return true;
};
