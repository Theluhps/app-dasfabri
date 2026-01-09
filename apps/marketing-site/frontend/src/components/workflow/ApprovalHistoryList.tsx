
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
import { Badge } from '@/components/ui/badge';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { Check, Clock, XCircle } from 'lucide-react';
import { ApprovalRequest, ApprovalRole } from '@/types/workflow';

interface ApprovalHistoryListProps {
  filters: {
    status: string;
    dateRange: string;
    processId: string;
  };
  userRole: ApprovalRole;
}

export const ApprovalHistoryList: React.FC<ApprovalHistoryListProps> = ({ 
  filters,
  userRole
}) => {
  const { processWorkflows, getStepById, getWorkflowById } = useWorkflow();
  
  // Combine all approval history from all processes
  const allHistory = processWorkflows.flatMap(workflow => 
    workflow.approvalHistory.map(approval => ({
      ...approval,
      processWorkflowId: workflow.workflowId
    }))
  );

  // Apply filters
  const filteredHistory = allHistory.filter(item => {
    // Filter by status
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }
    
    // Filter by process ID
    if (filters.processId && !item.processId.toLowerCase().includes(filters.processId.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange !== 'all') {
      const date = new Date(item.requestDate);
      
      if (filters.dateRange === 'today' && !isToday(date)) {
        return false;
      } else if (filters.dateRange === 'week' && !isThisWeek(date)) {
        return false;
      } else if (filters.dateRange === 'month' && !isThisMonth(date)) {
        return false;
      }
    }
    
    // Filter by user role - only show items where the user's role was involved
    const workflow = getWorkflowById(item.processWorkflowId);
    if (!workflow) return false;
    
    const step = getStepById(workflow.id, item.stepId);
    // Filter by role - either the requester role or the required role for the step
    return item.requesterRole === userRole || step?.requiredRole === userRole;
  });
  
  // Sort by date (most recent first)
  const sortedHistory = [...filteredHistory].sort((a, b) => 
    new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  );

  if (sortedHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Não há histórico de aprovações correspondente aos filtros selecionados.</p>
      </div>
    );
  }

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
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Processo</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Data Solicitação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aprovador</TableHead>
            <TableHead>Data Resposta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHistory.map((approval) => {
            const workflow = getWorkflowById(approval.processWorkflowId);
            const step = workflow ? getStepById(workflow.id, approval.stepId) : undefined;
            
            return (
              <TableRow 
                key={approval.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  // Navegar para detalhes do processo ou abrir dialog
                  window.location.href = `/import/process/${approval.processId.split('-').pop()}`;
                }}
              >
                <TableCell className="font-medium">{approval.processId}</TableCell>
                <TableCell>{step?.name || approval.stepId}</TableCell>
                <TableCell>{approval.requesterRole}</TableCell>
                <TableCell>{format(new Date(approval.requestDate), 'dd/MM/yyyy HH:mm')}</TableCell>
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
                    ? format(new Date(approval.responseDate), 'dd/MM/yyyy HH:mm')
                    : '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
