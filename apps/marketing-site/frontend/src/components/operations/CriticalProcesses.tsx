
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Process {
  id: string;
  client: string;
  product: string;
  deadline: string;
  daysRemaining: number;
  status: string;
  issue: string;
}

const processes: Process[] = [
  {
    id: "IMP-2023-001",
    client: "Empresa ABC Ltda",
    product: "Máquinas industriais",
    deadline: "12/05/2025",
    daysRemaining: 1,
    status: "Em análise",
    issue: "Documentação pendente"
  },
  {
    id: "IMP-2023-003",
    client: "Indústria Nacional",
    product: "Matéria-prima",
    deadline: "13/05/2025",
    daysRemaining: 2,
    status: "Aguardando documentos",
    issue: "Licença expirada"
  },
  {
    id: "IMP-2023-008",
    client: "FarmaBrasil",
    product: "Produtos químicos",
    deadline: "14/05/2025",
    daysRemaining: 3,
    status: "Em análise",
    issue: "Inspeção pendente"
  }
];

const CriticalProcesses = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const handleViewProcess = (id: string) => {
    navigate(`/import/process/${id}`);
  };

  const getUrgencyClass = (days: number) => {
    if (days <= 1) return isDark ? 'text-red-400' : 'text-red-600';
    if (days <= 3) return isDark ? 'text-amber-400' : 'text-amber-600';
    return isDark ? 'text-green-400' : 'text-green-600';
  };

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className={isDark ? 'text-gray-100' : ''}>
              Processos Críticos
            </CardTitle>
          </div>
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            {processes.length} processos
          </Badge>
        </div>
        <CardDescription className={isDark ? 'text-gray-400' : ''}>
          Processos que requerem atenção imediata
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        <div className="divide-y">
          {processes.map((process) => (
            <div 
              key={process.id} 
              className={`px-6 py-4 ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} cursor-pointer`}
              onClick={() => handleViewProcess(process.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-medium ${isDark ? 'text-gray-100' : ''}`}>{process.client}</p>
                  <p className="text-sm text-muted-foreground">{process.product}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {process.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div>
                  <p className="text-xs text-muted-foreground">Processo: {process.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Problema: {process.issue}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${getUrgencyClass(process.daysRemaining)}`}>
                    Prazo: {process.deadline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {process.daysRemaining <= 0 
                      ? 'Vence hoje!' 
                      : process.daysRemaining === 1 
                        ? 'Vence amanhã'
                        : `${process.daysRemaining} dias restantes`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 text-center">
          <Button variant="link" className="text-sm flex items-center gap-1.5">
            Ver todos os processos críticos <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalProcesses;
