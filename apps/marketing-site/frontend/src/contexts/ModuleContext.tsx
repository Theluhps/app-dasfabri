
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ModuleType, UserRole, MODULES } from '@/types/modules';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  modules: ModuleType[];
  department?: string;
  company?: string;
  lastLogin?: string;
}

interface ModuleContextType {
  currentModule: ModuleType;
  setCurrentModule: (module: ModuleType) => void;
  userModules: ModuleType[];
  hasAccessToModule: (module: ModuleType) => boolean;
  hasAccessToRoute: (path: string) => boolean;
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  isManager: boolean;
  isOperator: boolean;
  isViewer: boolean;
  moduleColor: string;
  navigateToModules: () => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

// Usando um objeto history "falso" quando não estivermos no contexto do Router
const createFallbackHistory = () => {
  return {
    navigate: (path: string) => {
      console.warn('Navegação tentada fora do contexto do Router:', path);
      // Uma fallback que não faz nada, apenas previne erros
    }
  };
};

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  // Mock user for development - in production this would come from authentication
  const [user] = useState<User>({
    id: '1',
    name: 'João da Silva',
    email: 'joao@exemplo.com',
    role: 'manager',
    modules: ['import_full', 'po_management'],
    department: 'Comércio Exterior',
    company: 'Dasfabri Ltda',
    lastLogin: '2025-05-10T14:30:00'
  });

  const [currentModule, setCurrentModule] = useState<ModuleType>('import_full');
  
  // Não usaremos mais o useNavigate diretamente aqui
  const location = useLocation();

  const userModules = user?.modules || [];
  const role = user?.role || null;
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const isOperator = role === 'operator';
  const isViewer = role === 'viewer';

  // Rotas especiais que todos podem acessar
  const globalRoutes = [
    '/dashboard',
    '/workflow',
    '/params',
    '/notifications',
    '/audit',
    '/integrations',
    '/analytics'
  ];

  const hasAccessToModule = (module: ModuleType): boolean => {
    return isAdmin || isManager || userModules.includes(module);
  };

  const hasAccessToRoute = (path: string): boolean => {
    // Admin and managers have access to all routes
    if (isAdmin || isManager) return true;

    // Check if path is in global routes
    if (globalRoutes.some(route => path.startsWith(route))) {
      return true;
    }

    // Check if current user has a module that gives access to this route
    return userModules.some(moduleId => {
      const module = MODULES[moduleId];
      return module.routes.some(route => path.startsWith(route));
    });
  };

  // Get the current module color
  const moduleColor = MODULES[currentModule]?.color || '#7E69AB';

  // Função para navegação para a página de módulos
  // Esta função será usada pelos componentes que têm acesso ao Router
  const navigateToModules = () => {
    // Ao invés de navegar diretamente, emitimos um evento personalizado
    // que será capturado pelo componente App ou outro componente que tenha acesso ao Router
    const event = new CustomEvent('navigate-to-modules');
    window.dispatchEvent(event);
    
    // Também podemos usar o toast para feedback do usuário
    toast({
      title: "Acesso restrito",
      description: "Você não tem acesso a esta página com o módulo atual.",
      variant: "destructive",
    });
  };

  // Check path access when location changes and redirect if necessary
  useEffect(() => {
    if (!hasAccessToRoute(location.pathname) && location.pathname !== '/auth/login' && location.pathname !== '/modules') {
      // Usamos o método de evento customizado para redirecionar
      navigateToModules();
    }

    // Try to determine the active module based on the current path
    const determineModule = () => {
      // Special case for dashboard which exists in all modules
      if (location.pathname === '/dashboard') {
        return currentModule; // Keep current module if on dashboard
      }

      // Try to match the current path to a specific module
      for (const moduleId of userModules) {
        const module = MODULES[moduleId];
        const matchingRoute = module.routes.find(route => 
          location.pathname.startsWith(route) && route !== '/dashboard'
        );
        
        if (matchingRoute) {
          return moduleId;
        }
      }

      // Default to first available module
      return userModules[0] || 'import_full';
    };

    const activeModule = determineModule();
    if (activeModule && activeModule !== currentModule) {
      setCurrentModule(activeModule);
    }
  }, [location.pathname, userModules, hasAccessToRoute, currentModule]);

  return (
    <ModuleContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        userModules,
        hasAccessToModule,
        hasAccessToRoute,
        user,
        role,
        isAdmin,
        isManager,
        isOperator,
        isViewer,
        moduleColor,
        navigateToModules,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModule must be used within a ModuleProvider');
  }
  return context;
}
