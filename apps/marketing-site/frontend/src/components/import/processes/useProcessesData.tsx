
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockProcesses } from './data/mockData';
import { Process, ProcessesHookReturn } from './data/types';
import { usePagination } from './data/usePagination';
import { applyFilters } from './data/processFilters';
import { useProcessActions } from './data/processActions';
import { ProcessFormValues } from '../process-form/FormSchema';

// Export the Process type to make it accessible from outside
export type { Process } from './data/types';

// Only re-export the hook function, not the types
export function useProcessesData(): ProcessesHookReturn {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
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
  
  // Use the process actions hook
  const { createProcess, updateProcess, showToast } = useProcessActions();

  // Initialize with mock data
  useEffect(() => {
    setProcesses(mockProcesses);
    setFilteredProcesses(mockProcesses);
  }, []);

  // Handle search and filters
  const handleSearch = useCallback((searchTerm: string, filters: any[] = []) => {
    setSearchTerm(searchTerm);
    setActiveFilters(filters);
    
    const results = applyFilters(processes, searchTerm, filters);
    setFilteredProcesses(results);
    resetPagination();
  }, [processes, resetPagination]);

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
  const handleProcessSubmit = useCallback((formData: ProcessFormValues) => {
    if (editingProcess) {
      // Update existing process
      const updatedProcess = updateProcess(editingProcess, formData);
      setProcesses(prevProcesses => 
        prevProcesses.map(proc => proc.id === editingProcess.id ? updatedProcess : proc)
      );
      showToast('updated', editingProcess.id, formData.client);
    } else {
      // Create new process
      const newProcess = createProcess(processes, formData);
      setProcesses(prevProcesses => [...prevProcesses, newProcess]);
      showToast('created', newProcess.id, formData.client);
    }

    // Apply current filters to updated processes list
    handleSearch(searchTerm, activeFilters);
    
    // Close the form
    setShowProcessForm(false);
    setEditingProcess(null);
  }, [editingProcess, processes, createProcess, updateProcess, showToast, handleSearch, searchTerm, activeFilters]);

  // Export data to Excel
  const handleExportData = useCallback(() => {
    showToast('exported');
    
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
  }, [filteredProcesses, showToast, toast]);

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
    editingProcess
  };
}
