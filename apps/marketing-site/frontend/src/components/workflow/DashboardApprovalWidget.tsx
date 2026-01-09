
import React from 'react';
import { useWorkflow } from '@/hooks/use-workflow';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardApprovalWidget: React.FC = () => {
  const { pendingApprovals, getPendingApprovalsForRole } = useWorkflow();
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  
  // Filtrar aprovações pendentes para o papel do usuário
  const userPendingApprovals = getPendingApprovalsForRole(currentUser.role);
  
  // Função para navegar para o centro de aprovações
  const goToApprovals = () => {
    navigate('/workflow/approvals');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-semibold">
          Aprovações Pendentes
        </CardTitle>
        <ClipboardCheck className="h-5 w-5 text-[#7E69AB]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userPendingApprovals.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>Não há aprovações pendentes para seu perfil</p>
            </div>
          ) : (
            <>
              {userPendingApprovals.slice(0, 3).map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
                  <div>
                    <p className="text-sm font-medium">{approval.processId}</p>
                    <p className="text-xs text-gray-500">{approval.stepId}</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pendente
                    </span>
                  </div>
                </div>
              ))}
              
              {userPendingApprovals.length > 3 && (
                <p className="text-center text-sm text-gray-500">
                  +{userPendingApprovals.length - 3} outras aprovações pendentes
                </p>
              )}
              
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={goToApprovals}
              >
                Ver Todas
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardApprovalWidget;
