
import { useToast } from '@/hooks/use-toast';
import { Process } from './types';
import { ProcessFormValues } from '../../process-form/FormSchema';
import { v4 as uuidv4 } from 'uuid';

type ToastType = 'created' | 'updated' | 'exported';

export const useProcessActions = () => {
  const { toast } = useToast();
  
  // Function to format a Date object to string (DD/MM/YYYY)
  const formatDateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Create a new process
  const createProcess = (processes: Process[], formData: ProcessFormValues): Process => {
    // Generate a new unique ID
    const newId = `IMP-${new Date().getFullYear()}-${(processes.length + 1).toString().padStart(3, '0')}`;
    
    // Format estimatedArrival if it exists
    let estimatedArrivalValue: string | undefined = undefined;
    if (formData.estimatedArrival instanceof Date) {
      estimatedArrivalValue = formatDateToString(formData.estimatedArrival);
    }
    
    // Create the new process object
    const newProcess: Process = {
      id: newId,
      client: formData.client,
      product: formData.product,
      origin: formData.origin,
      status: 'Em andamento', // Default status for new processes
      date: formatDateToString(new Date()), // Current date
      estimatedArrival: estimatedArrivalValue,
      invoiceValue: formData.invoiceValue,
      ncm: formData.ncm,
      currency: formData.currency,
      importType: formData.importType,
      supplier: formData.supplier,
      description: formData.description,
      shippingMethod: formData.shippingMethod,
      incoterm: formData.incoterm,
      referenceNumber: formData.referenceNumber,
      customsBroker: formData.customsBroker
    };
    
    return newProcess;
  };

  // Update an existing process
  const updateProcess = (process: Process, formData: ProcessFormValues): Process => {
    // Convert estimatedArrival to string if it's a Date
    let estimatedArrivalValue: string | undefined = process.estimatedArrival as string;
    if (formData.estimatedArrival instanceof Date) {
      estimatedArrivalValue = formatDateToString(formData.estimatedArrival);
    }
    
    // Create updated process object
    const updatedProcess: Process = {
      ...process, // Keep existing properties
      client: formData.client,
      product: formData.product,
      origin: formData.origin,
      estimatedArrival: estimatedArrivalValue,
      invoiceValue: formData.invoiceValue,
      ncm: formData.ncm,
      currency: formData.currency,
      importType: formData.importType,
      supplier: formData.supplier,
      description: formData.description,
      shippingMethod: formData.shippingMethod,
      incoterm: formData.incoterm,
      referenceNumber: formData.referenceNumber,
      customsBroker: formData.customsBroker
    };
    
    return updatedProcess;
  };

  // Show toast notifications
  const showToast = (type: ToastType, processId?: string, clientName?: string) => {
    switch (type) {
      case 'created':
        toast({
          title: 'Processo criado',
          description: `Processo ${processId} para cliente ${clientName} criado com sucesso.`,
          variant: 'default',
        });
        break;
      case 'updated':
        toast({
          title: 'Processo atualizado',
          description: `Processo ${processId} para cliente ${clientName} atualizado com sucesso.`,
          variant: 'default',
        });
        break;
      case 'exported':
        toast({
          title: 'Exportando dados',
          description: 'Preparando a exportação dos dados...',
          variant: 'default',
        });
        break;
    }
  };

  return { createProcess, updateProcess, showToast };
};
