
import React, { useState } from 'react';
import { useWorkflow } from '@/hooks/use-workflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ApprovalRole } from '@/types/workflow';
import { CheckCircle2, XCircle, Eye, FileText, User, Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useNotificationSound } from '@/hooks/use-notification-sound';

interface PendingApprovalsProps {
  userRole: ApprovalRole;
  userId: string;
}

const PendingApprovals: React.FC<PendingApprovalsProps> = ({ userRole, userId }) => {
  const { pendingApprovals, approveRequest, rejectRequest, getWorkflowById, getStepById } = useWorkflow();
  const { playNotificationSound } = useNotificationSound();
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // Filtra as aprovações pendentes para o papel do usuário
  const userPendingApprovals = pendingApprovals.filter(approval => {
    const workflow = getWorkflowById(approval.processId.split('-')[0]);
    if (!workflow) return false;
    
    const step = getStepById(workflow.id, approval.stepId);
    return step?.requiredRole === userRole;
  });

  if (userPendingApprovals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aprovações Pendentes</CardTitle>
          <CardDescription>Não há aprovações pendentes para sua análise</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleApprove = (requestId: string) => {
    approveRequest(requestId, userId);
    playNotificationSound();
  };

  const handleReject = (requestId: string) => {
    rejectRequest(requestId, userId);
    playNotificationSound();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aprovações Pendentes</CardTitle>
        <CardDescription>Solicitações aguardando sua aprovação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userPendingApprovals.map((approval) => {
            const workflow = getWorkflowById(approval.processId.split('-')[0]);
            const step = workflow ? getStepById(workflow.id, approval.stepId) : undefined;
            
            return (
              <div 
                key={approval.id} 
                className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedApproval(approval);
                  setShowDetailDialog(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">Processo: {approval.processId}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApproval(approval);
                          setShowDetailDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Etapa: {step?.name || approval.stepId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Solicitado em: {format(new Date(approval.requestDate), 'dd/MM/yyyy HH:mm')}
                    </p>
                    {approval.comments && (
                      <p className="mt-2 text-sm border-l-2 border-gray-300 pl-2">
                        {approval.comments}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleApprove(approval.id)}
                      className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Aprovar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleReject(approval.id)}
                      className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Dialog de Detalhes da Aprovação */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalhes da Aprovação
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre a solicitação de aprovação
            </DialogDescription>
          </DialogHeader>
          
          {selectedApproval && (() => {
            const workflow = getWorkflowById(selectedApproval.processId.split('-')[0]);
            const step = workflow ? getStepById(workflow.id, selectedApproval.stepId) : undefined;
            
            return (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FileText className="h-4 w-4" />
                      Processo
                    </div>
                    <p className="font-medium">{selectedApproval.processId}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      Etapa
                    </div>
                    <p className="font-medium">{step?.name || selectedApproval.stepId}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Data Solicitação
                    </div>
                    <p className="font-medium">
                      {format(new Date(selectedApproval.requestDate), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      Solicitante
                    </div>
                    <p className="font-medium">{selectedApproval.requesterRole}</p>
                  </div>
                </div>
                
                {selectedApproval.comments && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MessageSquare className="h-4 w-4" />
                      Comentários
                    </div>
                    <p className="text-sm border-l-2 border-gray-300 pl-3 py-2 bg-gray-50 rounded">
                      {selectedApproval.comments}
                    </p>
                  </div>
                )}
                
                {step?.description && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Descrição da Etapa</div>
                    <p className="text-sm text-gray-700">{step.description}</p>
                  </div>
                )}
              </div>
            );
          })()}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Fechar
            </Button>
            {selectedApproval && (
              <>
                <Button 
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => {
                    handleApprove(selectedApproval.id);
                    setShowDetailDialog(false);
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button 
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    handleReject(selectedApproval.id);
                    setShowDetailDialog(false);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PendingApprovals;
