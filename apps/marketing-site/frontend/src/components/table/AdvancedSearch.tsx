
import React, { useState, useCallback, useMemo, useRef, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import FilterSheet from './filters/FilterSheet';
import FilterBadges from './filters/FilterBadges';
import SearchBar from './filters/SearchBar';

export interface FilterOption {
  id: string;
  label: string;
  options?: { value: string; label: string }[];
  type: 'text' | 'select' | 'date' | 'checkbox' | 'radio';
}

export interface FilterValue {
  id: string;
  value: string | string[] | boolean | null;
}

interface AdvancedSearchProps {
  placeholder?: string;
  filterOptions: FilterOption[];
  onSearch: (searchTerm: string, filters: FilterValue[]) => void;
  onReset?: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  placeholder = "Buscar...",
  filterOptions,
  onSearch,
  onReset
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterValue[]>([]);
  const [tempFilters, setTempFilters] = useState<FilterValue[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Use refs to prevent multiple operations
  const operationInProgress = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounce search to prevent too many operations
  const debouncedSearch = useCallback(() => {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setIsSearching(true);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for the search operation
    searchTimeoutRef.current = setTimeout(() => {
      // Use requestAnimationFrame to sync with browser render cycle
      requestAnimationFrame(() => {
        onSearch(searchTerm, activeFilters);
        
        // Reset operation status after a delay
        setTimeout(() => {
          setIsSearching(false);
          operationInProgress.current = false;
        }, 600);
      });
    }, 300);
  }, [searchTerm, activeFilters, onSearch]);
  
  const handleSearch = useCallback(() => {
    debouncedSearch();
  }, [debouncedSearch]);
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      debouncedSearch();
    }
  }, [debouncedSearch]);
  
  const handleClear = useCallback(() => {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setIsSearching(true);
    
    // Batch state updates
    startTransition(() => {
      setSearchTerm('');
      setActiveFilters([]);
      setTempFilters([]);
    });
    
    // Wait for next frame for smoother transition
    requestAnimationFrame(() => {
      if (onReset) onReset();
      
      // Reset operation status after a delay
      setTimeout(() => {
        setIsSearching(false);
        operationInProgress.current = false;
      }, 600);
    });
  }, [onReset]);
  
  const handleRemoveFilter = useCallback((filterId: string) => {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setIsSearching(true);
    
    // Update filters
    const newFilters = activeFilters.filter((filter) => filter.id !== filterId);
    setActiveFilters(newFilters);
    
    // Wait for next frame for smoother transition
    requestAnimationFrame(() => {
      onSearch(searchTerm, newFilters);
      
      // Reset operation status after a delay
      setTimeout(() => {
        setIsSearching(false);
        operationInProgress.current = false;
      }, 600);
    });
  }, [activeFilters, searchTerm, onSearch]);
  
  const handleFilterSheetOpen = useCallback(() => {
    setTempFilters([...activeFilters]);
    setIsOpen(true);
  }, [activeFilters]);
  
  const handleFilterApply = useCallback(() => {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setIsSearching(true);
    
    // Batch state updates
    startTransition(() => {
      setActiveFilters([...tempFilters]);
      setIsOpen(false);
    });
    
    // Wait for next frame for smoother transition
    requestAnimationFrame(() => {
      onSearch(searchTerm, tempFilters);
      
      // Reset operation status after a delay
      setTimeout(() => {
        setIsSearching(false);
        operationInProgress.current = false;
      }, 600);
    });
  }, [tempFilters, searchTerm, onSearch]);

  const activeFilterCount = activeFilters.length;

  // Memoize components to prevent unnecessary re-renders
  const searchBarElement = useMemo(() => (
    <SearchBar 
      searchTerm={searchTerm} 
      setSearchTerm={setSearchTerm}
      placeholder={placeholder}
      onKeyUp={handleKeyPress}
      theme={theme}
    />
  ), [searchTerm, placeholder, handleKeyPress, theme]);

  const filterSheetElement = useMemo(() => (
    <FilterSheet
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      filterOptions={filterOptions}
      tempFilters={tempFilters}
      setTempFilters={setTempFilters}
      onFilterApply={handleFilterApply}
      activeFilterCount={activeFilterCount}
      handleFilterSheetOpen={handleFilterSheetOpen}
      theme={theme}
    />
  ), [isOpen, filterOptions, tempFilters, handleFilterApply, activeFilterCount, handleFilterSheetOpen, theme]);

  const filterBadgesElement = useMemo(() => (
    activeFilterCount > 0 && (
      <FilterBadges 
        activeFilters={activeFilters} 
        filterOptions={filterOptions} 
        onRemoveFilter={handleRemoveFilter}
      />
    )
  ), [activeFilters, filterOptions, activeFilterCount, handleRemoveFilter]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2">
        {searchBarElement}
        
        {filterSheetElement}
        
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || isPending}
          className="transition-all duration-200"
        >
          {isSearching ? 'Buscando...' : 'Buscar'}
        </Button>
        
        {(searchTerm || activeFilterCount > 0) && (
          <Button 
            variant="ghost" 
            onClick={handleClear}
            disabled={isSearching || isPending}
            className="transition-all duration-200"
          >
            Limpar
          </Button>
        )}
      </div>
      
      <div className="min-h-[32px] transition-all duration-300">
        {filterBadgesElement}
      </div>
    </div>
  );
};

export default React.memo(AdvancedSearch);
