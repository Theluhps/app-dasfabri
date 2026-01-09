import { fetcher } from '@/config/api';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  task_type: 'document' | 'license' | 'logistics' | 'financial' | 'compliance' | 'administrative' | 'other';
  due_date: string;
  completed_at?: string;
  process_id?: number;
  process_type?: string;
  assigned_to?: number;
  created_by: number;
  company_id: number;
  notes?: string;
  is_urgent: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  task_type?: 'document' | 'license' | 'logistics' | 'financial' | 'compliance' | 'administrative' | 'other';
  due_date: string;
  process_id?: number;
  process_type?: string;
  assigned_to?: number;
  notes?: string;
  is_urgent?: boolean;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  task_type?: 'document' | 'license' | 'logistics' | 'financial' | 'compliance' | 'administrative' | 'other';
  due_date?: string;
  assigned_to?: number;
  notes?: string;
  is_urgent?: boolean;
}

const API_BASE = 'http://localhost:8000/api/v1/tasks';

export const tasksService = {
  async listTasks(params?: {
    status?: string;
    priority?: string;
    assigned_to?: number;
    process_id?: number;
    pending_only?: boolean;
    overdue_only?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Task[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.assigned_to) queryParams.append('assigned_to', params.assigned_to.toString());
    if (params?.process_id) queryParams.append('process_id', params.process_id.toString());
    if (params?.pending_only) queryParams.append('pending_only', 'true');
    if (params?.overdue_only) queryParams.append('overdue_only', 'true');
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_BASE}${queryParams.toString() ? `?${queryParams}` : ''}`;
    return fetcher<Task[]>(url);
  },

  async getPendingTasks(limit?: number): Promise<Task[]> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    const url = `${API_BASE}/pending${queryParams.toString() ? `?${queryParams}` : ''}`;
    return fetcher<Task[]>(url);
  },

  async getOverdueTasks(limit?: number): Promise<Task[]> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    const url = `${API_BASE}/overdue${queryParams.toString() ? `?${queryParams}` : ''}`;
    return fetcher<Task[]>(url);
  },

  async getTask(id: number): Promise<Task> {
    return fetcher<Task>(`${API_BASE}/${id}`);
  },

  async createTask(data: TaskCreate): Promise<Task> {
    return fetcher<Task>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTask(id: number, data: TaskUpdate): Promise<Task> {
    return fetcher<Task>(`${API_BASE}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteTask(id: number): Promise<void> {
    return fetcher<void>(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  },

  async completeTask(id: number): Promise<Task> {
    return fetcher<Task>(`${API_BASE}/${id}/complete`, {
      method: 'POST',
    });
  },
};

