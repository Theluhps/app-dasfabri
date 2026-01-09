
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ClientFilterProps {
  filterClient: string;
  setFilterClient: React.Dispatch<React.SetStateAction<string>>;
  clientOptions: string[];
}

const ClientFilter: React.FC<ClientFilterProps> = ({ 
  filterClient, 
  setFilterClient,
  clientOptions = []
}) => {
  return (
    <Select value={filterClient} onValueChange={setFilterClient}>
      <SelectTrigger>
        <SelectValue placeholder="Todos os clientes" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos os clientes</SelectItem>
        {clientOptions && clientOptions.length > 0 && clientOptions.map(client => (
          <SelectItem key={client} value={client}>{client}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClientFilter;
