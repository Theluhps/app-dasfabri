
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarCheck, Ship, DollarSign, Package, FileCheck, Building } from 'lucide-react';

interface Process {
  id: string;
  client: string;
  product: string;
  origin: string;
  date: string;
  status: string;
  estimatedArrival?: string;
  invoiceValue?: string;
  ncm?: string;
  supplier?: string;
  currency?: string;
  importType?: string;
  customsBroker?: string;
  incoterm?: string;
  referenceNumber?: string;
  insurance?: string;
  freight?: string;
  quantity?: number;
  unitWeight?: number;
  totalWeight?: number;
  packageType?: string;
}

interface ProcessInfoPanelProps {
  process: Process;
}

const ProcessInfoPanel: React.FC<ProcessInfoPanelProps> = ({ process }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento': return 'bg-blue-100 text-blue-800';
      case 'Liberado': return 'bg-green-100 text-green-800';
      case 'Aguardando documentos': return 'bg-yellow-100 text-yellow-800';
      case 'Em análise': return 'bg-purple-100 text-purple-800';
      case 'Documentação completa': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <FileCheck className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="logistics" className="flex items-center gap-1">
            <Ship className="h-4 w-4" />
            Logística
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-[#7E69AB]" />
                Informações Gerais
              </CardTitle>
              <CardDescription>
                Detalhes do processo de importação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p className="flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-gray-500" />
                    {process.client}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(process.status)}>
                    {process.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Produto</p>
                  <p className="flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-gray-500" />
                    {process.product}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Fornecedor</p>
                  <p>{process.supplier || 'Não informado'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">NCM</p>
                  <p>{process.ncm || 'Não informado'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Importação</p>
                  <p>{process.importType || 'Regular'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Número de Referência</p>
                  <p>{process.referenceNumber || 'Não informado'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Despachante</p>
                  <p>{process.customsBroker || 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ship className="h-5 w-5 text-[#7E69AB]" />
                Informações Logísticas
              </CardTitle>
              <CardDescription>
                Detalhes logísticos da importação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Origem</p>
                  <p>{process.origin}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                  <p className="flex items-center gap-1.5">
                    <CalendarCheck className="h-4 w-4 text-gray-500" />
                    {process.date}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Previsão de Chegada</p>
                  <p className="flex items-center gap-1.5">
                    <CalendarCheck className="h-4 w-4 text-gray-500" />
                    {process.estimatedArrival || 'Não informado'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Incoterm</p>
                  <p>{process.incoterm || 'Não informado'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Quantidade</p>
                  <p>{process.quantity || 'Não informado'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Embalagem</p>
                  <p>{process.packageType || 'Não informado'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Peso Unitário</p>
                  <p>{process.unitWeight ? `${process.unitWeight} kg` : 'Não informado'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Peso Total</p>
                  <p>{process.totalWeight ? `${process.totalWeight} kg` : 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#7E69AB]" />
                Informações Financeiras
              </CardTitle>
              <CardDescription>
                Detalhes financeiros da importação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor da Fatura</p>
                  <p className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    {process.invoiceValue ? `${process.invoiceValue} ${process.currency || 'USD'}` : 'Não informado'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Moeda</p>
                  <p>{process.currency || 'USD'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Frete</p>
                  <p>{process.freight ? `${process.freight} ${process.currency || 'USD'}` : 'Não informado'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Seguro</p>
                  <p>{process.insurance ? `${process.insurance} ${process.currency || 'USD'}` : 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessInfoPanel;
