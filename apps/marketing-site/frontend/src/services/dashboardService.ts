/**
 * Serviço para Dashboard API
 */
import { apiUrl, apiRequest } from '@/config/api';

export interface PredictiveKPI {
  name: string;
  current_value: number;
  predicted_value: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  unit?: string;
}

export interface ProactiveAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  related_entity?: string;
  action_url?: string;
  created_at: string;
}

export interface PerformanceData {
  period: string;
  metrics: {
    [key: string]: number;
  };
}

/**
 * Obter KPIs preditivos
 */
export const getPredictiveKPIs = async (): Promise<PredictiveKPI[]> => {
  const response = await apiRequest(apiUrl('dashboard/predictive-kpis'));
  return response.json();
};

/**
 * Obter alertas proativos
 */
export const getProactiveAlerts = async (): Promise<ProactiveAlert[]> => {
  const response = await apiRequest(apiUrl('dashboard/proactive-alerts'));
  return response.json();
};

/**
 * Obter dados de performance
 */
export const getPerformanceData = async (
  period: 'week' | 'month' | 'quarter' | 'year' = 'month'
): Promise<PerformanceData[]> => {
  const params = new URLSearchParams({ period });
  const response = await apiRequest(apiUrl(`dashboard/performance-data?${params}`));
  return response.json();
};

