import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  FileDown, 
  Package, 
  Truck, 
  DollarSign, 
  CalendarDays,
  Map,
  Users,
  Building,
  Edit 
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import ProcessDetailsTabs from './ProcessDetailsTabs';
import { Document, DocumentType, DocumentStatus } from './types/DocumentTypes';

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
  currency?: string;
  importType?: string;
  supplier?: string;
  shippingMethod?: string;
  incoterm?: string;
  referenceNumber?: string;
  customsBroker?: string;
  documents?: Document[];
  timeline?: {
    date: string;
    status: string;
    description: string;
  }[];
}

interface ProcessDetailViewProps {
  process: Process | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (process: Process) => void;
}

const ProcessDetailView: React.FC<ProcessDetailViewProps> = ({
  process,
  open,
  onOpenChange,
  onEdit
}) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  if (!process) return null;
  
  const handleEdit = () => {
    if (onEdit && process) {
      onEdit(process);
      onOpenChange(false);
    }
  };
  
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
  
  const handleExportPDF = () => {
    toast({
      title: "Exportando processo",
      description: `O processo ${process.id} está sendo exportado para PDF.`,
    });
  };

  const handleAddDocument = (newDoc: {name: string; type: string; size: number}) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: newDoc.name,
      type: newDoc.type as DocumentType,
      size: newDoc.size,
      uploadDate: new Date(),
      status: 'Pendente' as DocumentStatus,
      processId: process.id
    };
    setDocuments(prev => [...(prev || []), newDocument]);
  };

  const viewDocument = (doc: Document) => {
    toast({
      title: "Visualizando documento",
      description: `Documento ${doc.name} está sendo aberto.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-[#7E69AB]" />
                Processo {process.id}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Cliente: {process.client} • Produto: {process.product}
              </DialogDescription>
            </div>
            <Badge className={`${getStatusColor(process.status)} px-3 py-1`}>{process.status}</Badge>
          </div>
        </DialogHeader>
        
        {/* Cards com informações rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-[#7E69AB]/10 rounded-full p-2">
                <Building className="h-5 w-5 text-[#7E69AB]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fornecedor</p>
                <p className="font-medium">{process.supplier || "Não informado"}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-[#7E69AB]/10 rounded-full p-2">
                <Map className="h-5 w-5 text-[#7E69AB]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Origem</p>
                <p className="font-medium">{process.origin}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-[#7E69AB]/10 rounded-full p-2">
                <CalendarDays className="h-5 w-5 text-[#7E69AB]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chegada Prevista</p>
                <p className="font-medium">{process.estimatedArrival || "Não definida"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="details" className="flex-1">
              <Package className="h-4 w-4 mr-2" />
              Informações Gerais
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Documentação
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex-1">
              <Truck className="h-4 w-4 mr-2" />
              Logística
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex-1">
              <DollarSign className="h-4 w-4 mr-2" />
              Financeiro
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Produto</h4>
                      <p className="font-medium">{process.product}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">NCM</h4>
                      <p className="font-medium">{process.ncm || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Tipo de Importação</h4>
                      <p className="font-medium">{formatImportType(process.importType)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Data do Processo</h4>
                      <p className="font-medium">{process.date}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Valor</h4>
                      <p className="font-medium">
                        {process.currency && process.invoiceValue 
                          ? `${process.currency} ${process.invoiceValue}` 
                          : "Não informado"}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Incoterm</h4>
                      <p className="font-medium">{process.incoterm || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Referência</h4>
                      <p className="font-medium">{process.referenceNumber || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Despachante</h4>
                      <p className="font-medium">{process.customsBroker || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Responsáveis */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-[#7E69AB]" />
                  Responsáveis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 font-semibold">CM</span>
                    </div>
                    <div>
                      <p className="font-medium">Carlos Mendes</p>
                      <p className="text-sm text-muted-foreground">Analista de Importação</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-semibold">AP</span>
                    </div>
                    <div>
                      <p className="font-medium">Ana Paula</p>
                      <p className="text-sm text-muted-foreground">Documentação</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <ProcessDetailsTabs 
              process={process}
              documents={documents}
              setDocuments={setDocuments}
              showUploadForm={showUploadForm}
              setShowUploadForm={setShowUploadForm}
              handleAddDocument={handleAddDocument}
              viewDocument={viewDocument}
            />
          </TabsContent>
          
          <TabsContent value="logistics">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-[#7E69AB]" />
                  Informações Logísticas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Método de Transporte</h4>
                      <p className="font-medium">{formatShippingMethod(process.shippingMethod)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Porto de Origem</h4>
                      <p className="font-medium">Shanghai, China</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Porto de Destino</h4>
                      <p className="font-medium">Santos, Brasil</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Data de Embarque</h4>
                      <p className="font-medium">10/05/2025</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">ETA</h4>
                      <p className="font-medium">{process.estimatedArrival || "Não definido"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Transportadora</h4>
                      <p className="font-medium">MSC Mediterranean</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-[#7E69AB]" />
                  Informações Financeiras
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm text-muted-foreground">Valor FOB</h4>
                      <p className="text-xl font-bold">USD 45,000.00</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm text-muted-foreground">Frete</h4>
                      <p className="text-xl font-bold">USD 5,500.00</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm text-muted-foreground">Seguro</h4>
                      <p className="text-xl font-bold">USD 1,200.00</p>
                    </CardContent>
                  </Card>
                </div>
                
                <h4 className="font-medium mb-3">Tributos Estimados</h4>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Imposto de Importação (II)</span>
                    <span className="font-medium">R$ 23,456.78</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">IPI</span>
                    <span className="font-medium">R$ 12,345.67</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">PIS/COFINS</span>
                    <span className="font-medium">R$ 8,765.43</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">ICMS</span>
                    <span className="font-medium">R$ 34,567.89</span>
                  </div>
                  <div className="flex justify-between py-2 font-medium text-lg">
                    <span>Total</span>
                    <span>R$ 79,135.77</span>
                  </div>
                </div>
                
                <h4 className="font-medium mb-3">Status de Pagamentos</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="font-medium">Adiantamento ao Fornecedor</p>
                      <p className="text-sm text-muted-foreground">Pago em 05/05/2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">USD 22,500.00</p>
                      <Badge variant="success">Pago</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <p className="font-medium">Saldo Fornecedor</p>
                      <p className="text-sm text-muted-foreground">Vencimento em 20/05/2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">USD 22,500.00</p>
                      <Badge variant="warning">Pendente</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">
            Última atualização: 10/05/2025 às 15:30
          </span>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessDetailView;
