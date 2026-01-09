
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
  Palette
} from 'lucide-react';

export interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  submenu?: MenuItem[];
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
    title: 'Importação',
    icon: Package,
    submenu: [
      { title: 'Processos', icon: Package, path: '/import/processes' },
      { title: 'Documentos', icon: Package, path: '/import/documents' },
      { title: 'Licenças', icon: Package, path: '/import/licenses' }
    ]
  },
  {
    title: 'Exportação',
    icon: PackageCheck,
    submenu: [
      { title: 'Processos', icon: PackageCheck, path: '/export/processes' },
      { title: 'Documentos', icon: PackageCheck, path: '/export/documents' }
    ]
  },
  {
    title: 'Financeiro',
    icon: DollarSign,
    submenu: [
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
  }
];
