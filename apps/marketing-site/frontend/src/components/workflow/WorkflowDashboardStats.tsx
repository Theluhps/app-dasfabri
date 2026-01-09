
import React from 'react';
import { useWorkflow } from '@/hooks/use-workflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Check, Clock, XCircle } from 'lucide-react';

const colors = ['#ffb020', '#10b981', '#f43f5e'];

const WorkflowDashboardStats: React.FC = () => {
  const { pendingApprovals, processWorkflows } = useWorkflow();
  
  // Calcular estatísticas
  const allApprovals = processWorkflows.flatMap(pw => pw.approvalHistory);
  
  // Total de aprovações por status
  const approved = allApprovals.filter(a => a.status === 'approved').length;
  const rejected = allApprovals.filter(a => a.status === 'rejected').length;
  const pending = pendingApprovals.length;
  
  // Dados para o gráfico
  const statusData = [
    { name: 'Pendente', value: pending, icon: <Clock className="h-3 w-3" /> },
    { name: 'Aprovado', value: approved, icon: <Check className="h-3 w-3" /> },
    { name: 'Rejeitado', value: rejected, icon: <XCircle className="h-3 w-3" /> },
  ];
  
  // Calcular tempo médio de aprovação (em horas)
  const completedApprovals = allApprovals.filter(a => a.status !== 'pending' && a.responseDate);
  
  const averageTime = completedApprovals.length > 0
    ? completedApprovals.reduce((sum, curr) => {
        const requestDate = new Date(curr.requestDate);
        const responseDate = new Date(curr.responseDate!);
        const hours = (responseDate.getTime() - requestDate.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0) / completedApprovals.length
    : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Status das Aprovações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} solicitações`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="text-center p-2">
              <div className="text-amber-500 flex items-center justify-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-lg font-semibold">{pending}</span>
              </div>
              <p className="text-xs text-gray-500">Pendentes</p>
            </div>
            <div className="text-center p-2">
              <div className="text-green-500 flex items-center justify-center gap-1">
                <Check className="h-4 w-4" />
                <span className="text-lg font-semibold">{approved}</span>
              </div>
              <p className="text-xs text-gray-500">Aprovados</p>
            </div>
            <div className="text-center p-2">
              <div className="text-red-500 flex items-center justify-center gap-1">
                <XCircle className="h-4 w-4" />
                <span className="text-lg font-semibold">{rejected}</span>
              </div>
              <p className="text-xs text-gray-500">Rejeitados</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Métricas de Aprovação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Tempo Médio de Aprovação</div>
              <div className="text-2xl font-bold mt-1">
                {averageTime.toFixed(1)} horas
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Taxa de Aprovação</div>
              <div className="text-2xl font-bold mt-1">
                {completedApprovals.length > 0 
                  ? `${((approved / completedApprovals.length) * 100).toFixed(0)}%`
                  : '0%'
                }
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total de Solicitações</div>
              <div className="text-2xl font-bold mt-1">
                {allApprovals.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDashboardStats;
