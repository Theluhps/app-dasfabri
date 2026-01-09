
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterOption {
  key: string;
  label: string;
  options?: { value: string; label: string }[];
}

interface FilterState {
  status: string[];
  type: string[];
}

interface LicenseFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const LicenseFilter: React.FC<LicenseFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    type: [],
  });
  
  const [isOpen, setIsOpen] = useState(false);
  
  const filterOptions: FilterOption[] = [
    { 
      key: 'status', 
      label: 'Status',
      options: [
        { value: 'Aprovada', label: 'Aprovada' },
        { value: 'Em análise', label: 'Em análise' },
        { value: 'Expirada', label: 'Expirada' },
      ]
    },
    { 
      key: 'type', 
      label: 'Tipo de Licença',
      options: [
        { value: 'Licença de Importação', label: 'Licença de Importação' },
        { value: 'LPCO', label: 'LPCO' },
        { value: 'Certificado Fitossanitário', label: 'Certificado Fitossanitário' },
        { value: 'Certificado de Origem', label: 'Certificado de Origem' },
      ]
    },
  ];
  
  const handleToggleFilter = (filterKey: keyof FilterState, value: string) => {
    setFilters(prevFilters => {
      const currentFilters = [...prevFilters[filterKey]];
      const index = currentFilters.indexOf(value);
      
      if (index >= 0) {
        currentFilters.splice(index, 1);
      } else {
        currentFilters.push(value);
      }
      
      const newFilters = {
        ...prevFilters,
        [filterKey]: currentFilters,
      };
      
      return newFilters;
    });
  };
  
  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };
  
  const clearFilters = () => {
    const emptyFilters = {
      status: [],
      type: [],
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };
  
  const activeFilterCount = filters.status.length + filters.type.length;
  
  return (
    <div className="flex flex-wrap gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filtrar Licenças</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={clearFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            </div>
            
            <div className="space-y-4">
              {filterOptions.map((filterOption) => (
                <div key={filterOption.key} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">{filterOption.label}</h4>
                  <div className="space-y-1">
                    {filterOption.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${filterOption.key}-${option.value}`}
                          checked={filters[filterOption.key as keyof FilterState].includes(option.value)}
                          onCheckedChange={() => handleToggleFilter(filterOption.key as keyof FilterState, option.value)}
                        />
                        <label 
                          htmlFor={`${filterOption.key}-${option.value}`}
                          className="text-sm cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={applyFilters}>Aplicar Filtros</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.status.map(status => (
            <Badge 
              key={`status-${status}`} 
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              Status: {status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleToggleFilter('status', status)}
              />
            </Badge>
          ))}
          {filters.type.map(type => (
            <Badge 
              key={`type-${type}`} 
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              Tipo: {type}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleToggleFilter('type', type)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default LicenseFilter;
