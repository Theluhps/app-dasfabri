
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';

// Import schema and components
import { processFormSchema, ProcessFormValues, ProcessFormProps } from './FormSchema';
import BasicInfoSection from './BasicInfoSection';
import ImportDetailsSection from './ImportDetailsSection';
import FinancialSection from './FinancialSection';

const ProcessForm: React.FC<ProcessFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      client: initialValues?.client || '',
      product: initialValues?.product || '',
      description: initialValues?.description || '',
      origin: initialValues?.origin || '',
      estimatedArrival: initialValues?.estimatedArrival,
      ncm: initialValues?.ncm || '',
      invoiceValue: initialValues?.invoiceValue || '',
      currency: initialValues?.currency || 'USD',
      importType: initialValues?.importType || 'regular',
      shippingMethod: initialValues?.shippingMethod || '',
      referenceNumber: initialValues?.referenceNumber || '',
      incoterm: initialValues?.incoterm || '',
      customsBroker: initialValues?.customsBroker || '',
      supplier: initialValues?.supplier || '',
    }
  });

  const handleSubmit = async (values: ProcessFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        onSubmit(values);
      } else {
        // Simulação de submissão bem-sucedida
        console.log('Processo criado:', values);
        toast({
          title: "Processo criado com sucesso",
          description: `O processo para ${values.client} foi criado.`,
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      toast({
        title: "Erro ao criar processo",
        description: "Ocorreu um erro ao tentar criar o processo. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {initialValues ? 'Editar Processo' : 'Novo Processo de Importação'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Seção de informações básicas */}
            <BasicInfoSection form={form} />
            
            {/* Seção de detalhes de importação */}
            <ImportDetailsSection form={form} />
            
            {/* Seção de informações financeiras */}
            <FinancialSection form={form} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processando...' : initialValues ? 'Atualizar' : 'Criar Processo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessForm;
