
import { useCallback, useState } from 'react';
import { Process } from '@/pages/import/ProcessesAdvanced';
import * as ProcessSearch from '@/utils/process-search';

interface UseProcessFiltersProps {
  processes: Process[];
}

interface FilterState {
  searchTerm: string;
  filters: any[];
}

export function useProcessFilters({ processes }: UseProcessFiltersProps) {
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>(processes);
  const [isSearching, setIsSearching] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    filters: []
  });
  
  /**
   * Applies all filters to the processes
   */
  const applyFilters = useCallback((searchTerm: string, filters: any[]) => {
    let results = [...processes];
    
    // Apply search term
    if (searchTerm) {
      results = ProcessSearch.applyTextSearch(results, searchTerm);
    }
    
    // Apply filters
    if (filters.length > 0) {
      filters.forEach((filter) => {
        // Status filter
        if (filter.id === 'status' && Array.isArray(filter.value) && filter.value.length > 0) {
          results = ProcessSearch.applyStatusFilter(results, filter.value as string[]);
        }
        
        // Origin filter
        if (filter.id === 'origin' && typeof filter.value === 'string') {
          results = ProcessSearch.applyOriginFilter(results, filter.value as string);
        }
        
        // Date filter (start date)
        if (filter.id === 'date' && typeof filter.value === 'string') {
          results = ProcessSearch.applyDateFilters(results, filter.value, undefined);
        }
        
        // Date filter (end date)
        if (filter.id === 'date_end' && typeof filter.value === 'string') {
          results = ProcessSearch.applyDateFilters(results, undefined, filter.value);
        }
        
        // Category filter
        if (filter.id === 'category' && typeof filter.value === 'string') {
          results = ProcessSearch.applyCategoryFilter(results, filter.value);
        }
        
        // Shipping status filter
        if (filter.id === 'shipping_status' && typeof filter.value === 'string') {
          results = ProcessSearch.applyShippingStatusFilter(results, filter.value);
        }
        
        // Priority filter
        if (filter.id === 'priority' && typeof filter.value === 'string') {
          results = ProcessSearch.applyPriorityFilter(results, filter.value);
        }
        
        // Integration filter
        if (filter.id === 'integration' && typeof filter.value === 'string') {
          results = ProcessSearch.applyIntegrationFilter(results, filter.value);
        }
        
        // Tracking stage filter
        if (filter.id === 'tracking_stage' && typeof filter.value === 'string') {
          results = ProcessSearch.applyTrackingStageFilter(results, filter.value);
        }
      });
    }
    
    return results;
  }, [processes]);

  return {
    filteredProcesses,
    isSearching,
    setIsSearching,
    filterState,
    setFilterState,
    applyFilters
  };
}

export default useProcessFilters;
