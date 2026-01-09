
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ExchangeFormValues } from '@/components/financial/exchange/CurrencyExchangeForm';

export interface ExchangeOperation extends ExchangeFormValues {
  id: string;
  createdAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
  updatedAt?: Date;
}

export const useExchangeOperations = (processId?: string) => {
  const [operations, setOperations] = useState<ExchangeOperation[]>([]);
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<ExchangeOperation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to create a new exchange operation
  const createExchangeOperation = (data: ExchangeFormValues) => {
    // In a real app, this would make an API call
    const newOperation: ExchangeOperation = {
      ...data,
      id: `EXC-${Date.now().toString().substring(8)}`,
      createdAt: new Date(),
      status: 'pending'
    };

    setOperations(prev => [...prev, newOperation]);
    
    toast({
      title: "Operação de câmbio criada",
      description: `A operação ${newOperation.id} foi criada com sucesso.`,
    });

    return newOperation;
  };

  // Function to update an existing exchange operation
  const updateExchangeOperation = (id: string, data: Partial<ExchangeFormValues>) => {
    setOperations(prev => prev.map(op => 
      op.id === id 
        ? { 
            ...op, 
            ...data, 
            updatedAt: new Date() 
          } 
        : op
    ));

    toast({
      title: "Operação atualizada",
      description: `A operação ${id} foi atualizada com sucesso.`,
    });
  };

  // Function to change the status of an operation
  const updateOperationStatus = (id: string, status: 'pending' | 'completed' | 'cancelled') => {
    setOperations(prev => prev.map(op => 
      op.id === id 
        ? { 
            ...op, 
            status,
            updatedAt: new Date() 
          } 
        : op
    ));

    toast({
      title: "Status atualizado",
      description: `O status da operação ${id} foi alterado para ${status}.`,
    });
  };

  // Function to delete an exchange operation
  const deleteExchangeOperation = (id: string) => {
    setOperations(prev => prev.filter(op => op.id !== id));

    toast({
      title: "Operação excluída",
      description: `A operação ${id} foi excluída com sucesso.`,
    });
  };

  // Function to handle the exchange form submission
  const handleExchangeSubmit = (data: ExchangeFormValues) => {
    if (selectedOperation) {
      updateExchangeOperation(selectedOperation.id, data);
      setSelectedOperation(null);
    } else {
      createExchangeOperation(data);
    }
    setShowExchangeForm(false);
  };

  // Function to open the form for editing an operation
  const editOperation = (operation: ExchangeOperation) => {
    setSelectedOperation(operation);
    setShowExchangeForm(true);
  };

  return {
    operations,
    showExchangeForm,
    setShowExchangeForm,
    selectedOperation,
    setSelectedOperation,
    isLoading,
    handleExchangeSubmit,
    editOperation,
    deleteExchangeOperation,
    updateOperationStatus,
    createExchangeOperation,
  };
};
