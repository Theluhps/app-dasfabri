import React, { createContext, useState, useEffect } from 'react';
import { ApprovalRequest, ApprovalRole, ProcessWorkflow, WorkflowDefinition, ApprovalStep } from '@/types/workflow';

// Services - Import from the new refactored location
import { 
  getWorkflowById, 
  getWorkflowForProcess, 
  getStepById,
  getCurrentStep,
  getNextStep,
  getApprovalHistory,
  getPendingApprovalsForRole,
  startWorkflow,
  createApprovalRequest,
  approveRequest,
  rejectRequest
} from '@/services/workflow';

// Mock data para fluxos de trabalho
import { workflowDefinitions } from '@/data/workflowDefinitions';

interface WorkflowContextType {
  workflows: WorkflowDefinition[];
  processWorkflows: ProcessWorkflow[];
  pendingApprovals: ApprovalRequest[];
  getWorkflowById: (id: string) => WorkflowDefinition | undefined;
  getWorkflowForProcess: (processId: string) => ProcessWorkflow | undefined;
  getStepById: (workflowId: string, stepId: string) => ApprovalStep | undefined;
  getCurrentStep: (processId: string) => ApprovalStep | undefined;
  getNextStep: (processId: string) => ApprovalStep | undefined;
  createApprovalRequest: (processId: string, requesterId: string, requesterRole: ApprovalRole, comments?: string) => void;
  approveRequest: (requestId: string, responderId: string, comments?: string) => void;
  rejectRequest: (requestId: string, responderId: string, comments?: string) => void;
  startWorkflow: (processId: string, workflowId: string) => void;
  getApprovalHistory: (processId: string) => ApprovalRequest[];
  getPendingApprovalsForRole: (role: ApprovalRole) => ApprovalRequest[];
}

export const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [processWorkflows, setProcessWorkflows] = useState<ProcessWorkflow[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);

  // Inicializar com dados mock
  useEffect(() => {
    setWorkflows(workflowDefinitions);

    // Dados mock para demonstração
    const mockProcessWorkflows: ProcessWorkflow[] = [
      {
        processId: 'IMP-2023-001',
        workflowId: 'purchase-order-flow',
        currentStepId: 'po-creation',
        status: 'active',
        approvalHistory: []
      },
      {
        processId: 'IMP-2023-002',
        workflowId: 'documents-validation-flow',
        currentStepId: 'doc-validation',
        status: 'active',
        approvalHistory: []
      }
    ];

    setProcessWorkflows(mockProcessWorkflows);
  }, []);

  // Wrapper functions that use our services but maintain the same API
  const handleGetWorkflowById = (id: string) => getWorkflowById(workflows, id);
  
  const handleGetWorkflowForProcess = (processId: string) => getWorkflowForProcess(processWorkflows, processId);
  
  const handleGetStepById = (workflowId: string, stepId: string) => getStepById(workflows, workflowId, stepId);
  
  const handleGetCurrentStep = (processId: string) => getCurrentStep(processWorkflows, workflows, processId);
  
  const handleGetNextStep = (processId: string) => getNextStep(processWorkflows, workflows, processId);
  
  const handleStartWorkflow = (processId: string, workflowId: string) => {
    startWorkflow(processId, workflowId, workflows, processWorkflows, setProcessWorkflows);
  };
  
  const handleCreateApprovalRequest = (
    processId: string, 
    requesterId: string, 
    requesterRole: ApprovalRole, 
    comments?: string
  ) => {
    createApprovalRequest(
      processId, 
      requesterId, 
      requesterRole, 
      processWorkflows,
      workflows,
      setPendingApprovals,
      setProcessWorkflows,
      comments
    );
  };
  
  const handleApproveRequest = (requestId: string, responderId: string, comments?: string) => {
    approveRequest(
      requestId,
      responderId,
      pendingApprovals,
      processWorkflows,
      workflows,
      setPendingApprovals,
      setProcessWorkflows,
      comments
    );
  };
  
  const handleRejectRequest = (requestId: string, responderId: string, comments?: string) => {
    rejectRequest(
      requestId, 
      responderId, 
      pendingApprovals,
      setPendingApprovals,
      setProcessWorkflows,
      comments
    );
  };
  
  const handleGetApprovalHistory = (processId: string) => getApprovalHistory(processWorkflows, processId);
  
  const handleGetPendingApprovalsForRole = (role: ApprovalRole) => {
    return getPendingApprovalsForRole(pendingApprovals, processWorkflows, workflows, role);
  };

  const value = {
    workflows,
    processWorkflows,
    pendingApprovals,
    getWorkflowById: handleGetWorkflowById,
    getWorkflowForProcess: handleGetWorkflowForProcess,
    getStepById: handleGetStepById,
    getCurrentStep: handleGetCurrentStep,
    getNextStep: handleGetNextStep,
    createApprovalRequest: handleCreateApprovalRequest,
    approveRequest: handleApproveRequest,
    rejectRequest: handleRejectRequest,
    startWorkflow: handleStartWorkflow,
    getApprovalHistory: handleGetApprovalHistory,
    getPendingApprovalsForRole: handleGetPendingApprovalsForRole
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};
