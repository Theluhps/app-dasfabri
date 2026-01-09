import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Download, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface CSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  type: 'products' | 'processes';
  templateUrl?: string;
}

interface ImportResult {
  total_rows: number;
  imported: number;
  errors: number;
  skipped: number;
  imported_items: Array<{ row: number; id: number; code?: string; name?: string; reference_number?: string; client?: string }>;
  errors_details: Array<{ row: number; code?: string; reference_number?: string; error: string }>;
  skipped_details: Array<{ row: number; code?: string; reference_number?: string; reason: string }>;
}

const CSVUploadDialog: React.FC<CSVUploadDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  type,
  templateUrl
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo CSV.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = type === 'products'
      ? ['code', 'name', 'description', 'ncm', 'origin_country', 'weight', 'unit', 'category', 'unit_price', 'currency', 'supplier_id']
      : ['reference_number', 'client', 'product', 'origin', 'destination', 'supplier', 'invoice_value', 'currency', 'status', 'description', 'ncm'];
    
    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `template_${type}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template baixado",
      description: "Template CSV baixado com sucesso. Preencha os dados e faça o upload.",
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const endpoint = type === 'products'
        ? 'http://localhost:8000/api/v1/products/import-csv'
        : 'http://localhost:8000/api/v1/import-processes/import-csv';

      // Obter token de autenticação
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao importar CSV');
      }

      const data: ImportResult = await response.json();
      setResult(data);
      setUploadProgress(100);

      toast({
        title: "Importação concluída",
        description: `${data.imported} ${type === 'products' ? 'produtos' : 'processos'} importados com sucesso.`,
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Erro ao importar CSV:', error);
      toast({
        title: "Erro na importação",
        description: error.message || "Não foi possível importar o CSV. Verifique o formato do arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar {type === 'products' ? 'Produtos' : 'Processos'} via CSV
          </DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV para importar {type === 'products' ? 'produtos' : 'processos'} em lote.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#7E69AB]" />
              <div>
                <p className="font-medium">Não tem um template?</p>
                <p className="text-sm text-muted-foreground">
                  Baixe o template CSV com os campos necessários
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Baixar Template
            </Button>
          </div>

          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">Selecionar arquivo CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <FileText className="h-4 w-4 text-[#7E69AB]" />
                <span className="text-sm">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(selectedFile.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importando...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <Alert className={result.errors > 0 ? "border-yellow-500" : "border-green-500"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {result.imported} {type === 'products' ? 'produtos' : 'processos'} importados
                    </span>
                    {result.errors > 0 && (
                      <span className="text-yellow-600 dark:text-yellow-400">
                        {result.errors} erros
                      </span>
                    )}
                    {result.skipped > 0 && (
                      <span className="text-gray-600 dark:text-gray-400">
                        {result.skipped} ignorados
                      </span>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              {/* Errors Details */}
              {result.errors_details.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Erros ({result.errors_details.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.errors_details.slice(0, 10).map((error, idx) => (
                      <div key={idx} className="text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <span className="font-medium">Linha {error.row}:</span> {error.error}
                      </div>
                    ))}
                    {result.errors_details.length > 10 && (
                      <p className="text-xs text-muted-foreground">
                        ... e mais {result.errors_details.length - 10} erros
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Skipped Details */}
              {result.skipped_details.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    Ignorados ({result.skipped_details.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.skipped_details.slice(0, 10).map((skipped, idx) => (
                      <div key={idx} className="text-xs p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <span className="font-medium">Linha {skipped.row}:</span> {skipped.reason}
                      </div>
                    ))}
                    {result.skipped_details.length > 10 && (
                      <p className="text-xs text-muted-foreground">
                        ... e mais {result.skipped_details.length - 10} ignorados
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            {result ? 'Fechar' : 'Cancelar'}
          </Button>
          {!result && (
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVUploadDialog;

