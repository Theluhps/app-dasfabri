import { fetcher } from '@/config/api';

export interface MapShipmentPoint {
  shipment_id: string;
  container_number?: string;
  process_id?: number;
  process_type: 'import' | 'export' | 'unknown';
  latitude: number;
  longitude: number;
  location: string;
  status: string;
  vessel?: string;
  origin: string;
  destination: string;
  last_update: string;
  description?: string;
}

export interface MapDataResponse {
  shipments: MapShipmentPoint[];
  total: number;
}

const API_BASE = 'http://localhost:8000/api/v1/tracking';

export const mapService = {
  async getMapData(status?: string): Promise<MapDataResponse> {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    const url = `${API_BASE}/map-data${queryParams.toString() ? `?${queryParams}` : ''}`;
    return fetcher<MapDataResponse>(url);
  },
};

