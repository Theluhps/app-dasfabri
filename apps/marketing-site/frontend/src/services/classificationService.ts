import { fetcher } from '@/config/api';

export interface ClassificationRequest {
  product_name: string;
  description?: string;
  origin_country?: string;
  weight?: number;
  unit?: string;
  category?: string;
}

export interface ClassificationResponse {
  ncm: string;
  description: string;
  confidence: number;
  alternatives?: Array<{
    ncm: string;
    description: string;
    confidence: number;
  }>;
}

export interface NCMInfo {
  ncm: string;
  description: string;
  tax_rate: number;
  requires_license: boolean;
  restrictions: string[];
}

const API_BASE = 'http://localhost:8000/api/v1/classification';

export const classificationService = {
  async classifyProduct(data: ClassificationRequest): Promise<ClassificationResponse> {
    return fetcher<ClassificationResponse>(`${API_BASE}/classify`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async classifyExistingProduct(productId: number): Promise<ClassificationResponse> {
    return fetcher<ClassificationResponse>(`${API_BASE}/products/${productId}/classify`, {
      method: 'POST',
    });
  },

  async classifyImportProcess(processId: number): Promise<{ message: string; ncm: string; confidence?: number }> {
    return fetcher<{ message: string; ncm: string; confidence?: number }>(
      `${API_BASE}/processes/import/${processId}/classify`,
      {
        method: 'POST',
      }
    );
  },

  async classifyExportProcess(processId: number): Promise<{ message: string; ncm: string; confidence?: number }> {
    return fetcher<{ message: string; ncm: string; confidence?: number }>(
      `${API_BASE}/processes/export/${processId}/classify`,
      {
        method: 'POST',
      }
    );
  },

  async getNCMInfo(ncmCode: string): Promise<NCMInfo> {
    return fetcher<NCMInfo>(`${API_BASE}/ncm/${ncmCode}/info`);
  },
};

