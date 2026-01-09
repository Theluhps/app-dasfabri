
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  CreditCard
} from 'lucide-react';

const FinancialOperations = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === 'dark';

  const handleAction = (action: string) => {
    toast({
      title: "Ação iniciada",
      description: `A ação "${action}" foi iniciada com sucesso.`,
    });
  };

  const payments = [
    {
      id: "PAY001",
      description: "Fatura do fornecedor Shanghai Equipment Co.",
      amount: "USD 22,500.00",
      dueDate: "15/05/2025",
      status: "pendente",
      processId: "IMP-2023-001"
    },
    {
      id: "PAY002",
      description: "Frete MSC Mediterranean",
      amount: "USD 5,500.00",
      dueDate: "12/05/2025",
      status: "pendente",
      processId: "IMP-2023-003"
    },
    {
      id: "PAY003",
      description: "Adiantamento Tokyo Medical Devices",
      amount: "JPY 16,000,000.00",
      dueDate: "05/05/2025",
      status: "pago",
      processId: "IMP-2023-005",
      paymentDate: "05/05/2025"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pendente</Badge>;
      case 'pago':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Pago</Badge>;
      case 'atrasado':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Atrasado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#7E69AB]" />
              <CardTitle className={isDark ? 'text-gray-100' : ''}>
                Operações Financeiras
              </CardTitle>
            </div>
            <CardDescription className={isDark ? 'text-gray-400' : ''}>
              Gerenciamento de pagamentos e despesas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Button 
            variant="outline" 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${isDark ? 'border-gray-700 hover:bg-gray-700' : ''}`}
            onClick={() => handleAction("Registrar pagamento")}
          >
            <div className="bg-green-100 text-green-700 rounded-full p-2">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Registrar Pagamento</span>
          </Button>
          
          <Button 
            variant="outline" 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${isDark ? 'border-gray-700 hover:bg-gray-700' : ''}`}
            onClick={() => handleAction("Agendar pagamento")}
          >
            <div className="bg-blue-100 text-blue-700 rounded-full p-2">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Agendar Pagamento</span>
          </Button>
          
          <Button 
            variant="outline" 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${isDark ? 'border-gray-700 hover:bg-gray-700' : ''}`}
            onClick={() => handleAction("Gerenciar câmbio")}
          >
            <div className="bg-[#7E69AB]/10 text-[#7E69AB] rounded-full p-2">
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Gerenciar Câmbio</span>
          </Button>
        </div>

        <div className={`rounded-md overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`px-4 py-2.5 font-medium ${isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-50 text-gray-700'}`}>
            Pagamentos Próximos
          </div>
          <div className="divide-y">
            {payments.map((payment) => (
              <div 
                key={payment.id} 
                className={`px-4 py-3 flex justify-between items-center ${isDark ? 'hover:bg-gray-700/50 divide-gray-700' : 'hover:bg-gray-50 divide-gray-200'} cursor-pointer`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {payment.description}
                    </span>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>ID: {payment.id}</span>
                    <span>Processo: {payment.processId}</span>
                    
                    <div className="flex items-center gap-1">
                      {payment.status === "pago" ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Pago em: {payment.paymentDate}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-amber-500" />
                          <span>Vencimento: {payment.dueDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {payment.amount}
                  </div>
                  {payment.status === 'pendente' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs mt-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(`Pagar ${payment.id}`);
                      }}
                    >
                      Pagar agora
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="link" className="text-sm flex items-center gap-1.5 mx-auto">
            Ver todas as operações financeiras <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOperations;
