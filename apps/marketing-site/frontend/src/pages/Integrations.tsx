
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Database, 
  Truck, 
  DollarSign, 
  FileText, 
  ListChecks,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Settings,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const Integrations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const apiIntegrations = [
    {
      id: 1,
      name: 'Siscomex',
      description: 'Integração com o sistema de comércio exterior do governo',
      status: 'Ativo',
      lastSync: '10/05/2025 14:30',
      type: 'Importação/Exportação',
      features: [
        'Consulta de DUIMP',
        'Envio automático de declarações',
        'Validação de documentos',
        'Status de desembaraço em tempo real'
      ],
      apiEndpoint: 'https://api.siscomex.gov.br/v1',
      documentation: 'https://docs.siscomex.gov.br'
    },
    {
      id: 2,
      name: 'Neotracker',
      description: 'Rastreamento logístico e atualizações de carga',
      status: 'Ativo',
      lastSync: '10/05/2025 14:00',
      type: 'Logística'
    },
    {
      id: 3,
      name: 'FinNext',
      description: 'Sistema de pagamentos e gestão financeira',
      status: 'Com falha',
      lastSync: '09/05/2025 16:45',
      type: 'Financeiro'
    }
  ];

  const erpIntegrations = [
    {
      id: 4,
      name: 'SAP',
      description: 'Integração com sistema ERP corporativo',
      status: 'Ativo',
      lastSync: '10/05/2025 12:15',
      modules: ['Financeiro', 'Estoque']
    },
    {
      id: 5,
      name: 'Totvs Protheus',
      description: 'Sistema de gestão empresarial',
      status: 'Inativo',
      lastSync: '05/05/2025 09:30',
      modules: ['Contabilidade', 'Compras']
    }
  ];

  const partnerIntegrations = [
    {
      id: 6,
      name: 'Portal Agências Marítimas',
      description: 'Integração com portais de agências de navegação',
      status: 'Ativo',
      lastSync: '10/05/2025 13:45',
      partners: ['MSC', 'Maersk', 'CMA CGM']
    },
    {
      id: 7,
      name: 'Terminais Portuários',
      description: 'Integração com terminais para status de carga',
      status: 'Ativo',
      lastSync: '10/05/2025 11:30',
      partners: ['Santos Brasil', 'DP World']
    },
    {
      id: 8,
      name: 'Warehouses API',
      description: 'Integração com armazéns para controle de estoque',
      status: 'Pendente',
      lastSync: '-',
      partners: ['DHL', 'Panalpina']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Ativo':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
      case 'Inativo':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
      case 'Com falha':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
      case 'Pendente':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getIntegrationTypeIcon = (type: string) => {
    switch(type) {
      case 'Importação/Exportação':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'Logística':
        return <Truck className="h-5 w-5 text-green-600" />;
      case 'Financeiro':
        return <DollarSign className="h-5 w-5 text-purple-600" />;
      default:
        return <Share2 className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <PageLayout 
      title="Integrações" 
      description="Gerencie as integrações do sistema com outros serviços"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Nova Integração
          </Button>
        </div>
        
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              APIs
            </TabsTrigger>
            <TabsTrigger value="erp" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              ERPs
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Parceiros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiIntegrations.map((integration) => (
                <Card key={integration.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getIntegrationTypeIcon(integration.type)}
                        <CardTitle>{integration.name}</CardTitle>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tipo:</span>
                        <span>{integration.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Última sincronização:</span>
                        <span>{integration.lastSync}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">Configurar</Button>
                    <Button variant="outline" size="sm">Testar</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="erp" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {erpIntegrations.map((integration) => (
                <Card key={integration.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{integration.name}</CardTitle>
                      {getStatusBadge(integration.status)}
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Módulos:</span>
                        <span>{integration.modules.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Última sincronização:</span>
                        <span>{integration.lastSync}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">Configurar</Button>
                    <Button variant="outline" size="sm">Testar</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerIntegrations.map((integration) => (
                <Card key={integration.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{integration.name}</CardTitle>
                      {getStatusBadge(integration.status)}
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Parceiros:</span>
                        <span>{integration.partners.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Última sincronização:</span>
                        <span>{integration.lastSync}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">Configurar</Button>
                    <Button variant="outline" size="sm">Testar</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Status das Integrações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-700">8</div>
                <div className="text-sm text-green-700">Total de Integrações</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-700">6</div>
                <div className="text-sm text-green-700">Ativas</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-700">1</div>
                <div className="text-sm text-red-700">Com Falha</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-700">1</div>
                <div className="text-sm text-yellow-700">Pendentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Integrations;
