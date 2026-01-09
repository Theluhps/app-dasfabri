
import { WorkflowDefinition } from '@/types/workflow';

export const getWorkflowById = (workflows: WorkflowDefinition[], id: string): WorkflowDefinition | undefined => {
  return workflows.find(workflow => workflow.id === id);
};
