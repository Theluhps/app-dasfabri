import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'user';
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // MODO DESENVOLVIMENTO: Em localhost, SEMPRE permitir acesso
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Em desenvolvimento, BYPASS COMPLETO - não verificar nada
  if (isDevelopment) {
    // Garantir que usuário demo existe no localStorage
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
    
    // Verificar roles apenas se necessário
    if (requiredRole || allowedRoles) {
      const userData = savedUser ? JSON.parse(savedUser) : { role: 'admin' };
      if (requiredRole && userData.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
      }
      if (allowedRoles && userData.role && !allowedRoles.includes(userData.role)) {
        return <Navigate to="/dashboard" replace />;
      }
    }
    
    // PERMITIR ACESSO DIRETO - não verificar isAuthenticated
    return <>{children}</>;
  }

  // Modo produção: verificação normal
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dasfabri-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar role específico
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar roles permitidos
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
