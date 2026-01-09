
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ChevronDown } from 'lucide-react';

interface AdvancedFiltersToggleProps {
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdvancedFiltersToggle: React.FC<AdvancedFiltersToggleProps> = ({ 
  showAdvancedFilters, 
  setShowAdvancedFilters 
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex justify-center items-center"
      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
    >
      <Filter className="mr-2 h-4 w-4" /> 
      {showAdvancedFilters ? 'Ocultar filtros' : 'Mais filtros'}
      <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
    </Button>
  );
};

export default AdvancedFiltersToggle;
