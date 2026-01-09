
import { ApprovalStep, WorkflowDefinition } from '@/types/workflow';
import { getWorkflowById } from './getWorkflowById';

export const getStepById = (
  workflows: WorkflowDefinition[], 
  workflowId: string, 
  stepId: string
): ApprovalStep | undefined => {
  const workflow = getWorkflowById(workflows, workflowId);
  if (!workflow) return undefined;
  return workflow.steps.find(step => step.id === stepId);
};
