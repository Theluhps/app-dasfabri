import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleSelector from '@/components/system/ModuleSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useModule } from '@/contexts/ModuleContext';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import DasfabriLogo from '@/components/DasfabriLogo';

const ModuleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user, userModules } = useModule();

  const handleModuleSelect = () => {
    toast({
      title: "Módulo selecionado",
      description: "Redirecionando para o dashboard...",
    });
    // Navigate to dashboard after module selection
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <DasfabriLogo size="lg" className="mb-2" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bem-vindo ao Dasfabri</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {user?.name}, selecione o módulo que deseja acessar
          </p>
          
          {user && (
            <div className="mt-4 flex flex-col items-center gap-1">
              <Badge className="bg-dasfabri-blue text-white">{user.role === 'admin' ? 'Administrador' : user.role === 'manager' ? 'Gerente' : user.role === 'operator' ? 'Operador' : 'Visualizador'}</Badge>
              {user.department && (
                <span className="text-sm text-gray-500 dark:text-gray-400">{user.department} • {user.company}</span>
              )}
            </div>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Módulos disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            {userModules.length > 0 ? (
              <ModuleSelector onSelect={handleModuleSelect} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Você não tem acesso a nenhum módulo. Entre em contato com o administrador.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleSelection;
