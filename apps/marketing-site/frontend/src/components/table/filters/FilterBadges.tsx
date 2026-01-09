
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FilterOption, FilterValue } from '../AdvancedSearch';

interface FilterBadgesProps {
  activeFilters: FilterValue[];
  filterOptions: FilterOption[];
  onRemoveFilter: (filterId: string) => void;
}

const FilterBadges: React.FC<FilterBadgesProps> = ({
  activeFilters,
  filterOptions,
  onRemoveFilter
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map((filter) => {
        const filterOption = filterOptions.find(option => option.id === filter.id);
        
        let label = filterOption?.label || filter.id;
        let value: string = '';
        
        if (Array.isArray(filter.value)) {
          if (filterOption?.options) {
            value = filter.value
              .map(v => filterOption.options?.find(o => o.value === v)?.label || v)
              .join(', ');
          } else {
            value = filter.value.join(', ');
          }
        } else if (typeof filter.value === 'boolean') {
          value = filter.value ? 'Sim' : 'Não';
        } else if (filter.value) {
          if (filterOption?.options) {
            value = filterOption.options.find(o => o.value === filter.value)?.label || String(filter.value);
          } else {
            value = String(filter.value);
          }
        }
        
        return (
          <Badge key={filter.id} variant="outline" className="flex items-center gap-1 py-1.5">
            <span className="font-medium">{label}:</span>
            <span>{value}</span>
            <button
              onClick={() => onRemoveFilter(filter.id)}
              className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}
    </div>
  );
};

export default FilterBadges;
