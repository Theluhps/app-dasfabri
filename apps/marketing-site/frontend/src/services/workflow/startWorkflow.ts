
import { ProcessWorkflow, WorkflowDefinition } from '@/types/workflow';
import { toast } from '@/hooks/use-toast';

export const startWorkflow = (
  processId: string, 
  workflowId: string,
  workflows: WorkflowDefinition[],
  processWorkflows: ProcessWorkflow[],
  setProcessWorkflows: React.Dispatch<React.SetStateAction<ProcessWorkflow[]>>
): boolean => {
  // Verificar se o processo já tem um workflow
  const existingWorkflow = processWorkflows.find(w => w.processId === processId);
  if (existingWorkflow) {
    toast({
      title: "Erro ao iniciar workflow",
      description: `O processo ${processId} já possui um workflow em andamento.`,
      variant: "destructive"
    });
    return false;
  }

  // Verificar se o workflow existe
  const workflow = workflows.find(w => w.id === workflowId);
  if (!workflow) {
    toast({
      title: "Erro ao iniciar workflow",
      description: "O tipo de workflow selecionado não foi encontrado.",
      variant: "destructive"
    });
    return false;
  }

  // Criar novo workflow para o processo
  const newProcessWorkflow: ProcessWorkflow = {
    processId,
    workflowId,
    currentStepId: workflow.initialStepId,
    status: 'active',
    approvalHistory: []
  };

  // Adicionar à lista de workflows de processos
  setProcessWorkflows(prev => [...prev, newProcessWorkflow]);

  toast({
    title: "Workflow iniciado",
    description: `Um novo workflow do tipo "${workflow.name}" foi iniciado para o processo ${processId}.`
  });
  return true;
};
