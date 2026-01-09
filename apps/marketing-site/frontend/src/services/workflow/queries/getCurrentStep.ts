
import { ApprovalStep, ProcessWorkflow, WorkflowDefinition } from '@/types/workflow';
import { getWorkflowForProcess } from './getWorkflowForProcess';
import { getWorkflowById } from './getWorkflowById';

export const getCurrentStep = (
  processWorkflows: ProcessWorkflow[],
  workflows: WorkflowDefinition[],
  processId: string
): ApprovalStep | undefined => {
  const processWorkflow = getWorkflowForProcess(processWorkflows, processId);
  if (!processWorkflow) return undefined;
  
  const workflow = getWorkflowById(workflows, processWorkflow.workflowId);
  if (!workflow) return undefined;
  
  return workflow.steps.find(step => step.id === processWorkflow.currentStepId);
};
