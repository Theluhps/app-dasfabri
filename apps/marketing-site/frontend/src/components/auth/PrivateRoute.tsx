import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  // MODO DESENVOLVIMENTO: Em localhost, permitir acesso SEM verificação
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Em desenvolvimento, garantir que usuário demo existe e PERMITIR ACESSO
  if (isDevelopment) {
    // Criar usuário demo se não existir
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      const demoUser = {
        id: 1,
        name: 'Usuário Demo',
        email: 'demo@dasfabri.com',
        role: 'admin',
        company_id: 1
      };
      localStorage.setItem('auth_token', 'demo_token_' + Date.now());
      localStorage.setItem('user', JSON.stringify(demoUser));
    }
    
    // Verificar roles se necessário
    if (allowedRoles) {
      const userData = savedUser ? JSON.parse(savedUser) : { role: 'admin' };
      if (userData.role && !allowedRoles.includes(userData.role)) {
        return <Navigate to="/dashboard" replace />;
      }
    }
    
    // Permitir acesso em desenvolvimento - BYPASS COMPLETO
    return <Outlet />;
  }

  // Modo produção: verificação normal
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
