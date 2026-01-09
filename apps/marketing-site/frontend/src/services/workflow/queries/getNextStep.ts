
import { ApprovalStep, ProcessWorkflow, WorkflowDefinition } from '@/types/workflow';
import { getCurrentStep } from './getCurrentStep';
import { getWorkflowForProcess } from './getWorkflowForProcess';
import { getWorkflowById } from './getWorkflowById';

export const getNextStep = (
  processWorkflows: ProcessWorkflow[],
  workflows: WorkflowDefinition[],
  processId: string
): ApprovalStep | undefined => {
  const currentStep = getCurrentStep(processWorkflows, workflows, processId);
  if (!currentStep || !currentStep.nextStepId) return undefined;
  
  const processWorkflow = getWorkflowForProcess(processWorkflows, processId);
  if (!processWorkflow) return undefined;
  
  const workflow = getWorkflowById(workflows, processWorkflow.workflowId);
  if (!workflow) return undefined;
  
  return workflow.steps.find(step => step.id === currentStep.nextStepId);
};
