
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download, FileText } from 'lucide-react';
import DocumentForm from './DocumentForm';
import EmptyDocumentsState from './documents/EmptyDocumentsState';
import DocumentsTable from './documents/DocumentsTable';
import DocumentsBatchActions from './documents/DocumentsBatchActions';
import { Document, ProcessDocumentsProps } from './types/DocumentTypes';
import { 
  getDocumentTypeLabel, 
  getStatusColor, 
  formatSize, 
  formatDate 
} from './utils/documentUtils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const ProcessDocumentsTab: React.FC<ProcessDocumentsProps> = ({
  processId,
  documents = [],
  showUploadForm,
  setShowUploadForm,
  onUploadComplete,
  onViewDocument,
  onDownloadDocument
}) => {
  // Estados para documentos selecionados e filtros
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Filtrar documentos
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.comments || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Manipuladores para seleção de documentos
  const handleToggleSelect = (id: string) => {
    setSelectedDocuments(prev => {
      if (prev.includes(id)) {
        return prev.filter(docId => docId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };
  
  // Limpar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
  };
  
  // Status disponíveis para filtro
  const availableStatuses = [...new Set(documents.map(doc => doc.status))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h3 className="font-medium text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#7E69AB]" />
            Documentos do Processo
          </h3>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os documentos relacionados a este processo de importação
          </p>
        </div>
        <Button 
          variant="default" 
          size="sm"
          className="flex items-center gap-1.5 bg-[#7E69AB] hover:bg-[#6a5590]"
          onClick={() => setShowUploadForm(true)}
        >
          <Plus className="h-4 w-4" /> Adicionar Documento
        </Button>
      </div>

      {documents.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Filtrar por:</span>
              {availableStatuses.map(status => (
                <Badge
                  key={status}
                  variant="outline"
                  className={`cursor-pointer ${statusFilter === status ? getStatusColor(status) : ''}`}
                  onClick={() => setStatusFilter(prev => prev === status ? null : status)}
                >
                  {status}
                </Badge>
              ))}
              
              {(searchTerm || statusFilter) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearFilters}
                  className="text-sm"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <DocumentsTable 
              documents={filteredDocuments}
              selectedDocuments={selectedDocuments}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onViewDocument={onViewDocument}
              onDownloadDocument={onDownloadDocument}
              getDocumentTypeLabel={getDocumentTypeLabel}
              getStatusColor={getStatusColor}
              formatSize={formatSize}
              formatDate={formatDate}
            />
            
            {selectedDocuments.length > 0 && (
              <DocumentsBatchActions selectedCount={selectedDocuments.length} />
            )}
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500 p-2">
            <span>{documents.length} documentos no total</span>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5"
            >
              <Download className="h-3 w-3" />
              Exportar Lista
            </Button>
          </div>
        </>
      ) : (
        <EmptyDocumentsState onAddDocument={() => setShowUploadForm(true)} />
      )}
      
      <DocumentForm
        open={showUploadForm}
        onOpenChange={setShowUploadForm}
        onSubmit={onUploadComplete}
        processId={processId}
      />
    </div>
  );
};

export default ProcessDocumentsTab;
