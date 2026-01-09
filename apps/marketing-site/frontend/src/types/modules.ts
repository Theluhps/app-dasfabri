
export type ModuleType = 
  | 'import_full' 
  | 'po_management' 
  | 'shipment_management' 
  | 'payment_documents'
  | 'export_full';

export interface Module {
  id: ModuleType;
  name: string;
  description: string;
  features: string[];
  routes: string[];
  color?: string;
  primaryFeature?: string;
}

export interface UserModuleAccess {
  moduleId: ModuleType;
  hasAccess: boolean;
}

export type UserRole = 
  | 'admin'
  | 'manager'
  | 'operator'
  | 'viewer';

export const MODULES: Record<ModuleType, Module> = {
  import_full: {
    id: 'import_full',
    name: 'Import Full',
    description: 'Sistema completo de gestão de importação',
    primaryFeature: 'Gestão completa de processos de importação',
    color: '#7E69AB',
    features: [
      'Orders (Pedidos)',
      'Transporte Internacional',
      'Alfândega',
      'Entrega',
      'Câmbio',
      'Notas e Despesas',
      'Nota Fiscal',
      'Analytics'
    ],
    routes: [
      '/dashboard',
      '/import',
      '/export',
      '/financial',
      '/logistics',
      '/operations',
      '/params',
      '/notifications',
      '/audit',
      '/integrations'
    ]
  },
  po_management: {
    id: 'po_management',
    name: 'PO Management',
    description: 'Gestão de Pedidos de Compra',
    primaryFeature: 'Controle de pedidos internacionais',
    color: '#3B82F6', // blue-500
    features: [
      'Orders',
      'Transporte Internacional',
      'Alfândega',
      'Entrega',
      'Analytics'
    ],
    routes: [
      '/dashboard',
      '/import/processes',
      '/import/processes-advanced',
      '/import/process',
      '/import/dashboard',
      '/logistics/cargo',
      '/logistics/containers',
      '/notifications'
    ]
  },
  shipment_management: {
    id: 'shipment_management',
    name: 'Shipment Management',
    description: 'Gestão de Embarques',
    primaryFeature: 'Controle de transporte e embarques',
    color: '#22C55E', // green-500
    features: [
      'Transporte Internacional',
      'Alfândega',
      'Entrega',
      'Analytics'
    ],
    routes: [
      '/dashboard',
      '/import/documents',
      '/logistics/cargo',
      '/logistics/containers',
      '/import/licenses',
      '/notifications'
    ]
  },
  payment_documents: {
    id: 'payment_documents',
    name: 'Payment Documents',
    description: 'Gestão de Documentos de Pagamento',
    primaryFeature: 'Gerenciamento financeiro e pagamentos',
    color: '#F59E0B', // amber-500
    features: [
      'Notas e Despesas',
      'Nota Fiscal',
      'Analytics'
    ],
    routes: [
      '/dashboard',
      '/financial/exchange',
      '/financial/payments',
      '/financial/dashboard',
      '/notifications'
    ]
  },
  export_full: {
    id: 'export_full',
    name: 'Export Full',
    description: 'Sistema completo de gestão de exportação',
    primaryFeature: 'Gestão completa de processos de exportação',
    color: '#EC4899', // pink-500
    features: [
      'Orders (Pedidos)',
      'Transporte Internacional',
      'Alfândega',
      'Documentos de Exportação',
      'Câmbio',
      'Analytics'
    ],
    routes: [
      '/dashboard',
      '/export/dashboard',
      '/export/processes',
      '/export/documents',
      '/financial',
      '/logistics',
      '/notifications'
    ]
  }
};
