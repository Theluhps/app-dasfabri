
import React, { useCallback } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import FilterOptions from './FilterOptions';
import { FilterOption, FilterValue } from '../AdvancedSearch';

interface FilterSheetProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filterOptions: FilterOption[];
  tempFilters: FilterValue[];
  setTempFilters: React.Dispatch<React.SetStateAction<FilterValue[]>>;
  onFilterApply: () => void;
  activeFilterCount: number;
  handleFilterSheetOpen: () => void;
  theme: 'light' | 'dark';
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  setIsOpen,
  filterOptions,
  tempFilters,
  setTempFilters,
  onFilterApply,
  activeFilterCount,
  handleFilterSheetOpen,
  theme,
}) => {
  const handleFilterChange = useCallback((id: string, value: string | string[] | boolean | null) => {
    const existingFilterIndex = tempFilters.findIndex(filter => filter.id === id);
    
    if (existingFilterIndex >= 0) {
      // Update existing filter
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        // Remove filter if value is null or empty array
        const newFilters = [...tempFilters];
        newFilters.splice(existingFilterIndex, 1);
        setTempFilters(newFilters);
      } else {
        // Update filter value
        const newFilters = [...tempFilters];
        newFilters[existingFilterIndex] = { id, value };
        setTempFilters(newFilters);
      }
    } else if (value !== null && (!Array.isArray(value) || value.length > 0)) {
      // Add new filter if it has a value
      setTempFilters([...tempFilters, { id, value }]);
    }
  }, [tempFilters, setTempFilters]);
  
  const getFilterValue = useCallback((id: string) => {
    const filter = tempFilters.find(f => f.id === id);
    return filter ? filter.value : null;
  }, [tempFilters]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleFilterSheetOpen}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}>
        <SheetHeader>
          <SheetTitle className={theme === 'dark' ? 'text-gray-100' : ''}>
            Filtros
          </SheetTitle>
          <SheetDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Configure os filtros para refinar sua busca
          </SheetDescription>
        </SheetHeader>
        
        <div className="my-6 space-y-6">
          <FilterOptions 
            filterOptions={filterOptions}
            getFilterValue={getFilterValue}
            handleFilterChange={handleFilterChange}
            theme={theme}
          />
        </div>
        
        <SheetFooter>
          <div className="flex w-full justify-between">
            <Button
              variant="ghost"
              onClick={() => setTempFilters([])}
              className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
            >
              Limpar filtros
            </Button>
            <Button onClick={onFilterApply}>
              Aplicar filtros
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
