
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Download, 
  Eye, 
  FileText, 
  MessageSquare, 
  Package, 
  Settings, 
  Truck, 
  Users,
  Bell,
  Star
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import ApprovalHistory from '@/components/workflow/ApprovalHistory';

const ProcessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAnnotationDialog, setShowAnnotationDialog] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [showManageDialog, setShowManageDialog] = useState(false);
  
  // Dados simulados do processo
  const process = {
    id: id || 'IMP-2023-001',
    client: 'Empresa ABC Ltda',
    product: 'Máquinas industriais',
    origin: 'China',
    status: 'Em andamento',
    date: '15/05/2025',
    value: 'USD 250,000.00',
    responsibleUser: 'Carlos Mendes',
    category: 'Maquinário',
    expectedDelivery: '30/06/2025',
    incoterm: 'FOB Shanghai',
    description: 'Importação de 5 máquinas industriais para linha de produção. Equipamentos incluem CNC, tornos e fresas.',
    documents: [
      { id: 'DOC-001', name: 'Commercial Invoice', status: 'Aprovado', date: '10/05/2025' },
      { id: 'DOC-002', name: 'Packing List', status: 'Pendente', date: '10/05/2025' },
      { id: 'DOC-003', name: 'Bill of Lading', status: 'Pendente', date: '15/05/2025' },
      { id: 'DOC-004', name: 'Certificado de Origem', status: 'Não enviado', date: '-' },
    ],
    timeline: [
      { date: '05/05/2025', action: 'Processo criado', user: 'João da Silva', type: 'create' },
      { date: '08/05/2025', action: 'Proforma aprovada', user: 'Maria Souza', type: 'approve' },
      { date: '10/05/2025', action: 'Documentos enviados para análise', user: 'Carlos Mendes', type: 'document' },
      { date: '12/05/2025', action: 'Licença de importação solicitada', user: 'Ana Paula', type: 'license' },
      { date: '15/05/2025', action: 'Pagamento antecipado efetuado', user: 'Roberto Almeida', type: 'payment' },
    ],
    notes: [
      { id: '1', user: 'Carlos Mendes', date: '11/05/2025', text: 'Fornecedor confirma envio para 20/05/2025.' },
      { id: '2', user: 'Ana Paula', date: '12/05/2025', text: 'Solicitada documentação adicional para licença de importação.' },
      { id: '3', user: 'João da Silva', date: '15/05/2025', text: 'Cliente informado sobre o prazo atualizado de entrega.' },
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return 'default';
      case 'Pendente':
        return 'outline';
      case 'Concluído':
        return 'secondary';
      case 'Atrasado':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Não enviado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const getTimelineTypeIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <Package className="h-5 w-5" />;
      case 'approve':
        return <FileText className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'license':
        return <FileText className="h-5 w-5" />;
      case 'payment':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getTimelineTypeBg = (type: string) => {
    switch (type) {
      case 'create':
        return 'bg-blue-500';
      case 'approve':
        return 'bg-green-500';
      case 'document':
        return 'bg-purple-500';
      case 'license':
        return 'bg-yellow-500';
      case 'payment':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <PageLayout 
      title={`Processo ${process.id}`}
      description="Detalhes do processo de importação"
    >
      <div className="space-y-6">
        {/* Cabeçalho com informações principais */}
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {process.product}
                  </h2>
                  <Badge variant={getStatusColor(process.status)}>
                    {process.status}
                  </Badge>
                </div>
                
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Cliente: {process.client}</span>
                  <span className="mx-2">•</span>
                  <span>Origem: {process.origin}</span>
                  <span className="mx-2">•</span>
                  <span>Valor: {process.value}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button>
                  <Eye className="mr-2 h-4 w-4" />
                  Acompanhar
                </Button>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Gerenciar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs para diferentes seções */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:grid-cols-7 lg:w-[900px]">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="tracking">Rastreamento</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="notes">Anotações</TabsTrigger>
            <TabsTrigger value="approvals">Aprovações</TabsTrigger>
            <TabsTrigger value="finances" className="hidden md:block">Financeiro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-gray-100' : ''}`}>
                    <Package className="mr-2 h-5 w-5" />
                    Detalhes do Processo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Categoria:</dt>
                      <dd className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{process.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Incoterm:</dt>
                      <dd className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{process.incoterm}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Data Inicial:</dt>
                      <dd className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{process.date}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Previsão Entrega:</dt>
                      <dd className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{process.expectedDelivery}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-gray-100' : ''}`}>
                    <Users className="mr-2 h-5 w-5" />
                    Responsáveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">CM</span>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{process.responsibleUser}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Analista de Importação</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 font-semibold">AP</span>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Ana Paula</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Documentação</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-gray-100' : ''}`}>
                    <Truck className="mr-2 h-5 w-5" />
                    Logística
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Modal:</dt>
                      <dd className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Marítimo</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Porto Origem:</dt>
                      <dd className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Shanghai, China</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Porto Destino:</dt>
                      <dd className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Santos, Brasil</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Frete:</dt>
                      <dd className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>USD 12,500.00</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-gray-100' : ''}`}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Próximos Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`p-3 border ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} rounded-lg`}>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>20/05/2025</p>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Embarque no porto de origem</p>
                    </div>
                    <div className={`p-3 border ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} rounded-lg`}>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>25/05/2025</p>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Deadline pagamento de impostos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>Documentos</CardTitle>
                  <Button size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Adicionar Documento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} text-left`}>
                        <th className="pb-3 font-medium text-sm">ID</th>
                        <th className="pb-3 font-medium text-sm">Nome</th>
                        <th className="pb-3 font-medium text-sm">Status</th>
                        <th className="pb-3 font-medium text-sm">Data</th>
                        <th className="pb-3 font-medium text-sm text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {process.documents.map((doc) => (
                        <tr key={doc.id} className={theme === 'dark' ? 'border-gray-700' : ''}>
                          <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{doc.id}</td>
                          <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{doc.name}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{doc.date}</td>
                          <td className="py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                // Abrir visualização do documento
                                window.open(`/import/documents/view/${doc.id}`, '_blank');
                              }}
                              title="Visualizar documento"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                // Simular download
                                const link = document.createElement('a');
                                link.href = `#download-${doc.id}`;
                                link.download = doc.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              title="Baixar documento"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>Linha do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-8 pb-1">
                  {process.timeline.map((event, index) => (
                    <div key={index} className={`mb-8 relative ${index === process.timeline.length - 1 ? '' : 'pb-8'}`}>
                      {/* Line */}
                      {index !== process.timeline.length - 1 && (
                        <div className="absolute top-6 left-4 w-[1px] h-full -ml-[0.5px] bg-gray-300"></div>
                      )}
                      
                      {/* Icon */}
                      <div className={`absolute top-0 left-0 w-8 h-8 rounded-full ${getTimelineTypeBg(event.type)} -ml-4 flex items-center justify-center text-white`}>
                        {getTimelineTypeIcon(event.type)}
                      </div>
                      
                      {/* Content */}
                      <div className={`ml-4 ${theme === 'dark' ? 'text-gray-100' : ''}`}>
                        <p className="font-medium text-base">{event.action}</p>
                        <div className={`flex mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span>{event.date}</span>
                          <span className="mx-2">•</span>
                          <span>{event.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="mt-6">
            <RealTimeTracking
              shipmentId={process.id}
              containerNumber="MSCU1234567"
              origin={process.origin}
              destination="Santos, Brasil"
              vessel="MSC ANTONELLA"
              currentLocation="Em trânsito - Oceano Atlântico"
              events={[
                {
                  id: 'evt-1',
                  timestamp: new Date('2025-05-10'),
                  location: 'Shanghai, China',
                  status: 'departed',
                  description: 'Embarque realizado no porto de origem',
                  vessel: 'MSC ANTONELLA',
                  port: 'Porto de Shanghai'
                },
                {
                  id: 'evt-2',
                  timestamp: new Date('2025-05-15'),
                  location: 'Oceano Pacífico',
                  status: 'in-transit',
                  description: 'Em trânsito pelo Oceano Pacífico',
                  vessel: 'MSC ANTONELLA'
                },
                {
                  id: 'evt-3',
                  timestamp: new Date('2025-05-20'),
                  location: 'Canal do Panamá',
                  status: 'in-transit',
                  description: 'Passagem pelo Canal do Panamá',
                  vessel: 'MSC ANTONELLA'
                },
                {
                  id: 'evt-4',
                  timestamp: new Date(),
                  location: 'Oceano Atlântico',
                  status: 'in-transit',
                  description: 'Em trânsito pelo Oceano Atlântico',
                  vessel: 'MSC ANTONELLA'
                }
              ]}
              onRefresh={() => {
                toast({
                  title: "Atualizando rastreamento",
                  description: "Buscando informações atualizadas...",
                });
              }}
            />
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <ComplianceChecker
              processId={process.id}
              checks={[
                {
                  id: 'check-1',
                  category: 'document',
                  name: 'Fatura Comercial',
                  description: 'Verificação de fatura comercial conforme regulamentação',
                  status: 'compliant',
                  required: true,
                  checkedAt: new Date('2025-05-10'),
                  checkedBy: 'Sistema Automático',
                  details: 'Fatura válida e completa'
                },
                {
                  id: 'check-2',
                  category: 'license',
                  name: 'Licença de Importação',
                  description: 'Validação de licença de importação',
                  status: 'compliant',
                  required: true,
                  checkedAt: new Date('2025-05-12'),
                  checkedBy: 'Sistema Automático',
                  details: 'Licença válida até 30/06/2025'
                },
                {
                  id: 'check-3',
                  category: 'customs',
                  name: 'Declaração Aduaneira',
                  description: 'Verificação de conformidade da declaração',
                  status: 'warning',
                  required: true,
                  checkedAt: new Date('2025-05-15'),
                  checkedBy: 'Sistema Automático',
                  details: 'Aguardando validação final',
                  actionRequired: 'Revisar informações de classificação NCM'
                },
                {
                  id: 'check-4',
                  category: 'tax',
                  name: 'Cálculo de Impostos',
                  description: 'Verificação de cálculo de impostos de importação',
                  status: 'compliant',
                  required: true,
                  checkedAt: new Date('2025-05-15'),
                  checkedBy: 'Sistema Automático',
                  details: 'Cálculos corretos conforme legislação'
                },
                {
                  id: 'check-5',
                  category: 'regulation',
                  name: 'Conformidade ANVISA',
                  description: 'Verificação de conformidade com regulamentações da ANVISA',
                  status: 'pending',
                  required: false,
                  actionRequired: 'Aguardando documentação adicional'
                }
              ]}
              onRunCheck={() => {
                toast({
                  title: "Verificação iniciada",
                  description: "Executando verificações de compliance...",
                });
              }}
              onExportReport={() => {
                toast({
                  title: "Relatório gerado",
                  description: "Relatório de compliance exportado com sucesso.",
                });
              }}
            />
          </TabsContent>
          
          <TabsContent value="notes" className="mt-6">
            <ProcessComments
              processId={process.id}
              onAddComment={(comment) => {
                toast({
                  title: "Comentário adicionado",
                  description: "Seu comentário foi adicionado ao processo.",
                });
              }}
            />
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <ApprovalHistory processId={process.id} />
          </TabsContent>

          <TabsContent value="finances" className="mt-6">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>Informações Financeiras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-850' : 'border-gray-200'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Valor Total</p>
                      <p className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>USD 250,000.00</p>
                    </div>
                    <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-850' : 'border-gray-200'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Impostos Estimados</p>
                      <p className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>R$ 325,000.00</p>
                    </div>
                    <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-850' : 'border-gray-200'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Despesas Acessórias</p>
                      <p className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>R$ 47,500.00</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Pagamentos</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} text-left`}>
                            <th className="pb-3 font-medium text-sm">Descrição</th>
                            <th className="pb-3 font-medium text-sm">Valor</th>
                            <th className="pb-3 font-medium text-sm">Data</th>
                            <th className="pb-3 font-medium text-sm">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className={theme === 'dark' ? 'border-gray-700' : ''}>
                            <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>Adiantamento ao Fornecedor</td>
                            <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>USD 75,000.00</td>
                            <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>15/05/2025</td>
                            <td className="py-4">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                Pago
                              </span>
                            </td>
                          </tr>
                          <tr className={theme === 'dark' ? 'border-gray-700' : ''}>
                            <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>Frete Internacional</td>
                            <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>USD 12,500.00</td>
                            <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>20/05/2025</td>
                            <td className="py-4">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pendente
                              </span>
                            </td>
                          </tr>
                          <tr className={theme === 'dark' ? 'border-gray-700' : ''}>
                            <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>Saldo ao Fornecedor</td>
                            <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>USD 175,000.00</td>
                            <td className={`py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>05/06/2025</td>
                            <td className="py-4">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                Agendado
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ProcessDetail;
