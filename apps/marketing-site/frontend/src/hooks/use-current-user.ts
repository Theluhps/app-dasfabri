
import { useState } from 'react';
import { ApprovalRole } from '@/types/workflow';

interface User {
  id: string;
  name: string;
  role: ApprovalRole;
  email: string;
}

export const useCurrentUser = () => {
  // Normalmente isso seria uma chamada de API ou vindo de um contexto de autenticação
  // Para fins de demonstração, estamos usando dados estáticos
  const [currentUser, _setCurrentUser] = useState<User>({
    id: 'user-123',
    name: 'João Silva',
    role: 'comprador',
    email: 'joao.silva@empresa.com'
  });

  // Mock função para mudar papéis para teste
  const changeUserRole = (newRole: ApprovalRole) => {
    _setCurrentUser(prev => ({
      ...prev,
      role: newRole
    }));
  };

  return {
    currentUser,
    changeUserRole
  };
};
