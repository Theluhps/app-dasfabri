import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, XCircle, FileText, Shield, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  getComplianceChecks, 
  getComplianceSummary, 
  runComplianceCheck, 
  getComplianceReport,
  ComplianceCheck as APIComplianceCheck 
} from '@/services/complianceService';

interface ComplianceCheck {
  id: string;
  category: 'document' | 'regulation' | 'tax' | 'customs' | 'license';
  name: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'warning' | 'passed' | 'failed';
  required: boolean;
  checkedAt?: Date;
  checkedBy?: string;
  details?: string;
  actionRequired?: string;
}

interface ComplianceCheckerProps {
  processId: string;
  checks?: ComplianceCheck[];
  onRunCheck?: () => void;
  onExportReport?: () => void;
}

const ComplianceChecker: React.FC<ComplianceCheckerProps> = ({
  processId,
  checks: propChecks,
  onRunCheck,
  onExportReport
}) => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checks, setChecks] = useState<ComplianceCheck[]>(propChecks || []);
  const [summary, setSummary] = useState<{ compliance_rate: number } | null>(null);

  // Converter checks da API para o formato do componente
  const convertAPIChecks = (apiChecks: APIComplianceCheck[]): ComplianceCheck[] => {
    return apiChecks.map(check => ({
      id: check.id.toString(),
      category: check.category as any,
      name: check.name,
      description: check.details || check.name,
      status: check.status === 'passed' ? 'compliant' : 
              check.status === 'failed' ? 'non-compliant' : 
              check.status as any,
      required: true,
      checkedAt: new Date(check.created_at),
      details: check.details,
      actionRequired: check.action_required,
    }));
  };

  // Carregar verificações de compliance
  const loadComplianceData = async () => {
    try {
      setIsLoading(true);
      const [apiChecks, apiSummary] = await Promise.all([
        getComplianceChecks(processId),
        getComplianceSummary(processId),
      ]);

      const convertedChecks = convertAPIChecks(apiChecks);
      setChecks(convertedChecks.length > 0 ? convertedChecks : propChecks || []);
      setSummary(apiSummary);
    } catch (error) {
      console.error('Erro ao carregar compliance:', error);
      // Usar dados de props como fallback
      setChecks(propChecks || []);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados na montagem
  useEffect(() => {
    if (processId) {
      loadComplianceData();
    }
  }, [processId]);

  const handleRunCheck = async () => {
    setIsRunning(true);
    try {
      const newChecks = await runComplianceCheck(processId);
      const convertedChecks = convertAPIChecks(newChecks);
      setChecks(convertedChecks);
      
      // Recarregar resumo
      const apiSummary = await getComplianceSummary(processId);
      setSummary(apiSummary);

      if (onRunCheck) {
        onRunCheck();
      }
      
      toast({
        title: "Verificação concluída",
        description: "Todas as verificações de compliance foram executadas.",
      });
    } catch (error) {
      console.error('Erro ao executar verificação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível executar a verificação de compliance.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const blob = await getComplianceReport(processId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${processId}-${new Date().toISOString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      if (onExportReport) {
        onExportReport();
      } else {
        toast({
          title: "Relatório gerado",
          description: "Relatório de compliance exportado com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      'compliant': { 
        label: 'Conforme', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
      'non-compliant': { 
        label: 'Não Conforme', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-4 w-4" />
      },
      'pending': { 
        label: 'Pendente', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <AlertCircle className="h-4 w-4" />
      },
      'warning': { 
        label: 'Atenção', 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertCircle className="h-4 w-4" />
      },
    };

    const config = configs[status as keyof typeof configs] || configs.pending;
    
    return (
      <Badge className={cn("flex items-center gap-1 border", config.color)}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'document': <FileText className="h-5 w-5" />,
      'regulation': <Shield className="h-5 w-5" />,
      'tax': <FileText className="h-5 w-5" />,
      'customs': <Shield className="h-5 w-5" />,
      'license': <FileText className="h-5 w-5" />,
    };
    return icons[category as keyof typeof icons] || <FileText className="h-5 w-5" />;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'document': 'Documentação',
      'regulation': 'Regulamentação',
      'tax': 'Tributário',
      'customs': 'Alfândega',
      'license': 'Licenças',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const stats = {
    total: checks.length,
    compliant: checks.filter(c => c.status === 'compliant').length,
    nonCompliant: checks.filter(c => c.status === 'non-compliant').length,
    pending: checks.filter(c => c.status === 'pending').length,
    warning: checks.filter(c => c.status === 'warning').length,
  };

  const complianceRate = summary?.compliance_rate 
    ? Math.round(summary.compliance_rate * 100)
    : stats.total > 0 
      ? Math.round((stats.compliant / stats.total) * 100) 
      : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-[#7E69AB]" />
            <span className="ml-2">Carregando verificações de compliance...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <Card className="border-l-4 border-l-[#7E69AB]">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#7E69AB]" />
                Verificador de Compliance
              </CardTitle>
              <CardDescription className="mt-2">
                Verificação automática de conformidade para o processo {processId}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunCheck}
                disabled={isRunning}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isRunning && "animate-spin")} />
                {isRunning ? 'Verificando...' : 'Executar Verificação'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Taxa de compliance */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Taxa de Compliance</span>
              <span className="text-2xl font-bold text-[#7E69AB]">{complianceRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={cn(
                  "h-3 rounded-full transition-all duration-500",
                  complianceRate >= 90 ? "bg-green-500" :
                  complianceRate >= 70 ? "bg-yellow-500" :
                  "bg-red-500"
                )}
                style={{ width: `${complianceRate}%` }}
              />
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600 mt-1">Total</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{stats.compliant}</p>
              <p className="text-xs text-gray-600 mt-1">Conforme</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-700">{stats.nonCompliant}</p>
              <p className="text-xs text-gray-600 mt-1">Não Conforme</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              <p className="text-xs text-gray-600 mt-1">Pendente</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-700">{stats.warning}</p>
              <p className="text-xs text-gray-600 mt-1">Atenção</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de verificações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verificações de Compliance</CardTitle>
          <CardDescription>
            Lista completa de verificações realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((check) => (
              <div
                key={check.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  check.status === 'non-compliant' 
                    ? "border-red-200 bg-red-50" 
                    : check.status === 'warning'
                      ? "border-amber-200 bg-amber-50"
                      : check.status === 'compliant'
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      check.status === 'non-compliant' 
                        ? "bg-red-100" 
                        : check.status === 'warning'
                          ? "bg-amber-100"
                          : check.status === 'compliant'
                            ? "bg-green-100"
                            : "bg-gray-100"
                    )}>
                      {getCategoryIcon(check.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{check.name}</h3>
                        {check.required && (
                          <Badge variant="outline" className="text-xs">
                            Obrigatório
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(check.category)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{check.description}</p>
                      {check.details && (
                        <p className="text-sm text-gray-700 mb-2">{check.details}</p>
                      )}
                      {check.actionRequired && (
                        <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-sm">
                          <p className="font-medium text-amber-900">Ação necessária:</p>
                          <p className="text-amber-800">{check.actionRequired}</p>
                        </div>
                      )}
                      {check.checkedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Verificado em {check.checkedAt.toLocaleString('pt-BR')}
                          {check.checkedBy && ` por ${check.checkedBy}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(check.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceChecker;

