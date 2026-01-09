
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface StatusFilterProps {
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  statusOptions: string[];
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  filterStatus, 
  setFilterStatus,
  statusOptions = []
}) => {
  return (
    <Select value={filterStatus} onValueChange={setFilterStatus}>
      <SelectTrigger>
        <SelectValue placeholder="Todos os status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos os status</SelectItem>
        {statusOptions && statusOptions.length > 0 && statusOptions.map(status => (
          <SelectItem key={status} value={status}>{status}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
