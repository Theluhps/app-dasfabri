
import { ApprovalRequest, ApprovalRole, ProcessWorkflow, WorkflowDefinition } from '@/types/workflow';
import { getWorkflowForProcess } from './getWorkflowForProcess';
import { getStepById } from './getStepById';

export const getPendingApprovalsForRole = (
  pendingApprovals: ApprovalRequest[], 
  processWorkflows: ProcessWorkflow[],
  workflows: WorkflowDefinition[],
  role: ApprovalRole
): ApprovalRequest[] => {
  return pendingApprovals.filter(req => {
    const processWorkflow = getWorkflowForProcess(processWorkflows, req.processId);
    if (!processWorkflow) return false;
    
    const currentStep = getStepById(workflows, processWorkflow.workflowId, req.stepId);
    return currentStep?.requiredRole === role;
  });
};
