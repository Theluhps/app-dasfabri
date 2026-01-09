/**
 * Serviço para Tracking API
 */
import { apiUrl, apiRequest } from '@/config/api';

export interface TrackingEvent {
  id: number;
  timestamp: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
  description: string;
  source?: string;
  vessel?: string;
  port?: string;
}

export interface TrackingStatus {
  shipment_id: string;
  current_status: string;
  current_location?: string;
  last_update: string;
  estimated_arrival?: string;
  events: TrackingEvent[];
}

/**
 * Obter status atual de rastreamento
 */
export const getTrackingStatus = async (shipmentId: string): Promise<TrackingStatus> => {
  const response = await apiRequest(apiUrl(`tracking/${shipmentId}`));
  return response.json();
};

/**
 * Obter histórico de eventos de rastreamento
 */
export const getTrackingEvents = async (shipmentId: string): Promise<TrackingEvent[]> => {
  const response = await apiRequest(apiUrl(`tracking/${shipmentId}/events`));
  return response.json();
};

/**
 * Atualizar informações de rastreamento
 */
export const refreshTracking = async (shipmentId: string): Promise<TrackingStatus> => {
  const response = await apiRequest(apiUrl(`tracking/${shipmentId}/refresh`), {
    method: 'POST',
  });
  return response.json();
};

/**
 * Criar novo evento de rastreamento
 */
export const createTrackingEvent = async (
  shipmentId: string,
  event: Partial<TrackingEvent>
): Promise<TrackingEvent> => {
  const response = await apiRequest(apiUrl(`tracking/${shipmentId}/events`), {
    method: 'POST',
    body: JSON.stringify(event),
  });
  return response.json();
};

