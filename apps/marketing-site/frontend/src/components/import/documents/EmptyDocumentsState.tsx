
import React from 'react';
import { File, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyDocumentsStateProps {
  onAddDocument?: () => void;
}

const EmptyDocumentsState: React.FC<EmptyDocumentsStateProps> = ({ onAddDocument }) => {
  return (
    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <File className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum documento anexado</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
        Clique no botão "Adicionar Documento" para enviar documentos para este processo ou arraste e solte arquivos aqui.
      </p>
      {onAddDocument && (
        <Button 
          onClick={onAddDocument}
          className="bg-[#7E69AB] hover:bg-[#6a5590] flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Adicionar Documento
        </Button>
      )}
    </div>
  );
};

export default EmptyDocumentsState;
