/**
 * Serviço para Compliance API
 */
import { apiUrl, apiRequest } from '@/config/api';

export interface ComplianceCheck {
  id: number;
  category: string;
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  details?: string;
  action_required?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceSummary {
  total_checks: number;
  passed: number;
  failed: number;
  warnings: number;
  pending: number;
  compliance_rate: number;
}

/**
 * Obter verificações de compliance de um processo
 */
export const getComplianceChecks = async (
  processId: string
): Promise<ComplianceCheck[]> => {
  const response = await apiRequest(apiUrl(`compliance/${processId}/checks`));
  return response.json();
};

/**
 * Obter resumo de compliance
 */
export const getComplianceSummary = async (
  processId: string
): Promise<ComplianceSummary> => {
  const response = await apiRequest(apiUrl(`compliance/${processId}/summary`));
  return response.json();
};

/**
 * Executar verificação de compliance
 */
export const runComplianceCheck = async (
  processId: string
): Promise<ComplianceCheck[]> => {
  const response = await apiRequest(apiUrl(`compliance/${processId}/run`), {
    method: 'POST',
  });
  return response.json();
};

/**
 * Obter relatório de compliance
 */
export const getComplianceReport = async (
  processId: string
): Promise<Blob> => {
  const response = await apiRequest(apiUrl(`compliance/${processId}/report`));
  return response.blob();
};

/**
 * Criar verificação de compliance manual
 */
export const createComplianceCheck = async (
  processId: string,
  check: Partial<ComplianceCheck>
): Promise<ComplianceCheck> => {
  const response = await apiRequest(apiUrl(`compliance/${processId}/checks`), {
    method: 'POST',
    body: JSON.stringify(check),
  });
  return response.json();
};

/**
 * Atualizar verificação de compliance
 */
export const updateComplianceCheck = async (
  checkId: number,
  updates: Partial<ComplianceCheck>
): Promise<ComplianceCheck> => {
  const response = await apiRequest(apiUrl(`compliance/checks/${checkId}`), {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return response.json();
};

