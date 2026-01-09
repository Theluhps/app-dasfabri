export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  status: 'active' | 'inactive';
  last_login?: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export const users: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@empresaabc.com',
    role: 'admin',
    department: 'Comercial',
    status: 'active',
    last_login: '2024-03-15T14:30:00',
    company_id: 1, // Empresa ABC Ltda
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-03-15T14:30:00'
  },
  {
    id: 2,
    name: 'Maria Souza',
    email: 'maria.souza@xyzimportadora.com',
    role: 'manager',
    department: 'Importação',
    status: 'active',
    last_login: '2024-03-15T10:15:00',
    company_id: 2, // XYZ Importadora S.A.
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-03-15T10:15:00'
  },
  {
    id: 3,
    name: 'Pedro Santos',
    email: 'pedro.santos@transportesrapidos.com',
    role: 'user',
    department: 'Logística',
    status: 'active',
    last_login: '2024-03-14T16:45:00',
    company_id: 3, // Transportes Rápidos Ltda
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-03-14T16:45:00'
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    email: 'ana.oliveira@globaltrading.com',
    role: 'manager',
    department: 'Comércio Exterior',
    status: 'inactive',
    last_login: '2024-03-02T09:20:00',
    company_id: 4, // Global Trading Corp
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-03-02T09:20:00'
  },
  {
    id: 5,
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@industriasreunidas.com',
    role: 'user',
    department: 'Manufatura',
    status: 'active',
    last_login: '2024-03-15T08:10:00',
    company_id: 5, // Indústrias Reunidas S.A.
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-03-15T08:10:00'
  }
]; 