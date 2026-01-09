
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { MockExchangeOperation } from './mockData';
import { ExchangeOperation } from '@/hooks/use-exchange-operations';

type Operation = MockExchangeOperation | ExchangeOperation;

interface ExchangeOperationCardProps {
  operation: Operation;
  onEdit: (operation: ExchangeOperation) => void;
  formatCurrency: (amount: string | number, currency: string) => string;
}

const ExchangeOperationCard: React.FC<ExchangeOperationCardProps> = ({ 
  operation, 
  onEdit, 
  formatCurrency 
}) => {
  const { theme } = useTheme();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEdit = () => {
    // Check if it's a mock operation or a user-created operation
    if ('date' in operation) {
      // Create an ExchangeOperation compatible object from the mock data
      const compatibleOperation = {
        ...operation,
        // Ensure other properties match the ExchangeOperation interface
        status: operation.status as 'completed' | 'pending' | 'cancelled'
      } as ExchangeOperation;
      onEdit(compatibleOperation);
    } else {
      // It's already an ExchangeOperation
      onEdit(operation as ExchangeOperation);
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>{operation.id}</h3>
            {getStatusBadge(operation.status)}
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {operation.processId ? `Processo: ${operation.processId} • ` : ''}
            {operation.createdAt ? new Date(operation.createdAt).toLocaleDateString('pt-BR') : ''}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
            {formatCurrency(operation.amount, operation.sourceCurrency)}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Taxa: {operation.exchangeRate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm">
        <div>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Tipo</p>
          <p className={theme === 'dark' ? 'text-white' : ''}>
            {operation.operationType === 'payment' ? 'Pagamento' : 
              operation.operationType === 'receipt' ? 'Recebimento' : 
              operation.operationType === 'forward' ? 'Contrato Futuro' : 'Contrato à Vista'}
          </p>
        </div>
        <div>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Fatura</p>
          <p className={theme === 'dark' ? 'text-white' : ''}>{operation.invoiceId}</p>
        </div>
        <div>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Instituição</p>
          <p className={theme === 'dark' ? 'text-white' : ''}>{operation.financialInstitution}</p>
        </div>
      </div>

      <div className="flex justify-end mt-3 gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm h-auto p-1 px-2"
          onClick={handleEdit}
        >
          Editar
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm h-auto p-1 px-2"
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  );
};

export default ExchangeOperationCard;
