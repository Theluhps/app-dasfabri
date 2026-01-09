
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProcessInfoPanel from './process-details/ProcessInfoPanel';
import ProcessDocumentsTab from './ProcessDocumentsTab';
import ProcessTimeline from './ProcessTimeline';
import { Document } from './types/DocumentTypes';
import ContainerList from './logistics/ContainerList';

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
  documents?: Document[];
  timeline?: {
    date: string;
    status: string;
    description: string;
  }[];
  supplier?: string;
  currency?: string;
  importType?: string;
  customsBroker?: string;
  incoterm?: string;
  referenceNumber?: string;
  containerId?: string;
}

interface ProcessDetailsTabsProps {
  process: Process;
  documents?: Document[];
  setDocuments?: React.Dispatch<React.SetStateAction<Document[] | undefined>>;
  setShowUploadForm?: React.Dispatch<React.SetStateAction<boolean>>;
  showUploadForm?: boolean;
  handleAddDocument?: (newDoc: {name: string; type: string; size: number}) => void;
  viewDocument?: (doc: Document) => void;
  downloadDocument?: (doc: Document) => void;
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;
}

const ProcessDetailsTabs: React.FC<ProcessDetailsTabsProps> = ({
  process,
  documents = [],
  setDocuments = () => {},
  setShowUploadForm = () => {},
  showUploadForm = false,
  handleAddDocument = () => {},
  viewDocument = () => {},
  downloadDocument,
  currentTab = "details",
  setCurrentTab = () => {}
}) => {
  // Combine process documents with local state documents
  const allDocuments = [...(process.documents || []), ...documents];
  
  const timeline = process.timeline || [
    { date: '01/05/2025', status: 'Criação', description: 'Processo criado no sistema' },
    { date: '03/05/2025', status: 'Documentação', description: 'Documentos anexados ao processo' },
    { date: '05/05/2025', status: 'Análise', description: 'Processo em análise pela autoridade aduaneira' },
    { date: '10/05/2025', status: 'Atual', description: 'Aguardando liberação' },
  ];

  const handleTabChange = (value: string) => {
    if (setCurrentTab) {
      setCurrentTab(value);
    }
  };

  // Fetch related logistics data when containers tab is selected
  useEffect(() => {
    if (currentTab === "containers" && process.id) {
      console.log(`Fetching container data for process ${process.id}`);
      // In a real implementation, this would fetch container data from an API
    }
  }, [currentTab, process.id]);

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="mt-2">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="details" className="text-sm">Detalhes</TabsTrigger>
        <TabsTrigger value="documents" className="text-sm">Documentos</TabsTrigger>
        <TabsTrigger value="timeline" className="text-sm">Timeline</TabsTrigger>
        <TabsTrigger value="containers" className="text-sm">Contêineres</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="pt-4 space-y-4">
        <ProcessInfoPanel process={process} />
      </TabsContent>
      
      <TabsContent value="documents" className="pt-4 space-y-4">
        <ProcessDocumentsTab 
          processId={process.id}
          documents={allDocuments}
          showUploadForm={showUploadForm}
          setShowUploadForm={setShowUploadForm}
          onUploadComplete={handleAddDocument}
          onViewDocument={viewDocument}
          onDownloadDocument={downloadDocument}
        />
      </TabsContent>
      
      <TabsContent value="timeline" className="pt-4 space-y-6">
        <ProcessTimeline 
          events={timeline}
          onNewAnnotation={() => {
            // Abrir dialog de anotação
            if (setShowUploadForm) {
              // Usar um estado específico para anotações se necessário
            }
          }}
        />
      </TabsContent>

      <TabsContent value="containers" className="pt-4 space-y-6">
        <ContainerList 
          processId={process.id}
          containerId={process.containerId}
          showLinkButton={true} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProcessDetailsTabs;
