
import { 
  Package, 
  PackageCheck, 
  DollarSign, 
  Truck, 
  Settings, 
  Bell, 
  ClipboardCheck, 
  Share2,
  Home,
  Palette,
  ShoppingBag,
  Users,
  BarChart3,
  ClipboardList,
  Activity,
  FileText,
  Warehouse,
  Star,
  MapPin,
  Sparkles,
  Building2
} from 'lucide-react';

export interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  submenu?: MenuItem[];
  modules?: string[];
}

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard'
  },
  {
    title: 'Operações',
    icon: Package,
    path: '/operations'
  },
  {
    title: 'Workflow',
    icon: ClipboardList,
    submenu: [
      { title: 'Centro de Aprovações', icon: ClipboardCheck, path: '/workflow/approvals' },
      { title: 'Construtor de Workflows', icon: ClipboardList, path: '/workflow/builder' },
    ]
  },
  {
    title: 'Pedidos de Compra',
    icon: ShoppingBag,
    submenu: [
      { title: 'Pedidos', icon: ShoppingBag, path: '/po/orders' },
      { title: 'Fornecedores', icon: Users, path: '/po/suppliers' },
      { title: 'Relatórios', icon: BarChart3, path: '/po/reports' }
    ],
    modules: ['po_management']
  },
  {
    title: 'Importação',
    icon: Package,
    submenu: [
      { title: 'Dashboard', icon: BarChart3, path: '/import/dashboard' },
      { title: 'Processos', icon: Package, path: '/import/processes' },
      { title: 'Documentos', icon: Package, path: '/import/documents' },
      { title: 'Licenças', icon: Package, path: '/import/licenses' }
    ]
  },
  {
    title: 'Exportação',
    icon: PackageCheck,
    submenu: [
      { title: 'Dashboard', icon: BarChart3, path: '/export/dashboard' },
      { title: 'Processos', icon: PackageCheck, path: '/export/processes' },
      { title: 'Documentos', icon: PackageCheck, path: '/export/documents' }
    ]
  },
  {
    title: 'Financeiro',
    icon: DollarSign,
    submenu: [
      { title: 'Dashboard', icon: BarChart3, path: '/financial/dashboard' },
      { title: 'Câmbio', icon: DollarSign, path: '/financial/exchange' },
      { title: 'Pagamentos', icon: DollarSign, path: '/financial/payments' }
    ]
  },
  {
    title: 'Logística',
    icon: Truck,
    submenu: [
      { title: 'Cargas', icon: Truck, path: '/logistics/cargo' },
      { title: 'Contêineres', icon: Truck, path: '/logistics/containers' }
    ]
  },
  {
    title: 'Parâmetros',
    icon: Settings,
    submenu: [
      { title: 'Usuários', icon: Settings, path: '/params/users' },
      { title: 'Empresas', icon: Settings, path: '/params/companies' },
      { title: 'Tema', icon: Palette, path: '/params/theme' }
    ]
  },
  {
    title: 'Notificações',
    icon: Bell,
    path: '/notifications'
  },
  {
    title: 'Auditoria',
    icon: ClipboardCheck,
    path: '/audit'
  },
  {
    title: 'Integrações',
    icon: Share2,
    path: '/integrations'
  },
  {
    title: 'Análises Avançadas',
    icon: BarChart3,
    path: '/analytics/advanced'
  },
  {
    title: 'Control Tower',
    icon: Activity,
    path: '/control-tower'
  },
  {
    title: 'Drawback',
    icon: FileText,
    path: '/drawback'
  },
  {
    title: 'Produtos',
    icon: Package,
    path: '/products'
  },
  {
    title: 'Armazéns',
    icon: Warehouse,
    path: '/warehouses'
  },
  {
    title: 'Favoritos',
    icon: Star,
    path: '/watchlist'
  },
  {
    title: 'Mapa Global',
    icon: MapPin,
    path: '/map'
  },
  {
    title: 'Classificação NCM',
    icon: Sparkles,
    path: '/classification'
  },
  {
    title: 'Alfândega',
    icon: Building2,
    path: '/customs'
  }
];
