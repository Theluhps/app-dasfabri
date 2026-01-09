
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, Plus } from 'lucide-react';

interface ExchangeHeaderProps {
  onNewOperation: () => void;
}

const ExchangeHeader: React.FC<ExchangeHeaderProps> = ({ onNewOperation }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Período
        </Button>
      </div>
      <Button className="flex items-center gap-2" onClick={onNewOperation}>
        <Plus className="h-4 w-4" />
        Nova Operação de Câmbio
      </Button>
    </div>
  );
};

export default ExchangeHeader;
