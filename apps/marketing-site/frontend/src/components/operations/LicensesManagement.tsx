
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { FileCheck, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface License {
  id: string;
  type: string;
  processId: string;
  client: string;
  product: string;
  requestDate: string;
  expiryDate?: string;
  status: string;
  progress: number;
}

const licenses: License[] = [
  {
    id: "LI-2023-001",
    type: "Licença de Importação",
    processId: "IMP-2023-001",
    client: "Empresa ABC Ltda",
    product: "Máquinas industriais",
    requestDate: "05/05/2025",
    status: "em_analise",
    progress: 50
  },
  {
    id: "LI-2023-002",
    type: "Drawback",
    processId: "IMP-2023-005",
    client: "Tecnologia Avançada",
    product: "Equipamentos médicos",
    requestDate: "01/05/2025",
    expiryDate: "01/05/2026",
    status: "aprovada",
    progress: 100
  },
  {
    id: "LI-2023-003",
    type: "Licença de Importação",
    processId: "IMP-2023-003",
    client: "Indústria Nacional",
    product: "Matéria-prima",
    requestDate: "03/05/2025",
    status: "pendente_documento",
    progress: 30
  }
];

const LicensesManagement = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === 'dark';

  const handleNewLicense = () => {
    toast({
      title: "Nova licença",
      description: "Formulário para solicitar uma nova licença será aberto.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovada':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Aprovada</Badge>;
      case 'em_analise':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Em análise</Badge>;
      case 'pendente_documento':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pendente doc.</Badge>;
      case 'rejeitada':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejeitada</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovada':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'em_analise':
      case 'pendente_documento':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rejeitada':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileCheck className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[#7E69AB]" />
              <CardTitle className={isDark ? 'text-gray-100' : ''}>
                Licenças
              </CardTitle>
            </div>
            <CardDescription className={isDark ? 'text-gray-400' : ''}>
              Gerenciamento de licenças e autorizações
            </CardDescription>
          </div>
          <Button 
            size="sm"
            className="bg-[#7E69AB] hover:bg-[#6a5590] flex items-center gap-1.5"
            onClick={handleNewLicense}
          >
            <Plus className="h-4 w-4" /> Nova licença
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        <div className="divide-y">
          {licenses.map((license) => (
            <div 
              key={license.id} 
              className={`px-6 py-4 ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-start">
                  <div className="mt-1">
                    {getStatusIcon(license.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isDark ? 'text-gray-100' : ''}`}>
                        {license.type}
                      </span>
                      {getStatusBadge(license.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {license.client} • {license.product}
                    </p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>ID: {license.id}</span>
                      <span>Processo: {license.processId}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Solicitada em: {license.requestDate}</span>
                  {license.expiryDate && (
                    <span className="text-muted-foreground">
                      Válida até: {license.expiryDate}
                    </span>
                  )}
                </div>
                <Progress value={license.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 text-center">
          <Button variant="link" className="text-sm">
            Ver todas as licenças
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicensesManagement;
