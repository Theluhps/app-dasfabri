import { fetcher } from '@/config/api';

export interface WidgetConfig {
  id: string;
  enabled: boolean;
  position?: number;
  size?: 'small' | 'medium' | 'large';
  settings?: Record<string, any>;
}

export interface DashboardConfig {
  id: number;
  user_id: number;
  widgets_config: {
    widgets: WidgetConfig[];
  };
  layout_config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AvailableWidget {
  id: string;
  name: string;
  description: string;
}

const API_BASE = 'http://localhost:8000/api/v1/user/dashboard-config';

export const dashboardConfigService = {
  async getAvailableWidgets(): Promise<{ widgets: AvailableWidget[]; total: number }> {
    return fetcher<{ widgets: AvailableWidget[]; total: number }>(`${API_BASE}/available-widgets`);
  },

  async getConfig(): Promise<DashboardConfig> {
    return fetcher<DashboardConfig>(API_BASE);
  },

  async updateConfig(config: {
    widgets_config?: { widgets: WidgetConfig[] };
    layout_config?: Record<string, any>;
  }): Promise<DashboardConfig> {
    return fetcher<DashboardConfig>(API_BASE, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },

  async resetConfig(): Promise<DashboardConfig> {
    return fetcher<DashboardConfig>(`${API_BASE}/reset`, {
      method: 'POST',
    });
  },
};

