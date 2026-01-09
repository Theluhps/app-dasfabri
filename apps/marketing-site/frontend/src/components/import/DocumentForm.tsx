
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, File } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome do documento é obrigatório' }),
  type: z.string().min(1, { message: 'Tipo de documento é obrigatório' }),
  comments: z.string().optional(),
  file: z.any().optional() // Não podemos validar arquivos diretamente com zod
});

type DocumentFormValues = z.infer<typeof formSchema>;

interface DocumentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  processId: string;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  processId
}) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      comments: '',
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      // Atualizar o nome do documento com o nome do arquivo se estiver vazio
      const currentName = form.getValues('name');
      if (!currentName) {
        form.setValue('name', file.name.split('.')[0]);
      }
    }
  };

  const handleSubmit = async (values: DocumentFormValues) => {
    if (!selectedFile) {
      toast({
        title: "Arquivo obrigatório",
        description: "Por favor, selecione um arquivo para upload",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simular upload de arquivo
    setTimeout(() => {
      // Em uma aplicação real, aqui você enviaria o arquivo para o servidor
      const documentData = {
        ...values,
        size: selectedFile.size,
        uploadDate: new Date(),
        processId: processId
      };
      
      onSubmit(documentData);
      setIsUploading(false);
      onOpenChange(false);
      
      toast({
        title: "Documento enviado",
        description: `O documento ${values.name} foi anexado ao processo.`
      });
    }, 1500);
  };

  const documentTypes = [
    { value: 'invoice', label: 'Fatura Comercial' },
    { value: 'packing', label: 'Packing List' },
    { value: 'bl', label: 'Bill of Lading' },
    { value: 'awb', label: 'Air Waybill' },
    { value: 'certificate', label: 'Certificado de Origem' },
    { value: 'license', label: 'Licença de Importação' },
    { value: 'customs', label: 'Declaração Aduaneira' },
    { value: 'insurance', label: 'Apólice de Seguro' },
    { value: 'other', label: 'Outro' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Anexar Documento
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              
              {!selectedFile ? (
                <div>
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Clique para selecionar um arquivo
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    ou arraste e solte aqui
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <File className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    Remover
                  </Button>
                </div>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do documento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Fatura Comercial N° 12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de documento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais sobre o documento..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : 'Enviar Documento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentForm;
