
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import ExchangeRates from '@/components/financial/ExchangeRates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import CurrencyExchangeForm from '@/components/financial/exchange/CurrencyExchangeForm';
import { useExchangeOperations } from '@/hooks/use-exchange-operations';
import ExchangeHeader from '@/components/financial/exchange/ExchangeHeader';
import ExchangeOperationsList from '@/components/financial/exchange/ExchangeOperationsList';
import { formatCurrency } from '@/utils/currency';
import { exchangeOperations } from '@/components/financial/exchange/mockData';
import { Button } from '@/components/ui/button';

const FinancialExchange = () => {
  const { theme } = useTheme();
  const { 
    operations, 
    showExchangeForm, 
    setShowExchangeForm, 
    handleExchangeSubmit,
    selectedOperation,
    editOperation,
  } = useExchangeOperations();

  // Combined operations list (mock + created)
  const allOperations = [
    ...exchangeOperations,
    ...operations
  ];

  return (
    <PageLayout
      title="Controle de Câmbio"
      description="Gerencie operações de câmbio, cotações e fechamentos"
    >
      <div className="space-y-6">
        <ExchangeHeader onNewOperation={() => setShowExchangeForm(true)} />

        <ExchangeRates />

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Operações de Câmbio</CardTitle>
              <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                Registros de operações de câmbio realizadas e em andamento
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ExchangeOperationsList
              operations={allOperations}
              onEdit={editOperation}
              formatCurrency={formatCurrency}
              onNewOperation={() => setShowExchangeForm(true)}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Exchange Operation Form Dialog */}
      <CurrencyExchangeForm 
        open={showExchangeForm} 
        onOpenChange={setShowExchangeForm} 
        onSubmit={handleExchangeSubmit}
        initialValues={selectedOperation ? {
          invoiceId: selectedOperation.invoiceId,
          operationType: selectedOperation.operationType,
          amount: selectedOperation.amount,
          sourceCurrency: selectedOperation.sourceCurrency,
          targetCurrency: selectedOperation.targetCurrency,
          exchangeRate: selectedOperation.exchangeRate,
          financialInstitution: selectedOperation.financialInstitution,
          executionDate: selectedOperation.executionDate,
          settlementDate: selectedOperation.settlementDate,
          description: selectedOperation.description
        } : undefined}
      />
    </PageLayout>
  );
};

export default FinancialExchange;
