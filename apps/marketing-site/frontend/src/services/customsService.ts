import { fetcher } from '@/config/api';

export interface CustomsClearanceStatus {
  process_id: number;
  process_type: 'import' | 'export';
  duimp_number?: string;
  status: 'pending' | 'in_analysis' | 'approved' | 'rejected';
  customs_broker?: string;
  submitted_at?: string;
  cleared_at?: string;
  issues: string[];
}

export interface CustomsValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  required_documents: string[];
  missing_documents: string[];
}

export interface SiscomexIntegration {
  duimp_number: string;
  status: string;
  last_update: string;
  details: Record<string, any>;
}

const API_BASE = 'http://localhost:8000/api/v1/customs';

export const customsService = {
  async getCustomsStatus(processId: number, processType: 'import' | 'export'): Promise<CustomsClearanceStatus> {
    return fetcher<CustomsClearanceStatus>(`${API_BASE}/processes/${processId}/status?process_type=${processType}`);
  },

  async validateDocuments(processId: number, processType: 'import' | 'export'): Promise<CustomsValidation> {
    return fetcher<CustomsValidation>(`${API_BASE}/processes/${processId}/validate?process_type=${processType}`, {
      method: 'POST',
    });
  },

  async submitToCustoms(processId: number, processType: 'import' | 'export'): Promise<{ message: string; duimp_number?: string }> {
    return fetcher<{ message: string; duimp_number?: string }>(
      `${API_BASE}/processes/${processId}/submit?process_type=${processType}`,
      {
        method: 'POST',
      }
    );
  },

  async getSiscomexStatus(duimpNumber: string): Promise<SiscomexIntegration> {
    return fetcher<SiscomexIntegration>(`${API_BASE}/siscomex/${duimpNumber}/status`);
  },

  async syncWithSiscomex(duimpNumber: string): Promise<SiscomexIntegration> {
    return fetcher<SiscomexIntegration>(`${API_BASE}/siscomex/${duimpNumber}/sync`, {
      method: 'POST',
    });
  },
};

