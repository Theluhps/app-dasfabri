
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type ApprovalRole = 
  | 'admin'
  | 'comprador'
  | 'gerente_compras'
  | 'administrativo_importacao'
  | 'analista_importacao'
  | 'despachante_aduaneiro' 
  | 'agente_logistica'
  | 'coordenador_logistico'
  | 'financeiro'
  | 'gerente_financeiro'
  | 'operador_armazem';

export interface ApprovalStep {
  id: string;
  name: string;
  description: string;
  requiredRole: ApprovalRole;
  nextStepId?: string;
  previousStepId?: string;
}

export interface ApprovalRequest {
  id: string;
  processId: string;
  stepId: string;
  requesterId: string;
  requesterRole: ApprovalRole;
  requestDate: Date;
  status: ApprovalStatus;
  comments?: string;
  responderId?: string;
  responseDate?: Date;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  initialStepId: string;
  steps: ApprovalStep[];
}

export interface ProcessWorkflow {
  processId: string;
  workflowId: string;
  currentStepId: string;
  status: 'active' | 'completed' | 'cancelled';
  approvalHistory: ApprovalRequest[];
}
