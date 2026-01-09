
import { useState, useCallback, useRef } from 'react';
import { Process } from '@/pages/import/ProcessesAdvanced';
import useDataInitialization from '@/hooks/use-data-initialization';
import useProcessFilters from '@/hooks/use-process-filters';
import useDebounce from '@/hooks/use-debounce';

interface UseProcessesDataProps {
  initialData: Process[];
}

export function useProcessesData({ initialData }: UseProcessesDataProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useState(false);
  
  // Using ref to track active search operations and prevent infinite updates
  const searchInProgress = useRef(false);
  
  // Use our data initialization hook
  const {
    allProcesses,
    isLoading,
  } = useDataInitialization({ initialData });
  
  // Use our process filters hook
  const {
    filteredProcesses,
    isSearching,
    setIsSearching,
    filterState,
    setFilterState,
    applyFilters
  } = useProcessFilters({ processes: allProcesses });
  
  // Internal search function that will be debounced
  const performSearch = useCallback((searchTerm: string, filters: any[]) => {
    if (searchInProgress.current) return;
    searchInProgress.current = true;
    
    try {
      const results = applyFilters(searchTerm, filters);
      
      setFilterState({ searchTerm, filters });
      setIsSearching(true);
      setCurrentPage(1);
      
      // Use the filtered results
      setTimeout(() => {
        setFilterState(prev => ({ ...prev, results }));
        setIsSearching(false);
        searchInProgress.current = false;
      }, 600); // Longer delay for smoother transitions
    } catch (error) {
      console.error("Error performing search:", error);
      setIsSearching(false);
      searchInProgress.current = false;
    }
  }, [applyFilters, setFilterState, setIsSearching]);
  
  // Debounced search function (600ms delay)
  const debouncedSearch = useDebounce(performSearch, 600);
  
  // Public search handler
  const handleSearch = useCallback((searchTerm: string, filters: any[]) => {
    // Prevent multiple searches from firing simultaneously
    if (searchInProgress.current) return;
    
    // Set searching state immediately for UI feedback
    setIsSearching(true);
    
    // Use debounced search to prevent rapid re-renders
    debouncedSearch(searchTerm, filters);
  }, [debouncedSearch, setIsSearching]);
  
  // Reset search handler
  const handleResetSearch = useCallback(() => {
    // Prevent multiple operations from firing simultaneously
    if (searchInProgress.current) return;
    
    // Set searching state immediately for UI feedback
    setIsSearching(true);
    
    setTimeout(() => {
      setFilterState({ searchTerm: '', filters: [] });
      setCurrentPage(1);
      
      // Ensure search state is properly reset
      setTimeout(() => {
        setIsSearching(false);
        searchInProgress.current = false;
      }, 300);
    }, 300);
  }, [setFilterState, setIsSearching]);

  return {
    allProcesses,
    filteredProcesses,
    isLoading,
    isSearching,
    isPending,
    currentPage,
    setCurrentPage,
    handleSearch,
    handleResetSearch
  };
}

export default useProcessesData;
