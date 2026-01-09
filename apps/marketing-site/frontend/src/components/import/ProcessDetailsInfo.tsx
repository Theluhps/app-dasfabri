
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  description?: string;
  importType?: string;
  shippingMethod?: string;
  currency?: string;
  incoterm?: string;
  referenceNumber?: string;
  customsBroker?: string;
  supplier?: string;
}

interface ProcessDetailsInfoProps {
  process: Process;
}

const ProcessDetailsInfo: React.FC<ProcessDetailsInfoProps> = ({ process }) => {
  // Função para formatar o tipo de importação
  const formatImportType = (type?: string) => {
    switch (type) {
      case 'regular': return 'Importação Regular';
      case 'temporary': return 'Importação Temporária';
      case 'drawback': return 'Drawback';
      case 'reimport': return 'Reimportação';
      case 'express': return 'Importação Expressa';
      default: return type || 'Não definido';
    }
  };

  // Função para formatar o método de transporte
  const formatShippingMethod = (method?: string) => {
    switch (method) {
      case 'maritime': return 'Marítimo';
      case 'air': return 'Aéreo';
      case 'road': return 'Rodoviário';
      case 'rail': return 'Ferroviário';
      case 'multimodal': return 'Multimodal';
      default: return method || 'Não definido';
    }
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Liberado': return 'bg-green-100 text-green-800 border-green-300';
      case 'Aguardando documentos': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Documentação completa': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Em análise': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            Processo {process.id}
            <Badge className={getStatusColor(process.status)}>{process.status}</Badge>
          </h3>
          <p className="text-muted-foreground mt-1">Criado em {process.date}</p>
        </div>
        
        {process.estimatedArrival && (
          <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">
            Chegada prevista: {process.estimatedArrival}
          </div>
        )}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Cliente</h4>
                <p className="font-medium">{process.client}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Fornecedor</h4>
                <p className="font-medium">{process.supplier || 'Não informado'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Produto</h4>
                <p className="font-medium">{process.product}</p>
              </div>
              
              {process.description && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h4>
                  <p className="text-sm">{process.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Origem</h4>
                <p className="font-medium">{process.origin}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Valor</h4>
                <p className="font-medium">{process.invoiceValue || 'Não informado'} {process.currency || ''}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">NCM</h4>
                <p className="font-medium">{process.ncm || 'Não informado'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Tipo de Importação</h4>
                <p className="font-medium">{formatImportType(process.importType)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Transporte</h4>
                <p className="font-medium">{formatShippingMethod(process.shippingMethod)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Incoterm</h4>
                <p className="font-medium">{process.incoterm || 'Não informado'}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Referência</h4>
              <p className="font-medium">{process.referenceNumber || 'Não informado'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Despachante</h4>
              <p className="font-medium">{process.customsBroker || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessDetailsInfo;
