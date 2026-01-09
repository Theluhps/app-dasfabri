import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileDown, File, Calendar, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Document } from './types/DocumentTypes';

interface DocumentPreviewProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  open,
  onOpenChange
}) => {
  if (!document) return null;
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Aprovado':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Pendente':
      case 'Em análise':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'Rejeitado':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <File className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
      case 'Em análise':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const formatDate = (date: Date | string): string => {
    if (!date) return 'N/A';
    if (typeof date === 'string') {
      // Tenta converter string para data
      try {
        return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
      } catch (e) {
        return date;
      }
    }
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <File className="h-5 w-5" />
            Visualização do Documento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Previsualização simulada do documento */}
          <div className="border rounded-lg h-64 flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-2">
              <File className="h-16 w-16 mx-auto text-blue-500" />
              <p className="text-lg font-medium">{document.name}</p>
              <p className="text-sm text-gray-500">
                Clique em "Download" para visualizar o documento completo
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p>{document.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo</p>
              <p>{document.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Upload</p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-500" />
                {formatDate(document.uploadDate)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="flex items-center gap-1.5">
                {getStatusIcon(document.status)}
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(document.status)}`}>
                  {document.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tamanho</p>
              <p>{formatFileSize(document.size)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Processo</p>
              <p>{document.processId}</p>
            </div>
          </div>
          
          {document.comments && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Comentários</p>
              <div className="bg-gray-50 p-3 rounded-md border text-sm">
                {document.comments}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" className="flex items-center gap-1.5">
            <FileDown className="h-4 w-4" />
            Download
          </Button>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
