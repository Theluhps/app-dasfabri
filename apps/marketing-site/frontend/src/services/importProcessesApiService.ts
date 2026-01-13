/**
 * Serviço real para comunicação com a API de processos de importação
 */
import { apiUrl, fetcher } from '@/config/api';

export interface ImportProcessCreate {
  reference_number: string;
  client: string;
  product: string;
  origin: string;
  destination: string;
  supplier: string;
  description?: string;
  ncm?: string;
  invoice_value?: number;
  currency?: string;
  import_type?: string;
  shipping_method?: string;
  incoterm?: string;
  customs_broker?: string;
  freight_forwarder?: string;
  estimated_arrival?: string;
  supplier_country?: string;
  status?: string;
}

export interface ImportProcessResponse {
  id: number;
  reference_number: string;
  client: string;
  product: string;
  origin: string;
  destination: string;
  supplier: string;
  description?: string;
  ncm?: string;
  invoice_value?: number;
  currency: string;
  status: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  estimated_arrival?: string;
  import_type?: string;
  shipping_method?: string;
  incoterm?: string;
  customs_broker?: string;
}

export interface ImportProcessUpdate {
  client?: string;
  product?: string;
  origin?: string;
  destination?: string;
  supplier?: string;
  description?: string;
  ncm?: string;
  invoice_value?: number;
  currency?: string;
  import_type?: string;
  shipping_method?: string;
  incoterm?: string;
  customs_broker?: string;
  freight_forwarder?: string;
  estimated_arrival?: string;
  actual_arrival?: string;
  customs_clearance_date?: string;
  status?: string;
  current_step?: string;
  supplier_country?: string;
}

export interface ImportProcessListParams {
  search?: string;
  status?: string;
  client?: string;
  supplier?: string;
  limit?: number;
  offset?: number;
}

/**
 * Criar novo processo de importação
 */
export const createImportProcess = async (
  data: ImportProcessCreate
): Promise<ImportProcessResponse> => {
  return fetcher<ImportProcessResponse>(apiUrl('import-processes'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Listar processos de importação
 */
export const listImportProcesses = async (
  params?: ImportProcessListParams
): Promise<ImportProcessResponse[]> => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.client) queryParams.append('client', params.client);
  if (params?.supplier) queryParams.append('supplier', params.supplier);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  const url = apiUrl('import-processes') + (queryParams.toString() ? `?${queryParams}` : '');
  return fetcher<ImportProcessResponse[]>(url);
};

/**
 * Obter processo por ID
 */
export const getImportProcessById = async (
  id: number
): Promise<ImportProcessResponse> => {
  return fetcher<ImportProcessResponse>(apiUrl(`import-processes/${id}`));
};

/**
 * Atualizar processo de importação
 */
export const updateImportProcess = async (
  id: number,
  data: ImportProcessUpdate
): Promise<ImportProcessResponse> => {
  return fetcher<ImportProcessResponse>(apiUrl(`import-processes/${id}`), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Deletar processo de importação
 */
export const deleteImportProcess = async (id: number): Promise<void> => {
  return fetcher<void>(apiUrl(`import-processes/${id}`), {
    method: 'DELETE',
  });
};

/**
 * Buscar processos (com search)
 */
export const searchImportProcesses = async (
  searchTerm: string,
  filters?: { status?: string; client?: string; supplier?: string }
): Promise<ImportProcessResponse[]> => {
  const params: ImportProcessListParams = {
    search: searchTerm,
    ...filters,
  };
  return listImportProcesses(params);
};
