
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon } from 'lucide-react';

interface CompanyTypeFilterProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const CompanyTypeFilter: React.FC<CompanyTypeFilterProps> = ({ selectedType, setSelectedType }) => {
  return (
    <div className="flex items-center gap-2">
      <FilterIcon className="h-4 w-4 text-gray-500" />
      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="Cliente">Cliente</SelectItem>
          <SelectItem value="Fornecedor">Fornecedor</SelectItem>
          <SelectItem value="Parceiro">Parceiro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanyTypeFilter;
