
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Process, ProcessesHookReturn } from './data/types';
import { usePagination } from './data/usePagination';
import { ProcessFormValues } from '../process-form/FormSchema';
import {
  createImportProcess,
  listImportProcesses,
  updateImportProcess,
  searchImportProcesses,
  ImportProcessResponse,
  ImportProcessCreate,
  ImportProcessUpdate,
} from '@/services/importProcessesApiService';

// Export the Process type to make it accessible from outside
export type { Process } from './data/types';

// Converter ImportProcessResponse para Process (formato do frontend)
const mapApiResponseToProcess = (apiProcess: ImportProcessResponse): Process => {
  return {
    id: apiProcess.reference_number,
    client: apiProcess.client,
    product: apiProcess.product,
    origin: apiProcess.origin,
    status: apiProcess.status === 'draft' ? 'Rascunho' : 
            apiProcess.status === 'in_progress' ? 'Em andamento' :
            apiProcess.status === 'completed' ? 'Concluído' : apiProcess.status,
    date: new Date(apiProcess.created_at).toLocaleDateString('pt-BR'),
    estimatedArrival: apiProcess.estimated_arrival ? new Date(apiProcess.estimated_arrival).toLocaleDateString('pt-BR') : undefined,
    invoiceValue: apiProcess.invoice_value?.toString(),
    ncm: apiProcess.ncm,
    currency: apiProcess.currency,
    importType: apiProcess.import_type,
    shippingMethod: apiProcess.shipping_method,
    incoterm: apiProcess.incoterm,
    referenceNumber: apiProcess.reference_number,
    customsBroker: apiProcess.customs_broker,
    supplier: apiProcess.supplier,
    description: apiProcess.description,
    documents: [],
    timeline: [],
  };
};

// Converter ProcessFormValues para ImportProcessCreate
const mapFormToApiCreate = (formData: ProcessFormValues): ImportProcessCreate => {
  return {
    reference_number: formData.referenceNumber || `IMP-${Date.now()}`,
    client: formData.client,
    product: formData.product,
    origin: formData.origin,
    destination: formData.origin, // Usar origin como destination por enquanto
    supplier: formData.supplier || '',
    description: formData.description,
    ncm: formData.ncm,
    invoice_value: formData.invoiceValue ? parseFloat(formData.invoiceValue.replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
    currency: formData.currency || 'USD',
    import_type: formData.importType,
    shipping_method: formData.shippingMethod,
    incoterm: formData.incoterm,
    customs_broker: formData.customsBroker,
    estimated_arrival: formData.estimatedArrival ? formData.estimatedArrival.toISOString() : undefined,
    status: 'draft',
  };
};

// Converter ProcessFormValues para ImportProcessUpdate
const mapFormToApiUpdate = (formData: ProcessFormValues): ImportProcessUpdate => {
  return {
    client: formData.client,
    product: formData.product,
    origin: formData.origin,
    destination: formData.origin,
    supplier: formData.supplier,
    description: formData.description,
    ncm: formData.ncm,
    invoice_value: formData.invoiceValue ? parseFloat(formData.invoiceValue.replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
    currency: formData.currency,
    import_type: formData.importType,
    shipping_method: formData.shippingMethod,
    incoterm: formData.incoterm,
    customs_broker: formData.customsBroker,
    estimated_arrival: formData.estimatedArrival ? formData.estimatedArrival.toISOString() : undefined,
  };
};

// Only re-export the hook function, not the types
export function useProcessesData(): ProcessesHookReturn {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Use the pagination hook
  const { 
    currentPage, 
    setCurrentPage, 
    currentItems, 
    itemsPerPage, 
    totalPages,
    resetPagination 
  } = usePagination({
    filteredProcesses
  });

  // Carregar processos do backend
  const loadProcesses = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiProcesses = await listImportProcesses({ limit: 1000 });
      const mappedProcesses = apiProcesses.map(mapApiResponseToProcess);
      setProcesses(mappedProcesses);
      setFilteredProcesses(mappedProcesses);
    } catch (error: any) {
      console.error('Erro ao carregar processos:', error);
      toast({
        title: "Erro ao carregar processos",
        description: error.message || "Não foi possível carregar os processos. Verifique se o backend está rodando.",
        variant: "destructive",
      });
      // Em caso de erro, usar array vazio
      setProcesses([]);
      setFilteredProcesses([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Carregar processos na inicialização
  useEffect(() => {
    loadProcesses();
  }, [loadProcesses]);

  // Handle search and filters
  const handleSearch = useCallback(async (searchTerm: string, filters: any[] = []) => {
    setSearchTerm(searchTerm);
    setActiveFilters(filters);
    
    try {
      setIsLoading(true);
      // Extrair filtros de status
      const statusFilter = filters.find(f => f.field === 'status')?.value;
      
      // Buscar no backend
      const apiProcesses = await searchImportProcesses(searchTerm, {
        status: statusFilter,
      });
      
      const mappedProcesses = apiProcesses.map(mapApiResponseToProcess);
      setFilteredProcesses(mappedProcesses);
      resetPagination();
    } catch (error: any) {
      console.error('Erro ao buscar processos:', error);
      toast({
        title: "Erro na busca",
        description: error.message || "Não foi possível buscar os processos.",
        variant: "destructive",
      });
      // Em caso de erro, usar lista completa
      setFilteredProcesses(processes);
    } finally {
      setIsLoading(false);
    }
  }, [processes, resetPagination, toast]);

  // Reset search and filters
  const handleResetSearch = useCallback(() => {
    setSearchTerm("");
    setActiveFilters([]);
    setFilteredProcesses(processes);
    resetPagination();
  }, [processes, resetPagination]);

  // Create new process
  const handleNewProcess = useCallback(() => {
    setEditingProcess(null);
    setShowProcessForm(true);
  }, []);

  // Edit existing process
  const handleEditProcess = useCallback((process: Process) => {
    setEditingProcess(process);
    setShowProcessForm(true);
  }, []);

  // Process form submission (create or update)
  const handleProcessSubmit = useCallback(async (formData: ProcessFormValues) => {
    try {
      setIsLoading(true);
      
      if (editingProcess) {
        // Update existing process - buscar o processo na lista para obter o ID numérico
        const existingProcess = processes.find(p => p.id === editingProcess.id);
        if (!existingProcess) {
          throw new Error('Processo não encontrado para atualização');
        }
        
        // Buscar o processo no backend pelo reference_number para obter o ID numérico
        const allProcesses = await listImportProcesses({ limit: 1000 });
        const apiProcess = allProcesses.find(p => p.reference_number === editingProcess.id);
        if (!apiProcess) {
          throw new Error('Processo não encontrado no backend');
        }
        
        const updateData = mapFormToApiUpdate(formData);
        const updatedApiProcess = await updateImportProcess(apiProcess.id, updateData);
        const updatedProcess = mapApiResponseToProcess(updatedApiProcess);
        
        setProcesses(prevProcesses => 
          prevProcesses.map(proc => proc.id === editingProcess.id ? updatedProcess : proc)
        );
        
        toast({
          title: 'Processo atualizado',
          description: `Processo ${updatedProcess.id} para cliente ${formData.client} atualizado com sucesso.`,
          variant: 'default',
        });
      } else {
        // Create new process
        const createData = mapFormToApiCreate(formData);
        const newApiProcess = await createImportProcess(createData);
        const newProcess = mapApiResponseToProcess(newApiProcess);
        
        setProcesses(prevProcesses => [...prevProcesses, newProcess]);
        
        toast({
          title: 'Processo criado',
          description: `Processo ${newProcess.id} para cliente ${formData.client} criado com sucesso.`,
          variant: 'default',
        });
      }

      // Recarregar processos do backend
      await loadProcesses();
      
      // Apply current filters
      await handleSearch(searchTerm, activeFilters);
      
      // Close the form
      setShowProcessForm(false);
      setEditingProcess(null);
    } catch (error: any) {
      console.error('Erro ao salvar processo:', error);
      toast({
        title: editingProcess ? "Erro ao atualizar processo" : "Erro ao criar processo",
        description: error.message || "Não foi possível salvar o processo. Verifique se o backend está rodando.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [editingProcess, loadProcesses, handleSearch, searchTerm, activeFilters, toast]);

  // Export data to Excel
  const handleExportData = useCallback(() => {
    // This would typically connect to a real export function
    console.log('Exporting filtered processes to Excel', filteredProcesses);
    
    // Simulated export delay
    setTimeout(() => {
      const fileName = `processos_importacao_${new Date().toISOString().split('T')[0]}.xlsx`;
      toast({
        title: "Exportação concluída",
        description: `Os dados foram exportados para ${fileName}`,
        variant: "default",
      });
    }, 1500);
  }, [filteredProcesses, toast]);

  return {
    processes,
    filteredProcesses,
    currentItems,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    handleSearch,
    handleResetSearch,
    handleNewProcess,
    handleEditProcess,
    handleProcessSubmit,
    handleExportData,
    showProcessForm,
    setShowProcessForm,
    editingProcess,
    isLoading,
  };
}
