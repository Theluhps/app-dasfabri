
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Filter, Plus, RefreshCw } from 'lucide-react';
import ProcessesAdvancedTable from '@/components/import/ProcessesAdvancedTable';
import ProcessesAdvancedFilters from '@/components/import/ProcessesAdvancedFilters';
import ProcessesPagination from '@/components/import/ProcessesPagination';
import ProcessesLoadingSkeleton from '@/components/import/ProcessesLoadingSkeleton';
import { Process } from '@/pages/import/ProcessesAdvanced';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProcessesAdvancedContentProps {
  theme: string;
  filteredProcesses: Process[];
  allProcesses: Process[];
  currentItems: Process[];
  isLoading: boolean;
  isSearching?: boolean;
  isPending?: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  handleSearch: (searchTerm: string, filters: any[]) => void;
  handleResetSearch: () => void;
  handleNewProcess: () => void;
  handleEditProcess?: (process: Process) => void;
}

const ProcessesAdvancedContent: React.FC<ProcessesAdvancedContentProps> = ({
  theme,
  filteredProcesses,
  allProcesses,
  currentItems,
  isLoading,
  isSearching = false,
  isPending = false,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleSearch,
  handleResetSearch,
  handleNewProcess,
  handleEditProcess
}) => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exportando processos",
      description: "Seus processos estão sendo exportados para CSV.",
    });
  };

  // Determine if we should show the loading state
  const showLoading = isLoading || isSearching;
  
  // Memoize components to prevent unnecessary re-renders
  const filterSection = useMemo(() => (
    <ProcessesAdvancedFilters
      onSearch={handleSearch}
      onReset={handleResetSearch}
    />
  ), [handleSearch, handleResetSearch]);
  
  // Content section with conditional loading state
  const tableSection = useMemo(() => {
    if (showLoading) {
      return (
        <div className="animate-fadeIn transition-opacity duration-300 ease-in-out">
          <ProcessesLoadingSkeleton />
        </div>
      );
    }
    
    return (
      <div className="animate-fadeIn transition-opacity duration-300 ease-in-out">
        <ScrollArea className="w-full h-[600px] transition-opacity duration-300 ease-in-out [&>[data-radix-scroll-area-scrollbar]]:bg-gray-100 dark:[&>[data-radix-scroll-area-scrollbar]]:bg-gray-800 [&>[data-radix-scroll-area-scrollbar]]:rounded [&>[data-radix-scroll-area-scrollbar-thumb]]:bg-gray-300 dark:[&>[data-radix-scroll-area-scrollbar-thumb]]:bg-gray-600 [&>[data-radix-scroll-area-scrollbar-thumb]]:rounded [&>[data-radix-scroll-area-scrollbar-thumb]]:hover:bg-gray-400 dark:[&>[data-radix-scroll-area-scrollbar-thumb]]:hover:bg-gray-500">
          <ProcessesAdvancedTable 
            processes={currentItems} 
            theme={theme} 
            onEditProcess={handleEditProcess}
          />
        </ScrollArea>
        
        {filteredProcesses.length > 0 && (
          <div className="mt-5 transition-opacity duration-300 ease-in-out">
            <ProcessesPagination
              filteredCount={filteredProcesses.length}
              totalCount={allProcesses.length}
              currentPage={currentPage}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    );
  }, [showLoading, currentItems, theme, handleEditProcess, filteredProcesses.length, allProcesses.length, currentPage, itemsPerPage, setCurrentPage]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <div className="h-4 w-1 bg-[#7E69AB] rounded-full"></div>
          <strong className="text-[#7E69AB]">Dasfabri Import</strong> - Gestão inteligente de processos
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-[#7E69AB] text-[#7E69AB] hover:bg-[#7E69AB]/10 transition-colors duration-200"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button 
            className="flex items-center gap-2 bg-[#7E69AB] hover:bg-[#6a5590] transition-colors duration-200"
            onClick={handleNewProcess}
          >
            <Plus className="h-4 w-4" />
            Novo Processo
          </Button>
        </div>
      </div>
      
      <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''} border-t-4 border-t-[#7E69AB] shadow-sm transition-all duration-300`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : ''}`}>
            <Filter className="h-5 w-5 text-[#7E69AB]" />
            Busca Avançada
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Filtre os processos por diferentes critérios para encontrar informações específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filterSection}
        </CardContent>
      </Card>
      
      <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''} border-t-4 border-t-blue-500 shadow-sm transition-all duration-300`}>
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
            className={`flex items-center gap-1 text-muted-foreground hover:text-[#7E69AB] hover:bg-[#7E69AB]/10 transition-colors duration-200 ${(showLoading || isPending) ? 'opacity-50' : ''}`}
            onClick={handleResetSearch}
            disabled={showLoading || isPending}
          >
            <RefreshCw className={`h-4 w-4 ${(showLoading || isPending) ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] relative">
            {tableSection}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(ProcessesAdvancedContent);
