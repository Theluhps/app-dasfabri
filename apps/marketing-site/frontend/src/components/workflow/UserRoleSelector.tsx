
import React from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { ApprovalRole } from '@/types/workflow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const roles: { value: ApprovalRole; label: string }[] = [
  { value: 'comprador', label: 'Comprador' },
  { value: 'gerente_compras', label: 'Gerente de Compras' },
  { value: 'administrativo_importacao', label: 'Administrativo de Importação' },
  { value: 'analista_importacao', label: 'Analista de Importação' },
  { value: 'despachante_aduaneiro', label: 'Despachante Aduaneiro' },
  { value: 'agente_logistica', label: 'Agente de Logística' },
  { value: 'coordenador_logistico', label: 'Coordenador Logístico' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'gerente_financeiro', label: 'Gerente Financeiro' },
  { value: 'operador_armazem', label: 'Operador de Armazém' },
];

const UserRoleSelector: React.FC = () => {
  const { currentUser, changeUserRole } = useCurrentUser();

  const handleChangeRole = (role: ApprovalRole) => {
    changeUserRole(role);
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="user-role" className="text-sm">Perfil:</Label>
      <Select
        value={currentUser.role}
        onValueChange={(value) => handleChangeRole(value as ApprovalRole)}
      >
        <SelectTrigger className="w-[200px] h-8 text-xs" id="user-role">
          <SelectValue placeholder="Selecione um perfil" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value} className="text-sm">
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserRoleSelector;
