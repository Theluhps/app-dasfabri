
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface OriginFilterProps {
  filterOrigin: string;
  setFilterOrigin: React.Dispatch<React.SetStateAction<string>>;
  originOptions: string[];
}

const OriginFilter: React.FC<OriginFilterProps> = ({ 
  filterOrigin, 
  setFilterOrigin,
  originOptions = []
}) => {
  return (
    <Select value={filterOrigin} onValueChange={setFilterOrigin}>
      <SelectTrigger>
        <SelectValue placeholder="Todos os países" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos os países</SelectItem>
        {originOptions && originOptions.length > 0 && originOptions.map(origin => (
          <SelectItem key={origin} value={origin}>{origin}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OriginFilter;
