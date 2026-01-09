import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  BarChart3,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  getPredictiveKPIs,
  getProactiveAlerts,
  getPerformanceData,
  PredictiveKPI as APIPredictiveKPI,
  ProactiveAlert as APIProactiveAlert,
  PerformanceData as APIPerformanceData,
} from '@/services/dashboardService';

interface PredictiveKPI {
  id: string;
  title: string;
  currentValue: number;
  predictedValue: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: string;
  insight?: string;
  action?: string;
}

interface ProactiveAlert {
  id: string;
  type: 'warning' | 'info' | 'critical' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionUrl?: string;
  timestamp: Date;
}

interface IntelligentDashboardProps {
  moduleType?: string;
}

const IntelligentDashboard: React.FC<IntelligentDashboardProps> = ({ moduleType = 'import_full' }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [predictiveKPIs, setPredictiveKPIs] = useState<PredictiveKPI[]>([]);
  const [proactiveAlerts, setProactiveAlerts] = useState<ProactiveAlert[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  // Converter KPIs da API para o formato do componente
  const convertKPIs = (apiKPIs: APIPredictiveKPI[]): PredictiveKPI[] => {
    return apiKPIs.map((kpi, index) => ({
      id: `kpi-${index + 1}`,
      title: kpi.name,
      currentValue: kpi.current_value,
      predictedValue: kpi.predicted_value,
      trend: kpi.trend,
      confidence: Math.round(kpi.confidence * 100),
      timeframe: 'Próximos 30 dias',
      insight: `Confiança: ${Math.round(kpi.confidence * 100)}%`,
      action: '/import/processes',
    }));
  };

  // Converter alertas da API para o formato do componente
  const convertAlerts = (apiAlerts: APIProactiveAlert[]): ProactiveAlert[] => {
    return apiAlerts.map((alert, index) => ({
      id: alert.id || `alert-${index + 1}`,
      type: alert.type === 'error' ? 'critical' : alert.type as any,
      title: alert.title,
      description: alert.message,
      impact: alert.priority === 'critical' ? 'high' : 
              alert.priority === 'high' ? 'high' :
              alert.priority === 'medium' ? 'medium' : 'low',
      actionUrl: alert.action_url,
      timestamp: new Date(alert.created_at),
    }));
  };

  // Converter dados de performance da API
  const convertPerformanceData = (apiData: APIPerformanceData[]): any[] => {
    return apiData.map(data => ({
      period: data.period,
      ...data.metrics,
    }));
  };

  // Carregar dados do dashboard
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [kpis, alerts, perfData] = await Promise.all([
        getPredictiveKPIs().catch(err => {
          console.warn('Erro ao carregar KPIs, usando dados mock:', err);
          return [];
        }),
        getProactiveAlerts().catch(err => {
          console.warn('Erro ao carregar alertas, usando dados mock:', err);
          return [];
        }),
        getPerformanceData('month').catch(err => {
          console.warn('Erro ao carregar performance, usando dados mock:', err);
          return [];
        }),
      ]);

      if (kpis.length > 0) {
        setPredictiveKPIs(convertKPIs(kpis));
      } else {
        // Usar dados mock como fallback
        setPredictiveKPIs([
          {
            id: 'kpi-1',
            title: 'Processos Concluídos (30 dias)',
            currentValue: 45,
            predictedValue: 52,
            trend: 'up',
            confidence: 87,
            timeframe: 'Próximos 30 dias',
            insight: 'Tendência de crescimento baseada em padrões históricos',
            action: '/import/processes'
          },
        ]);
      }

      if (alerts.length > 0) {
        setProactiveAlerts(convertAlerts(alerts));
      }

      if (perfData.length > 0) {
        setPerformanceData(convertPerformanceData(perfData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Usar dados mock como fallback
      setPredictiveKPIs([
        {
          id: 'kpi-1',
          title: 'Processos Concluídos (30 dias)',
          currentValue: 45,
          predictedValue: 52,
          trend: 'up',
          confidence: 87,
          timeframe: 'Próximos 30 dias',
          insight: 'Tendência de crescimento baseada em padrões históricos',
          action: '/import/processes'
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados na montagem
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Dados mock como fallback (usados apenas se API falhar)
  const mockKPIs: PredictiveKPI[] = [
    {
      id: 'kpi-1',
      title: 'Processos Concluídos (30 dias)',
      currentValue: 45,
      predictedValue: 52,
      trend: 'up',
      confidence: 87,
      timeframe: 'Próximos 30 dias',
      insight: 'Tendência de crescimento baseada em padrões históricos',
      action: '/import/processes'
    },
    {
      id: 'kpi-2',
      title: 'Tempo Médio de Desembaraço',
      currentValue: 12,
      predictedValue: 10,
      trend: 'down',
      confidence: 75,
      timeframe: 'Próximas 2 semanas',
      insight: 'Melhoria esperada devido à otimização de processos',
      action: '/import/processes?status=desembaraco'
    },
    {
      id: 'kpi-3',
      title: 'Custos Operacionais',
      currentValue: 125000,
      predictedValue: 118000,
      trend: 'down',
      confidence: 82,
      timeframe: 'Próximo mês',
      insight: 'Redução prevista com novas negociações de frete',
      action: '/financial/dashboard'
    },
    {
      id: 'kpi-4',
      title: 'Taxa de Compliance',
      currentValue: 94,
      predictedValue: 96,
      trend: 'up',
      confidence: 90,
      timeframe: 'Próximas semanas',
      insight: 'Melhoria contínua nos processos de validação',
      action: '/import/processes'
    }
  ];

  const mockAlerts: ProactiveAlert[] = [
    {
      id: 'alert-1',
      type: 'warning',
      title: 'Prazo de Licença Expirando',
      description: '3 licenças de importação expiram nos próximos 7 dias',
      impact: 'high',
      actionUrl: '/import/licenses',
      timestamp: new Date()
    },
  ];

  const mockPerformanceData = [
    { month: 'Jan', processos: 42, compliance: 92, custos: 120000 },
    { month: 'Fev', processos: 45, compliance: 93, custos: 125000 },
    { month: 'Mar', processos: 48, compliance: 94, custos: 118000 },
    { month: 'Abr', processos: 50, compliance: 95, custos: 115000 },
    { month: 'Mai', processos: 52, compliance: 96, custos: 112000 },
  ];

  const displayKPIs = predictiveKPIs.length > 0 ? predictiveKPIs : mockKPIs;
  const displayAlerts = proactiveAlerts.length > 0 ? proactiveAlerts : mockAlerts;
  const displayPerformanceData = performanceData.length > 0 ? performanceData : mockPerformanceData;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'opportunity':
        return <Lightbulb className="h-5 w-5 text-green-500" />;
      default:
        return <Eye className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-amber-200 bg-amber-50';
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'opportunity':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  if (isLoading) {
    return (
      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-[#7E69AB]" />
            <span className="ml-2">Carregando dashboard inteligente...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com insights */}
      <Card className={cn("border-l-4 border-l-[#7E69AB]", isDark && "bg-gray-800 border-gray-700")}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className={cn("flex items-center gap-2", isDark && "text-gray-100")}>
                <Zap className="h-5 w-5 text-[#7E69AB]" />
                Dashboard Inteligente
              </CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : ""}>
                Análises preditivas e insights automáticos baseados em IA
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                Atualizar
              </Button>
              <Badge className="bg-[#7E69AB] text-white">
                <Lightbulb className="h-3 w-3 mr-1" />
                IA Ativada
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alertas Proativos */}
      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isDark && "text-gray-100")}>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Alertas Proativos
          </CardTitle>
          <CardDescription className={isDark ? "text-gray-400" : ""}>
            Notificações inteligentes que requerem sua atenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow",
                  getAlertColor(alert.type),
                  isDark && "bg-gray-700"
                )}
                onClick={() => alert.actionUrl && navigate(alert.actionUrl)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <Badge
                          variant="outline"
                          className={
                            alert.impact === 'high'
                              ? "bg-red-100 text-red-800"
                              : alert.impact === 'medium'
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {alert.impact === 'high' ? 'Alta' : alert.impact === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.timestamp.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {alert.actionUrl && (
                    <Button variant="ghost" size="sm">
                      Ver detalhes
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPIs Preditivos */}
      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isDark && "text-gray-100")}>
            <BarChart3 className="h-5 w-5 text-[#7E69AB]" />
            KPIs Preditivos
          </CardTitle>
          <CardDescription className={isDark ? "text-gray-400" : ""}>
            Previsões baseadas em análise de dados históricos e padrões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayKPIs.map((kpi) => (
              <div
                key={kpi.id}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow",
                  selectedKPI === kpi.id
                    ? "border-[#7E69AB] bg-[#7E69AB]/5"
                    : "border-gray-200",
                  isDark && "bg-gray-700 border-gray-600"
                )}
                onClick={() => {
                  setSelectedKPI(selectedKPI === kpi.id ? null : kpi.id);
                  if (kpi.action) navigate(kpi.action);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className={cn("font-semibold text-sm", isDark && "text-gray-200")}>
                    {kpi.title}
                  </h3>
                  {getTrendIcon(kpi.trend)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className={cn("text-2xl font-bold", isDark && "text-gray-100")}>
                      {kpi.currentValue.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-sm text-gray-500">atual</span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-xl font-semibold",
                      kpi.trend === 'up' ? "text-green-600" : kpi.trend === 'down' ? "text-red-600" : "text-gray-600"
                    )}>
                      {kpi.predictedValue.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-sm text-gray-500">previsto</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full",
                          kpi.trend === 'up' ? "bg-green-500" : kpi.trend === 'down' ? "bg-red-500" : "bg-gray-500"
                        )}
                        style={{ width: `${kpi.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{kpi.confidence}% confiança</span>
                  </div>
                  
                  {selectedKPI === kpi.id && kpi.insight && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <p className="font-medium text-blue-900">💡 Insight:</p>
                      <p className="text-blue-800">{kpi.insight}</p>
                      <p className="text-xs text-blue-600 mt-1">{kpi.timeframe}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de Performance */}
      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isDark && "text-gray-100")}>
            <BarChart3 className="h-5 w-5 text-[#7E69AB]" />
            Análise de Performance
          </CardTitle>
          <CardDescription className={isDark ? "text-gray-400" : ""}>
            Tendências e padrões identificados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="processos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="processos">Processos</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="custos">Custos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="processos" className="mt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
                    <XAxis dataKey="month" tick={{ fill: isDark ? "#E5E7EB" : "#374151" }} />
                    <YAxis tick={{ fill: isDark ? "#E5E7EB" : "#374151" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                        borderColor: isDark ? "#374151" : "#E5E7EB"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="processos"
                      stroke="#7E69AB"
                      fill="#7E69AB"
                      fillOpacity={0.3}
                      name="Processos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="compliance" className="mt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
                    <XAxis dataKey="month" tick={{ fill: isDark ? "#E5E7EB" : "#374151" }} />
                    <YAxis tick={{ fill: isDark ? "#E5E7EB" : "#374151" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                        borderColor: isDark ? "#374151" : "#E5E7EB"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="compliance"
                      stroke="#22C55E"
                      strokeWidth={2}
                      name="Compliance %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="custos" className="mt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
                    <XAxis dataKey="month" tick={{ fill: isDark ? "#E5E7EB" : "#374151" }} />
                    <YAxis
                      tick={{ fill: isDark ? "#E5E7EB" : "#374151" }}
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                        borderColor: isDark ? "#374151" : "#E5E7EB"
                      }}
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                    />
                    <Bar dataKey="custos" fill="#F59E0B" name="Custos (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentDashboard;

