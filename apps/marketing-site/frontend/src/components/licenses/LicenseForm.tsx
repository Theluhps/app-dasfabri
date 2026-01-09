
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  licenseNumber: z.string().min(1, 'Número da licença é obrigatório'),
  processId: z.string().min(1, 'Processo relacionado é obrigatório'),
  type: z.string().min(1, 'Tipo de licença é obrigatório'),
  issueDate: z.date(),
  expiryDate: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

interface LicenseFormProps {
  onSubmit: (data: FormValues) => void;
  processes?: { id: string; name: string }[];
  initialValues?: Partial<FormValues>;
}

const LicenseForm: React.FC<LicenseFormProps> = ({ 
  onSubmit, 
  processes = [], 
  initialValues 
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenseNumber: initialValues?.licenseNumber || '',
      processId: initialValues?.processId || '',
      type: initialValues?.type || '',
      issueDate: initialValues?.issueDate || new Date(),
      expiryDate: initialValues?.expiryDate || new Date(),
    },
  });

  const licenseTypes = [
    'Licença de Importação',
    'LPCO',
    'Certificado Fitossanitário',
    'Certificado de Origem',
    'Autorização ANVISA',
    'Guia de Importação',
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da Licença</FormLabel>
              <FormControl>
                <Input placeholder="LI-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="processId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processo Relacionado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um processo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {processes.length > 0 ? (
                    processes.map((process) => (
                      <SelectItem key={process.id} value={process.id}>
                        {process.id} - {process.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="IMP-2023-001">IMP-2023-001 - Importação de Maquinário</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Licença</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {licenseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Emissão</FormLabel>
                <DatePicker
                  selected={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Validade</FormLabel>
                <DatePicker
                  selected={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">Salvar Licença</Button>
        </div>
      </form>
    </Form>
  );
};

export default LicenseForm;
