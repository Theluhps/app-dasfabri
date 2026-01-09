
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, X, File, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface DocumentUploadProps {
  processId?: string;
  onUploadComplete?: (document: { name: string; type: string; size: number }) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  processId,
  onUploadComplete
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleClearFile = () => {
    setFile(null);
  };
  
  const handleUpload = () => {
    if (!file || !documentType) {
      toast({
        title: "Informação incompleta",
        description: "Selecione um arquivo e especifique o tipo de documento.",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    // Simulação de upload - em produção, isso seria substituído por um upload real para um servidor
    setTimeout(() => {
      setUploading(false);
      
      toast({
        title: "Documento anexado com sucesso",
        description: `${file.name} foi anexado ao processo.`,
        variant: "default"
      });
      
      if (onUploadComplete) {
        onUploadComplete({
          name: file.name,
          type: documentType,
          size: file.size
        });
      }
      
      setFile(null);
      setDocumentType('');
    }, 1500);
  };
  
  const documentTypes = [
    'Invoice',
    'Packing List', 
    'BL',
    'Conhecimento de Embarque',
    'Certificado de Origem',
    'Licença de Importação',
    'Comprovante de Pagamento',
    'Declaração de Importação',
    'Outros'
  ];
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-md bg-background">
      <div className="text-lg font-medium">Anexar Documento</div>
      
      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-md h-32 flex flex-col items-center justify-center cursor-pointer",
            "hover:border-primary transition-colors"
          )}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Clique para selecionar um arquivo</p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="border rounded-md p-3 flex items-center justify-between bg-muted/30">
          <div className="flex items-center space-x-3">
            <File className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClearFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Documento</label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full border rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Selecione o tipo</option>
          {documentTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => {
          setFile(null);
          setDocumentType('');
        }}>
          Cancelar
        </Button>
        <Button 
          onClick={handleUpload}
          disabled={!file || !documentType || uploading}
          className="relative"
        >
          {uploading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Enviando...
            </span>
          ) : (
            <span className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Anexar Documento
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;
