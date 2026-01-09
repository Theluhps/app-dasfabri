
import { ProcessWorkflow } from '@/types/workflow';

export const getWorkflowForProcess = (processWorkflows: ProcessWorkflow[], processId: string): ProcessWorkflow | undefined => {
  return processWorkflows.find(workflow => workflow.processId === processId);
};
