import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Package,
  TrendingUp,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ControlTowerSummary {
  total_processes: number;
  active_processes: number;
  pending_approvals: number;
  critical_alerts: number;
  compliance_rate: number;
  on_time_delivery_rate: number;
  total_value: number;
  currency: string;
}

interface ProcessStatus {
  status: string;
  count: number;
  percentage: number;
}

interface AlertSummary {
  type: string;
  count: number;
  items: Array<{
    id: number;
    name: string;
    category: string;
    process_id?: number;
  }>;
}

interface ControlTowerData {
  summary: ControlTowerSummary;
  import_statuses: ProcessStatus[];
  export_statuses: ProcessStatus[];
  critical_alerts: AlertSummary[];
  recent_events: Array<{
    id: number;
    shipment_id: string;
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
  compliance_overview: {
    total: number;
    compliant: number;
    non_compliant: number;
    pending: number;
  };
  financial_summary: {
    total_payments: number;
    pending_payments: number;
  };
  logistics_summary: {
    total_containers: number;
    in_transit: number;
    total_warehouses: number;
  };
}

const ControlTowerDashboard: React.FC = () => {
  const [data, setData] = useState<ControlTowerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/v1/control-tower/dashboard', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Se for erro 401, pode ser problema de autenticação, mas não bloquear
        if (response.status === 401) {
          console.warn('Não autenticado, usando dados mock');
          setData(null);
          return;
        }
        throw new Error('Erro ao carregar dados do Control Tower');
      }

      const result = await response.json();
      setData(result);
    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
      // Não mostrar toast para erros de conexão, apenas logar
      if (error.message && error.message.includes('conectar')) {
        console.warn('Backend não disponível, interface funcionará em modo offline');
      } else {
        toast({
          title: 'Aviso',
          description: 'Alguns dados podem não estar disponíveis. Verifique se o backend está rodando.',
          variant: 'default'
        });
      }
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Não foi possível carregar os dados do Control Tower
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Control Tower</h2>
          <p className="text-muted-foreground">
            Visão única de toda a supply chain
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.total_processes}</div>
            <p className="text-xs text-muted-foreground">
              {data.summary.active_processes} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovações Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.pending_approvals}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Compliance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.compliance_rate}%</div>
            <p className="text-xs text-muted-foreground">
              {data.compliance_overview.compliant} de {data.compliance_overview.total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{data.summary.critical_alerts}</div>
            <p className="text-xs text-muted-foreground">
              Requerem ação imediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com detalhes */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="processes">Processos</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status de Importações */}
            <Card>
              <CardHeader>
                <CardTitle>Status de Importações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.import_statuses.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{status.status}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{status.count}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {status.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status de Exportações */}
            <Card>
              <CardHeader>
                <CardTitle>Status de Exportações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.export_statuses.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{status.status}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{status.count}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {status.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo Financeiro e Logístico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Resumo Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total de Pagamentos</span>
                    <span className="font-medium">{data.financial_summary.total_payments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pagamentos Pendentes</span>
                    <span className="font-medium text-warning">
                      {data.financial_summary.pending_payments}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Resumo Logístico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total de Contêineres</span>
                    <span className="font-medium">{data.logistics_summary.total_containers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Em Trânsito</span>
                    <span className="font-medium">{data.logistics_summary.in_transit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Armazéns</span>
                    <span className="font-medium">{data.logistics_summary.total_warehouses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Processos</CardTitle>
              <CardDescription>
                Visão consolidada de importações e exportações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Importações</h4>
                  <div className="space-y-2">
                    {data.import_statuses.map((status) => (
                      <div key={status.status} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{status.status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${status.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {status.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Exportações</h4>
                  <div className="space-y-2">
                    {data.export_statuses.map((status) => (
                      <div key={status.status} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{status.status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${status.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {status.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {data.critical_alerts.map((alert) => (
            <Card key={alert.type} className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Alertas Críticos ({alert.count})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alert.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.category} • Processo #{item.process_id}
                        </p>
                      </div>
                      <Badge variant="destructive">Crítico</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Eventos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recent_events.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.description}</p>
                        <Badge variant="outline">{event.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.location} • {new Date(event.timestamp).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Embarque: {event.shipment_id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlTowerDashboard;

