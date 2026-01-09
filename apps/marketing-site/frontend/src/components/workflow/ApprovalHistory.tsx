
import React from 'react';
import { useWorkflow } from '@/hooks/use-workflow';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Check, Clock, XCircle } from 'lucide-react';

interface ApprovalHistoryProps {
  processId: string;
}

const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({ processId }) => {
  const { getApprovalHistory, getWorkflowForProcess, getWorkflowById, getStepById } = useWorkflow();
  
  const history = getApprovalHistory(processId);
  
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Aprovações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-gray-500">
            Não há histórico de aprovações para este processo.
          </p>
        </CardContent>
      </Card>
    );
  }

  const processWorkflow = getWorkflowForProcess(processId);
  const workflow = processWorkflow ? getWorkflowById(processWorkflow.workflowId) : undefined;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex gap-1 items-center">
            <Check className="h-3 w-3" />
            Aprovado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 flex gap-1 items-center">
            <XCircle className="h-3 w-3" />
            Rejeitado
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 flex gap-1 items-center">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Aprovações</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aprovador</TableHead>
              <TableHead>Data Resposta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((approval) => {
              const step = workflow ? getStepById(workflow.id, approval.stepId) : undefined;
              
              return (
                <TableRow key={approval.id}>
                  <TableCell>{format(new Date(approval.requestDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{step?.name || approval.stepId}</TableCell>
                  <TableCell>{approval.requesterRole}</TableCell>
                  <TableCell>{getStatusBadge(approval.status)}</TableCell>
                  <TableCell>
                    {approval.responderId 
                      ? approval.responderId 
                      : approval.status === 'pending' 
                        ? 'Aguardando aprovação...' 
                        : 'Não atribuído'}
                  </TableCell>
                  <TableCell>
                    {approval.responseDate 
                      ? format(new Date(approval.responseDate), 'dd/MM/yyyy')
                      : '-'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApprovalHistory;
