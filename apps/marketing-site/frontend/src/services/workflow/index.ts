
// Re-export all workflow service functions
export { getWorkflowById } from './queries/getWorkflowById';
export { getWorkflowForProcess } from './queries/getWorkflowForProcess';
export { getStepById } from './queries/getStepById';
export { getCurrentStep } from './queries/getCurrentStep';
export { getNextStep } from './queries/getNextStep';
export { getApprovalHistory } from './queries/getApprovalHistory';
export { getPendingApprovalsForRole } from './queries/getPendingApprovalsForRole';

// Export workflow action functions
export { startWorkflow } from './startWorkflow';
export { createApprovalRequest } from './approvalRequests';
export { approveRequest, rejectRequest } from './approvalActions';
