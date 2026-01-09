import { useAuth } from '@/contexts/AuthContext';

interface AuthorizationProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'operator' | 'viewer';
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

export function Authorization({ 
  children, 
  requiredRole, 
  allowedRoles, 
  fallback = null 
}: AuthorizationProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  // Verificar role específico
  if (requiredRole && user.role !== requiredRole) {
    return fallback;
  }

  // Verificar roles permitidos
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return fallback;
  }

  return <>{children}</>;
}

// Hooks de autorização para facilitar o uso
export function useAuthorization() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isOperator = user?.role === 'operator';
  const isViewer = user?.role === 'viewer';

  const canManageUsers = isAdmin || isManager;
  const canViewFinancialReports = isAdmin || isManager;
  const canApproveWorkflows = isAdmin || isManager;
  const canDeleteRecords = isAdmin;
  const canManageCompanySettings = isAdmin || isManager;
  const canViewAnalytics = isAdmin || isManager || isOperator;

  return {
    user,
    isAdmin,
    isManager,
    isOperator,
    isViewer,
    canManageUsers,
    canViewFinancialReports,
    canApproveWorkflows,
    canDeleteRecords,
    canManageCompanySettings,
    canViewAnalytics,
  };
}

// Componente para mostrar/esconder elementos baseado em permissões
export function ShowIf({ 
  condition, 
  children, 
  fallback = null 
}: { 
  condition: boolean; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return condition ? <>{children}</> : <>{fallback}</>;
}

// Componente para mostrar/esconder elementos baseado em role
export function ShowForRole({ 
  role, 
  children, 
  fallback = null 
}: { 
  role: 'admin' | 'manager' | 'operator' | 'viewer'; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();
  return user?.role === role ? <>{children}</> : <>{fallback}</>;
}

// Componente para mostrar/esconder elementos baseado em roles permitidos
export function ShowForRoles({ 
  roles, 
  children, 
  fallback = null 
}: { 
  roles: string[]; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();
  return user && roles.includes(user.role) ? <>{children}</> : <>{fallback}</>;
} 