import { fetcher } from '@/config/api';

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status: string;
  total_capacity?: number;
  used_capacity: number;
  created_at: string;
}

export interface WarehouseCreate {
  code: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  total_capacity?: number;
}

export interface WarehouseUpdate {
  name?: string;
  description?: string;
  address?: string;
  status?: string;
  total_capacity?: number;
}

export interface InventoryItem {
  id: number;
  warehouse_id: number;
  product_id?: number;
  quantity: number;
  unit?: string;
  location?: string;
  is_available: boolean;
  is_reserved: boolean;
  entry_date: string;
}

export interface InventoryItemCreate {
  product_id?: number;
  import_process_id?: number;
  export_process_id?: number;
  quantity: number;
  unit?: string;
  location?: string;
  batch_number?: string;
  expiration_date?: string;
}

export interface StockMovement {
  id: number;
  movement_type: string;
  warehouse_id: number;
  quantity: number;
  unit?: string;
  movement_date: string;
  reference_number?: string;
}

export interface StockMovementCreate {
  movement_type: 'entry' | 'exit' | 'transfer' | 'adjustment';
  inventory_item_id?: number;
  product_id?: number;
  import_process_id?: number;
  export_process_id?: number;
  quantity: number;
  unit?: string;
  reference_number?: string;
  notes?: string;
}

const API_BASE = 'http://localhost:8000/api/v1/warehouses';

export const warehousesService = {
  async listWarehouses(): Promise<Warehouse[]> {
    return fetcher<Warehouse[]>(API_BASE);
  },

  async getWarehouse(id: number): Promise<Warehouse> {
    return fetcher<Warehouse>(`${API_BASE}/${id}`);
  },

  async createWarehouse(data: WarehouseCreate): Promise<Warehouse> {
    return fetcher<Warehouse>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateWarehouse(id: number, data: WarehouseUpdate): Promise<Warehouse> {
    return fetcher<Warehouse>(`${API_BASE}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getInventory(warehouseId: number): Promise<InventoryItem[]> {
    return fetcher<InventoryItem[]>(`${API_BASE}/${warehouseId}/inventory`);
  },

  async addInventoryItem(warehouseId: number, data: InventoryItemCreate): Promise<InventoryItem> {
    return fetcher<InventoryItem>(`${API_BASE}/${warehouseId}/inventory`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMovements(warehouseId: number): Promise<StockMovement[]> {
    return fetcher<StockMovement[]>(`${API_BASE}/${warehouseId}/movements`);
  },

  async createMovement(warehouseId: number, data: StockMovementCreate): Promise<StockMovement> {
    return fetcher<StockMovement>(`${API_BASE}/${warehouseId}/movements`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

