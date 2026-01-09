import { fetcher } from '@/config/api';

export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  ncm?: string;
  ncm_confidence?: number;
  origin_country?: string;
  weight?: number;
  unit?: string;
  category?: string;
  unit_price?: number;
  currency: string;
  supplier_id?: number;
  is_active: boolean;
  total_imports: number;
  total_exports: number;
  last_import_date?: string;
  last_export_date?: string;
  created_at: string;
}

export interface ProductCreate {
  code: string;
  name: string;
  description?: string;
  ncm?: string;
  origin_country?: string;
  weight?: number;
  unit?: string;
  category?: string;
  unit_price?: number;
  currency?: string;
  supplier_id?: number;
  metadata?: Record<string, any>;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  ncm?: string;
  ncm_confidence?: number;
  origin_country?: string;
  weight?: number;
  unit?: string;
  category?: string;
  unit_price?: number;
  currency?: string;
  supplier_id?: number;
  is_active?: boolean;
  metadata?: Record<string, any>;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  parent_category_id?: number;
  created_at: string;
}

const API_BASE = 'http://localhost:8000/api/v1/products';

export const productsService = {
  async listProducts(params?: {
    search?: string;
    category?: string;
    supplier_id?: number;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.supplier_id) queryParams.append('supplier_id', params.supplier_id.toString());
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_BASE}/${queryParams.toString() ? `?${queryParams}` : ''}`;
    return fetcher<Product[]>(url);
  },

  async getProduct(id: number): Promise<Product> {
    return fetcher<Product>(`${API_BASE}/${id}`);
  },

  async createProduct(data: ProductCreate): Promise<Product> {
    return fetcher<Product>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: number, data: ProductUpdate): Promise<Product> {
    return fetcher<Product>(`${API_BASE}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: number): Promise<void> {
    return fetcher<void>(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  },

  async classifyProduct(id: number): Promise<Product> {
    return fetcher<Product>(`${API_BASE}/${id}/classify`, {
      method: 'POST',
    });
  },

  async listCategories(): Promise<ProductCategory[]> {
    return fetcher<ProductCategory[]>(`${API_BASE}/categories/`);
  },

  async createCategory(data: { name: string; description?: string; parent_category_id?: number }): Promise<ProductCategory> {
    return fetcher<ProductCategory>(`${API_BASE}/categories/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

