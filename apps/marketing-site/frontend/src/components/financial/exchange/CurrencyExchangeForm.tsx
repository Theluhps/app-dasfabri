
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  TextFormField, 
  SelectFormField, 
  NumberFormField, 
  DateFormField 
} from '@/components/import/process-form/FormFields';

// Define exchange form schema
const exchangeFormSchema = z.object({
  processId: z.string().optional(),
  invoiceId: z.string().min(3, { message: 'ID da fatura é obrigatório' }),
  operationType: z.string(),
  amount: z.string().min(1, { message: 'Valor é obrigatório' }),
  sourceCurrency: z.string(),
  targetCurrency: z.string().default('BRL'),
  exchangeRate: z.string().min(1, { message: 'Taxa de câmbio é obrigatória' }),
  financialInstitution: z.string().min(3, { message: 'Instituição financeira é obrigatória' }),
  executionDate: z.date(),
  settlementDate: z.date().optional(),
  description: z.string().optional(),
  relatedDocumentId: z.string().optional(),
});

export type ExchangeFormValues = z.infer<typeof exchangeFormSchema>;

interface CurrencyExchangeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ExchangeFormValues) => void;
  initialValues?: Partial<ExchangeFormValues>;
  linkedProcessId?: string;
}

const operationTypes = [
  { value: 'payment', label: 'Pagamento ao Exterior' },
  { value: 'receipt', label: 'Recebimento do Exterior' },
  { value: 'forward', label: 'Contrato de Câmbio Futuro' },
  { value: 'spot', label: 'Contrato de Câmbio à Vista' },
];

const financialInstitutions = [
  { value: 'banco-do-brasil', label: 'Banco do Brasil' },
  { value: 'itau', label: 'Itaú' },
  { value: 'bradesco', label: 'Bradesco' },
  { value: 'santander', label: 'Santander' },
  { value: 'caixa', label: 'Caixa Econômica Federal' },
];

const currencies = [
  { value: 'USD', label: 'USD - Dólar Americano' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - Libra Esterlina' },
  { value: 'JPY', label: 'JPY - Iene Japonês' },
  { value: 'CNY', label: 'CNY - Yuan Chinês' },
  { value: 'BRL', label: 'BRL - Real Brasileiro' },
];

const CurrencyExchangeForm: React.FC<CurrencyExchangeFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  linkedProcessId
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ExchangeFormValues>({
    resolver: zodResolver(exchangeFormSchema),
    defaultValues: {
      processId: linkedProcessId || initialValues?.processId || '',
      invoiceId: initialValues?.invoiceId || '',
      operationType: initialValues?.operationType || 'payment',
      amount: initialValues?.amount || '',
      sourceCurrency: initialValues?.sourceCurrency || 'USD',
      targetCurrency: initialValues?.targetCurrency || 'BRL',
      exchangeRate: initialValues?.exchangeRate || '',
      financialInstitution: initialValues?.financialInstitution || '',
      executionDate: initialValues?.executionDate || new Date(),
      settlementDate: initialValues?.settlementDate,
      description: initialValues?.description || '',
      relatedDocumentId: initialValues?.relatedDocumentId || '',
    }
  });
  
  const handleSubmit = async (values: ExchangeFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        onSubmit(values);
      } else {
        console.log('Operação de câmbio enviada:', values);
        
        toast({
          title: "Operação de câmbio registrada",
          description: `A operação de câmbio foi registrada com sucesso.`,
        });
        
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao registrar operação de câmbio:', error);
      toast({
        title: "Erro ao registrar operação",
        description: "Ocorreu um erro ao registrar a operação de câmbio. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {initialValues ? 'Editar Operação de Câmbio' : 'Nova Operação de Câmbio'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {linkedProcessId && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md mb-4 text-sm">
              Esta operação será vinculada ao processo <strong>{linkedProcessId}</strong>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <SelectFormField
              form={form}
              name="operationType"
              label="Tipo de Operação"
              options={operationTypes}
              placeholder="Selecione o tipo de operação"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <NumberFormField
                form={form}
                name="amount"
                label="Valor"
                placeholder="Valor da operação"
              />
              
              <SelectFormField
                form={form}
                name="sourceCurrency"
                label="Moeda de Origem"
                options={currencies}
                placeholder="Selecione a moeda"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <NumberFormField
                form={form}
                name="exchangeRate"
                label="Taxa de Câmbio"
                placeholder="Taxa de câmbio"
              />
              
              <SelectFormField
                form={form}
                name="financialInstitution"
                label="Instituição Financeira"
                options={financialInstitutions}
                placeholder="Selecione a instituição"
              />
            </div>
            
            <TextFormField
              form={form}
              name="invoiceId"
              label="ID da Fatura"
              placeholder="Número da fatura relacionada"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <DateFormField
                form={form}
                name="executionDate"
                label="Data de Execução"
              />
              
              <DateFormField
                form={form}
                name="settlementDate"
                label="Data de Liquidação"
              />
            </div>
            
            <TextFormField
              form={form}
              name="description"
              label="Descrição"
              placeholder="Detalhes adicionais da operação"
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processando...' : initialValues ? 'Atualizar' : 'Registrar Operação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencyExchangeForm;
