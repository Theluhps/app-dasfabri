
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Share, Archive, CheckCircle } from 'lucide-react';

interface DocumentsBatchActionsProps {
  selectedCount: number;
  onBatchDownload?: () => void;
  onBatchDelete?: () => void;
  onBatchArchive?: () => void;
  onBatchApprove?: () => void;
  onBatchShare?: () => void;
}

const DocumentsBatchActions: React.FC<DocumentsBatchActionsProps> = ({ 
  selectedCount,
  onBatchDownload,
  onBatchDelete,
  onBatchArchive,
  onBatchApprove,
  onBatchShare
}) => {
  return (
    <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
      <span className="text-sm text-gray-700">
        {selectedCount} {selectedCount === 1 ? 'documento selecionado' : 'documentos selecionados'}
      </span>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBatchDownload}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" /> 
          Download
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBatchShare}
          className="flex items-center gap-1"
        >
          <Share className="h-4 w-4" /> 
          Compartilhar
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBatchArchive}
          className="flex items-center gap-1"
        >
          <Archive className="h-4 w-4" /> 
          Arquivar
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBatchApprove}
          className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
        >
          <CheckCircle className="h-4 w-4" /> 
          Aprovar
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onBatchDelete}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" /> 
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default DocumentsBatchActions;
