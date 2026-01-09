
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import {
  AlertTriangle,
  Clock,
  FileWarning,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Eye,
  ExternalLink,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Dados simulados para alertas
const alertsData = [
  { 
    id: 1, 
    title: 'Licença de Importação expirando', 
    description: 'A LI do processo IMP-2023-001 expira em 5 dias', 
    process: 'IMP-2023-001', 
    type: 'warning',
    date: '10/05/2025',
    dismissed: false
  },
  { 
    id: 2, 
    title: 'Atraso em liberação aduaneira', 
    description: 'O processo IMP-2023-003 está 3 dias atrasado na liberação', 
    process: 'IMP-2023-003', 
    type: 'critical',
    date: '12/05/2025',
    dismissed: false
  },
  { 
    id: 3, 
    title: 'Divergência em fatura', 
    description: 'Verificada divergência de valores na fatura do processo IMP-2023-002', 
    process: 'IMP-2023-002', 
    type: 'warning',
    date: '11/05/2025',
    dismissed: false
  },
  { 
    id: 4, 
    title: 'Inspeção agendada', 
    description: 'Inspeção agendada para o processo IMP-2023-005 em 18/05/2025', 
    process: 'IMP-2023-005', 
    type: 'info',
    date: '13/05/2025',
    dismissed: false
  },
  { 
    id: 5, 
    title: 'Documentação pendente', 
    description: 'Faltam 2 documentos para o processo IMP-2023-004', 
    process: 'IMP-2023-004', 
    type: 'warning',
    date: '09/05/2025',
    dismissed: false
  },
  { 
    id: 6, 
    title: 'Prazo para pagamento', 
    description: 'O prazo para pagamento do frete do processo IMP-2023-007 vence em 2 dias', 
    process: 'IMP-2023-007', 
    type: 'critical',
    date: '11/05/2025',
    dismissed: false
  }
];

const AlertsWidget = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { toast } = useToast();
  const [alerts, setAlerts] = React.useState(alertsData);
  const [filter, setFilter] = React.useState<string>('all');
  
  const handleDismiss = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, dismissed: true } : alert
    ));
    
    toast({
      title: "Alerta arquivado",
      description: "O alerta foi marcado como resolvido",
      variant: "default",
    });
  };
  
  const handleViewDetails = (alert: typeof alertsData[0]) => {
    toast({
      title: `Detalhes: ${alert.title}`,
      description: `Processo: ${alert.process} - ${alert.description}`,
      variant: "default",
    });
  };
  
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  const getAlertClass = (type: string) => {
    switch(type) {
      case 'critical':
        return isDark 
          ? 'bg-red-900/20 border-red-800/30' 
          : 'bg-red-50 border-red-100';
      case 'warning':
        return isDark 
          ? 'bg-amber-900/20 border-amber-800/30' 
          : 'bg-amber-50 border-amber-100';
      case 'info':
        return isDark 
          ? 'bg-blue-900/20 border-blue-800/30' 
          : 'bg-blue-50 border-blue-100';
      default:
        return isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200';
    }
  };
  
  const getStatusBadge = (type: string) => {
    switch(type) {
      case 'critical':
        return (
          <Badge className="bg-red-100 text-red-800 border border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Crítico
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Atenção
          </Badge>
        );
      case 'info':
        return (
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
            <Bell className="mr-1 h-3 w-3" />
            Informativo
          </Badge>
        );
      default:
        return (
          <Badge>
            Padrão
          </Badge>
        );
    }
  };
  
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return !alert.dismissed;
    return alert.type === filter && !alert.dismissed;
  });
  
  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.dismissed).length;
  const warningCount = alerts.filter(a => a.type === 'warning' && !a.dismissed).length;
  const infoCount = alerts.filter(a => a.type === 'info' && !a.dismissed).length;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={cn(
          "border-l-4", 
          isDark ? "bg-gray-800 border-gray-700" : "", 
          "border-l-red-500"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Críticos
              </span>
              <span className={`text-lg ${criticalCount > 0 ? 'text-red-500' : ''}`}>
                {criticalCount}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {criticalCount > 0 ? 
                "Alertas que requerem ação imediata" : 
                "Nenhum alerta crítico pendente"}
            </p>
          </CardContent>
        </Card>
        
        <Card className={cn(
          "border-l-4", 
          isDark ? "bg-gray-800 border-gray-700" : "", 
          "border-l-amber-500"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Atenção
              </span>
              <span className={`text-lg ${warningCount > 0 ? 'text-amber-500' : ''}`}>
                {warningCount}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {warningCount > 0 ? 
                "Situações que requerem monitoramento" : 
                "Nenhum alerta de atenção pendente"}
            </p>
          </CardContent>
        </Card>
        
        <Card className={cn(
          "border-l-4", 
          isDark ? "bg-gray-800 border-gray-700" : "", 
          "border-l-blue-500"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between">
              <span className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Informativos
              </span>
              <span className={`text-lg ${infoCount > 0 ? 'text-blue-500' : ''}`}>
                {infoCount}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {infoCount > 0 ? 
                "Notificações e atualizações gerais" : 
                "Nenhuma notificação pendente"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className={isDark ? "text-gray-100" : ""}>
              Alertas e Notificações
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-[#7E69AB] hover:bg-[#6a5590]' : ''}
              >
                Todos ({alerts.filter(a => !a.dismissed).length})
              </Button>
              <Button 
                variant={filter === 'critical' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('critical')}
                className={filter === 'critical' ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                Críticos ({criticalCount})
              </Button>
              <Button 
                variant={filter === 'warning' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('warning')}
                className={filter === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : ''}
              >
                Atenção ({warningCount})
              </Button>
              <Button 
                variant={filter === 'info' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('info')}
                className={filter === 'info' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                Informativos ({infoCount})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length > 0 ? (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getAlertClass(alert.type)}`}
                >
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <h3 className={`font-medium ${isDark ? 'text-gray-100' : ''}`}>
                          {alert.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {alert.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline">
                            {alert.process}
                          </Badge>
                          {getStatusBadge(alert.type)}
                          <span className="text-xs text-muted-foreground">
                            {alert.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handleViewDetails(alert)}
                      >
                        <Eye className="h-3 w-3" />
                        Detalhes
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handleDismiss(alert.id)}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Resolver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <CheckCircle2 
                className={`h-16 w-16 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} 
              />
              <h3 className={`text-xl font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Nenhum alerta pendente
              </h3>
              <p className="text-muted-foreground">
                {filter === 'all'
                  ? "Todos os alertas foram resolvidos"
                  : `Não há alertas do tipo "${filter}" pendentes`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsWidget;
