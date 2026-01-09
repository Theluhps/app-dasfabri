
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import ProcessesTable from '@/components/import/ProcessesTable';
import ProcessesPagination from '@/components/import/ProcessesPagination';

interface Process {
  id: string;
  client: string;
  product: string;
  origin: string;
  status: string;
  date: string;
  estimatedArrival?: string;
  invoiceValue?: string;
  ncm?: string;
  currency?: string;
  importType?: string;
  supplier?: string;
}

interface ProcessesListCardProps {
  theme: string;
  currentItems: Process[];
  handleShowDetails: (process: Process) => void;
  handleEditProcess?: (process: Process) => void;
  filteredProcesses: Process[];
  processes: Process[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  handleResetSearch: () => void;
}

const ProcessesListCard: React.FC<ProcessesListCardProps> = ({
  theme,
  currentItems,
  handleShowDetails,
  handleEditProcess,
  filteredProcesses,
  processes,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleResetSearch
}) => {
  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : ''}`}>
            Processos {filteredProcesses.length > 0 && <span className="text-sm font-normal text-muted-foreground">({filteredProcesses.length} resultados)</span>}
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Lista completa de processos de importação gerenciados pela plataforma
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          className="flex items-center gap-1 text-muted-foreground hover:text-[#7E69AB] hover:bg-[#7E69AB]/10"
          onClick={handleResetSearch}
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            <ProcessesTable 
              processes={currentItems} 
              handleShowDetails={handleShowDetails}
              handleEditProcess={handleEditProcess}
            />
          </div>
        </div>
        
        {filteredProcesses.length > 0 && (
          <div className="mt-5">
            <ProcessesPagination
              filteredCount={filteredProcesses.length}
              totalCount={processes.length}
              currentPage={currentPage}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessesListCard;
