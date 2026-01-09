/**
 * Configuração da API
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_VERSION = 'v1';

/**
 * Helper para construir URLs da API
 */
export const apiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/api/${API_VERSION}/${cleanEndpoint}`;
};

/**
 * Helper para fazer requisições autenticadas
 */
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response;
};

/**
 * Helper para fazer requisições com upload de arquivo
 */
export const apiRequestFile = async (
  url: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    method: options.method || 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response;
};

/**
 * Helper simplificado para fazer requisições e retornar JSON
 */
export const fetcher = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Verificar se a requisição falhou por conexão
    if (!response.ok) {
      // Se for erro de conexão (network error)
      if (response.status === 0 || response.type === 'error') {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8000');
      }
      
      const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Se a resposta for vazia (204 No Content), retorna void
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // Capturar erros de rede (CORS, conexão, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8000');
    }
    throw error;
  }
};

