
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface DateRange {
  start?: Date;
  end?: Date;
}

interface FilterTagsProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  filterDate: Date | undefined;
  setFilterDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  filterOrigin: string;
  setFilterOrigin: React.Dispatch<React.SetStateAction<string>>;
  filterClient: string;
  setFilterClient: React.Dispatch<React.SetStateAction<string>>;
  filterDateRange: DateRange;
  setFilterDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  activeFiltersCount: number;
}

const FilterTags: React.FC<FilterTagsProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
  filterOrigin,
  setFilterOrigin,
  filterClient,
  setFilterClient,
  filterDateRange,
  setFilterDateRange,
  activeFiltersCount
}) => {
  if (activeFiltersCount === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {searchTerm && (
        <Badge variant="outline" className="flex items-center gap-1">
          Busca: {searchTerm}
          <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-gray-100 rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {filterStatus && (
        <Badge variant="outline" className="flex items-center gap-1">
          Status: {filterStatus}
          <button onClick={() => setFilterStatus('')} className="ml-1 hover:bg-gray-100 rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {filterDate && (
        <Badge variant="outline" className="flex items-center gap-1">
          Data: {filterDate.toLocaleDateString('pt-BR')}
          <button onClick={() => setFilterDate(undefined)} className="ml-1 hover:bg-gray-100 rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {filterOrigin && (
        <Badge variant="outline" className="flex items-center gap-1">
          Origem: {filterOrigin}
          <button onClick={() => setFilterOrigin('')} className="ml-1 hover:bg-gray-100 rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {filterClient && (
        <Badge variant="outline" className="flex items-center gap-1">
          Cliente: {filterClient}
          <button onClick={() => setFilterClient('')} className="ml-1 hover:bg-gray-100 rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {filterDateRange.start && (
        <Badge variant="outline" className="flex items-center gap-1">
          A partir de: {filterDateRange.start.toLocaleDateString('pt-BR')}
          <button onClick={() => setFilterDateRange(prev => ({ ...prev, start: undefined }))} className="ml-1 hover:bg-gray-100 rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {filterDateRange.end && (
        <Badge variant="outline" className="flex items-center gap-1">
          Até: {filterDateRange.end.toLocaleDateString('pt-BR')}
          <button onClick={() => setFilterDateRange(prev => ({ ...prev, end: undefined }))} className="ml-1 hover:bg-gray-100 rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
};

export default FilterTags;
