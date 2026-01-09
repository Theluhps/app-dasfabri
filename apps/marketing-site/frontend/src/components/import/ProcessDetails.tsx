
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, FileDown, ArrowLeft, ArrowRight } from 'lucide-react';
import DocumentPreview from './DocumentPreview';
import ProcessDetailsTabs from './ProcessDetailsTabs';
import { Document, DocumentType, DocumentStatus } from './types/DocumentTypes';
import ProcessFinancialDetails from '../financial/ProcessFinancialDetails';

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

interface ProcessDetailsProps {
  process: Process | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  process,
  open,
  onOpenChange
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentTab, setCurrentTab] = useState("details");

  if (!process) return null;

  const handleAddDocument = (newDoc: {name: string; type: string; size: number}) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: newDoc.name,
      type: newDoc.type as DocumentType,
      uploadDate: new Date(),
      status: 'Pendente' as DocumentStatus,
      size: newDoc.size,
      processId: process.id
    };
    
    setDocuments(prev => [...prev, newDocument]);
    setShowUploadForm(false);
  };
  
  const viewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDocumentPreview(true);
  };

  const downloadDocument = (doc: Document) => {
    // Simular download do documento
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      // Criar um link de download simulado
      const link = document.createElement('a');
      link.href = `#download-${doc.id}`;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const tabs = ["details", "documents", "timeline", "containers", "financial"];
  
  const getTabName = (tab: string) => {
    switch (tab) {
      case "details": return "Detalhes";
      case "documents": return "Documentos";
      case "timeline": return "Timeline";
      case "containers": return "Contêineres";
      case "financial": return "Financeiro";
      default: return tab;
    }
  };

  const handlePreviousTab = () => {
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Processo {process.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-gray-500" 
            onClick={handlePreviousTab}
          >
            <ArrowLeft className="h-4 w-4" /> Anterior
          </Button>
          
          <div className="font-medium">
            {getTabName(currentTab)}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-gray-500" 
            onClick={handleNextTab}
          >
            Próximo <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {currentTab === "financial" ? (
          <ProcessFinancialDetails processId={process.id} />
        ) : (
          <ProcessDetailsTabs
            process={process}
            documents={documents}
            setDocuments={setDocuments}
            showUploadForm={showUploadForm}
            setShowUploadForm={setShowUploadForm}
            handleAddDocument={handleAddDocument}
            viewDocument={viewDocument}
            currentTab={currentTab === "financial" ? "details" : currentTab}
            setCurrentTab={setCurrentTab}
          />
        )}
        
        <DialogFooter className="sm:justify-between mt-4 pt-2 border-t">
          <Button variant="outline" className="flex items-center gap-1.5">
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
      
      <DocumentPreview
        document={selectedDocument}
        open={showDocumentPreview}
        onOpenChange={setShowDocumentPreview}
      />
    </Dialog>
  );
};

export default ProcessDetails;
