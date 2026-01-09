
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  CalendarClock, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileDown,
  Building
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface License {
  id: string;
  type: string;
  process: string;
  expiry: string;
  status: string;
  daysToExpiry: number;
  issueDate?: string;
  authority?: string;
  observations?: string;
}

interface LicenseDetailsProps {
  license: License | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LicenseDetails: React.FC<LicenseDetailsProps> = ({
  license,
  open,
  onOpenChange
}) => {
  if (!license) return null;

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Aprovada':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Em análise':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Expirada':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Aprovada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em análise':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expirada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Licença {license.id}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="observations">Observações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <div className="flex items-center gap-1.5">
                {getStatusIcon(license.status)}
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(license.status)}`}>
                  {license.status}
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p>{license.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Processo</p>
                <p>{license.process}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Emissão</p>
                <p>{license.issueDate || '10/04/2023'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Validade</p>
                <p className="flex items-center gap-1.5">
                  <CalendarClock className="h-4 w-4 text-gray-500" />
                  {license.expiry}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Autoridade</p>
                <p className="flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-gray-500" />
                  {license.authority || 'SECEX - Secretaria de Comércio Exterior'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dias para vencimento</p>
                <p className={license.daysToExpiry < 30 ? 'text-red-500 font-medium' : ''}>
                  {license.daysToExpiry}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="observations" className="pt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Observações</p>
              <p className="text-sm bg-gray-50 p-3 rounded-md border">
                {license.observations || 'Licença vinculada ao processo de importação de maquinário industrial. Licença emitida com base na NCM 8477.10.11.'}
              </p>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Documentos Vinculados</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="border rounded-md p-2 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Certificado de Origem.pdf</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 py-1"
                    onClick={() => {
                      // Abrir visualização do certificado
                      window.open(`/import/documents/view/certificado-${license.id}`, '_blank');
                    }}
                  >
                    Ver
                  </Button>
                </div>
                <div className="border rounded-md p-2 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Formulário de Solicitação.pdf</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 py-1"
                    onClick={() => {
                      // Abrir visualização do formulário
                      window.open(`/import/documents/view/formulario-${license.id}`, '_blank');
                    }}
                  >
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            className="flex items-center gap-1.5"
            onClick={() => {
              // Simular exportação para PDF
              const link = document.createElement('a');
              link.href = `#export-pdf-${license.id}`;
              link.download = `Licenca-${license.id}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LicenseDetails;
