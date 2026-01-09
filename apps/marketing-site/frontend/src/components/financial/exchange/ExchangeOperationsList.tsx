
import React from 'react';
import { DollarSign, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import ExchangeOperationCard from './ExchangeOperationCard';
import { MockExchangeOperation } from './mockData';
import { ExchangeOperation } from '@/hooks/use-exchange-operations';

type Operation = MockExchangeOperation | ExchangeOperation;

interface ExchangeOperationsListProps {
  operations: Operation[];
  onEdit: (operation: ExchangeOperation) => void;
  formatCurrency: (amount: string | number, currency: string) => string;
  onNewOperation: () => void;
}

const ExchangeOperationsList: React.FC<ExchangeOperationsListProps> = ({ 
  operations, 
  onEdit, 
  formatCurrency,
  onNewOperation
}) => {
  const { theme } = useTheme();

  if (operations.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className={`h-12 w-12 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
        <h3 className={`mt-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Nenhuma operação de câmbio</h3>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Clique em "Nova Operação de Câmbio" para iniciar
        </p>
        <Button 
          className="mt-4" 
          onClick={onNewOperation}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Operação de Câmbio
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {operations.map((operation) => (
        <ExchangeOperationCard 
          key={operation.id}
          operation={operation}
          onEdit={onEdit}
          formatCurrency={formatCurrency}
        />
      ))}
    </div>
  );
};

export default ExchangeOperationsList;
