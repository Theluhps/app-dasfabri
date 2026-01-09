import { fetcher } from '@/config/api';
import { Process } from '@/components/import/processes/data/types';

const API_BASE = 'http://localhost:8000/api/v1/import-processes';

export interface WatchlistResponse {
  process_id: number;
  is_favorite: boolean;
  message: string;
}

export const watchlistService = {
  /**
   * Alternar status de favorito de um processo
   */
  async toggleFavorite(processId: number): Promise<WatchlistResponse> {
    return fetcher<WatchlistResponse>(`${API_BASE}/${processId}/favorite`, {
      method: 'POST',
    });
  },

  /**
   * Listar processos favoritos
   */
  async getFavorites(params?: {
    limit?: number;
    offset?: number;
  }): Promise<Process[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_BASE}/favorites${queryParams.toString() ? `?${queryParams}` : ''}`;
    return fetcher<Process[]>(url);
  },
};

