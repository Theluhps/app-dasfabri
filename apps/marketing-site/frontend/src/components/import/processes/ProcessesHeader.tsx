
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';

interface ProcessesHeaderProps {
  handleNewProcess: () => void;
  handleExportData: () => void;
  handleCSVUpload?: () => void;
}

const ProcessesHeader: React.FC<ProcessesHeaderProps> = ({
  handleNewProcess,
  handleExportData,
  handleCSVUpload
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
        <div className="h-4 w-1 bg-[#7E69AB] rounded-full"></div>
        <strong className="text-[#7E69AB]">Dasfabri Import</strong> - Gestão inteligente de processos
      </div>
      <div className="flex gap-2">
        {handleCSVUpload && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleCSVUpload}
          >
            <Upload className="h-4 w-4" />
            Importar CSV
          </Button>
        )}
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#7E69AB] text-[#7E69AB] hover:bg-[#7E69AB]/10"
          onClick={handleExportData}
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        <Button 
          className="flex items-center gap-2 bg-[#7E69AB] hover:bg-[#6a5590]"
          onClick={handleNewProcess}
        >
          <Plus className="h-4 w-4" />
          Novo Processo
        </Button>
      </div>
    </div>
  );
};

export default ProcessesHeader;
