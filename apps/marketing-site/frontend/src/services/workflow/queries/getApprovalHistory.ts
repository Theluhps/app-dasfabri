
import { ApprovalRequest, ProcessWorkflow } from '@/types/workflow';
import { getWorkflowForProcess } from './getWorkflowForProcess';

export const getApprovalHistory = (
  processWorkflows: ProcessWorkflow[], 
  processId: string
): ApprovalRequest[] => {
  const processWorkflow = getWorkflowForProcess(processWorkflows, processId);
  if (!processWorkflow) return [];
  
  return processWorkflow.approvalHistory;
};
