import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  company_id: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // MODO DESENVOLVIMENTO: Sempre autenticado em localhost
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Usuário demo padrão
  const demoUser: User = {
    id: 1,
    name: 'Usuário Demo',
    email: 'demo@dasfabri.com',
    role: 'admin',
    company_id: 1
  };
  
  // Em desenvolvimento, SEMPRE retornar usuário demo
  const getInitialUser = (): User | null => {
    if (isDevelopment) {
      // Garantir que está salvo no localStorage
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');
      
      if (!token || !savedUser) {
        localStorage.setItem('auth_token', 'demo_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(demoUser));
      }
      
      // Sempre retornar usuário demo em desenvolvimento
      return demoUser;
    }
    
    // Modo produção: verificar localStorage
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  
  const [user, setUser] = useState<User | null>(getInitialUser());
  const [loading, setLoading] = useState(false); // Em dev, não carrega
  const navigate = useNavigate();

  useEffect(() => {
    // Em desenvolvimento, garantir que usuário está sempre presente
    if (isDevelopment) {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');
      
      if (!token || !savedUser) {
        localStorage.setItem('auth_token', 'demo_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(demoUser));
        setUser(demoUser);
      } else if (!user) {
        // Se não tem usuário no estado mas tem no localStorage
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (e) {
          setUser(demoUser);
        }
      }
      setLoading(false);
      return;
    }
    
    // Modo produção: verificar token normalmente
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setLoading(false);
        return;
      } catch (e) {
        // Se não conseguir parsear, tentar buscar do servidor
      }
    }
    
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, [navigate, isDevelopment, user]);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.access_token);
      setUser(data.user);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  // Em desenvolvimento, SEMPRE retornar isAuthenticated = true
  const isAuthenticated = isDevelopment ? true : !!user;

  return (
    <AuthContext.Provider value={{
      user: isDevelopment ? (user || demoUser) : user,
      loading,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
