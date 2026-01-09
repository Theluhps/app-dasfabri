import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, FileText, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CurrencyExchangeForm from './exchange/CurrencyExchangeForm';
import { ExchangeFormValues } from './exchange/CurrencyExchangeForm';

interface ProcessFinancialDetailsProps {
  processId: string;
}

interface FinancialTransaction {
  id: string;
  processId: string;
  type: 'invoice' | 'payment' | 'exchange' | 'tax';
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  dueDate?: string;
}

const ProcessFinancialDetails: React.FC<ProcessFinancialDetailsProps> = ({ processId }) => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  const [transactionType, setTransactionType] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, [processId]);

  const fetchTransactions = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filteredTransactions = mockTransactions.filter(tx => tx.processId === processId);
      setTransactions(filteredTransactions.length > 0 ? filteredTransactions : []);
      setLoading(false);
    }, 500);
  };

  const handleAddTransaction = (type: string) => {
    setTransactionType(type);
    
    if (type === 'exchange') {
      setShowExchangeForm(true);
    } else {
      // Criar transação simulada
      const newTransaction: FinancialTransaction = {
        id: `${type.toUpperCase()}-${Date.now().toString().substring(8)}`,
        processId: processId,
        type: type as 'invoice' | 'payment' | 'exchange' | 'tax',
        description: type === 'invoice' ? 'Nova fatura comercial' :
                     type === 'payment' ? 'Novo pagamento' :
                     type === 'tax' ? 'Novo imposto' : 'Nova transação',
        amount: type === 'invoice' ? 10000 :
                type === 'payment' ? 5000 :
                type === 'tax' ? 2000 : 0,
        currency: 'USD',
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      
      toast({
        title: "Transação adicionada",
        description: `Uma nova transação do tipo ${type} foi adicionada ao processo.`,
      });
    }
  };

  const handleExchangeSubmit = (data: ExchangeFormValues) => {
    // In a real app, this would make an API call
    console.log('Exchange operation submitted:', data);
    
    // Create a new transaction from exchange data
    const newTransaction: FinancialTransaction = {
      id: `EXC-${Date.now().toString().substring(8)}`,
      processId: processId,
      type: 'exchange',
      description: `Operação de câmbio - ${data.invoiceId}`,
      amount: parseFloat(data.amount),
      currency: data.sourceCurrency,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'pending',
      dueDate: data.settlementDate?.toLocaleDateString('pt-BR')
    };
    
    // Add to transactions
    setTransactions(prev => [...prev, newTransaction]);
    
    toast({
      title: "Operação de câmbio registrada",
      description: `A operação de câmbio foi vinculada ao processo ${processId}.`,
    });
    
    setShowExchangeForm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const mockTransactions: FinancialTransaction[] = [
    {
      id: 'INV-001',
      processId: 'IMP-2023-001',
      type: 'invoice',
      description: 'Fatura comercial - Fornecedor XYZ',
      amount: 15000,
      currency: 'USD',
      date: '10/04/2025',
      status: 'completed',
      dueDate: '10/05/2025'
    },
    {
      id: 'PAY-001',
      processId: 'IMP-2023-001',
      type: 'payment',
      description: 'Pagamento de frete internacional',
      amount: 3200,
      currency: 'USD',
      date: '15/04/2025',
      status: 'completed',
    },
    {
      id: 'EXC-001',
      processId: 'IMP-2023-001',
      type: 'exchange',
      description: 'Fechamento de câmbio - Invoice',
      amount: 75000,
      currency: 'BRL',
      date: '16/04/2025',
      status: 'completed',
    },
    {
      id: 'TAX-001',
      processId: 'IMP-2023-001',
      type: 'tax',
      description: 'Impostos de importação',
      amount: 18750,
      currency: 'BRL',
      date: '25/04/2025',
      status: 'pending',
      dueDate: '15/05/2025'
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <FileText className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'exchange':
        return <DollarSign className="h-4 w-4" />;
      case 'tax':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const renderTransactionActions = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleAddTransaction('invoice')}
        >
          <FileText className="h-4 w-4" />
          Fatura
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleAddTransaction('payment')}
        >
          <DollarSign className="h-4 w-4" />
          Pagamento
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleAddTransaction('exchange')}
        >
          <DollarSign className="h-4 w-4" />
          Câmbio
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleAddTransaction('tax')}
        >
          <FileText className="h-4 w-4" />
          Imposto
        </Button>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Transações Financeiras</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAddTransaction('')}
            >
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
            <Button variant="ghost" size="icon" onClick={fetchTransactions}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando transações...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Não há transações financeiras para este processo.</p>
              <div className="mt-6 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-3">Adicionar transação:</p>
                {renderTransactionActions()}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <div className="bg-gray-100 p-2 rounded">
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{transaction.id}</h3>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor</p>
                      <p className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data</p>
                      <p>{transaction.date}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vencimento</p>
                      <p>{transaction.dueDate || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">Adicionar nova transação:</p>
                {renderTransactionActions()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <CurrencyExchangeForm
        open={showExchangeForm}
        onOpenChange={setShowExchangeForm}
        onSubmit={handleExchangeSubmit}
        linkedProcessId={processId}
      />
    </>
  );
};

export default ProcessFinancialDetails;
