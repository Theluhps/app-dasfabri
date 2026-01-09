
import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FilePlus, Eye, AlertCircle, CheckCircle, Clock, Download, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LicenseFilter from '@/components/licenses/LicenseFilter';
import LicenseDetails from '@/components/licenses/LicenseDetails';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LicenseForm from '@/components/licenses/LicenseForm';
import { useToast } from '@/hooks/use-toast';

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

const ImportLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([
    { id: 'LI-001', type: 'Licença de Importação', process: 'IMP-2023-001', expiry: '31/12/2025', status: 'Aprovada', daysToExpiry: 240 },
    { id: 'LI-002', type: 'LPCO', process: 'IMP-2023-002', expiry: '15/06/2025', status: 'Em análise', daysToExpiry: 40 },
    { id: 'LI-003', type: 'Licença de Importação', process: 'IMP-2023-003', expiry: '22/07/2025', status: 'Aprovada', daysToExpiry: 70 },
    { id: 'LI-004', type: 'Certificado Fitossanitário', process: 'IMP-2023-001', expiry: '18/05/2025', status: 'Expirada', daysToExpiry: 0 },
    { id: 'LI-005', type: 'LPCO', process: 'IMP-2023-004', expiry: '05/08/2025', status: 'Em análise', daysToExpiry: 90 },
    { id: 'LI-006', type: 'Certificado de Origem', process: 'IMP-2023-005', expiry: '12/09/2025', status: 'Aprovada', daysToExpiry: 120 },
    { id: 'LI-007', type: 'Licença de Importação', process: 'IMP-2023-006', expiry: '01/06/2025', status: 'Em análise', daysToExpiry: 25 },
  ]);

  const [filteredLicenses, setFilteredLicenses] = useState<License[]>(licenses);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Aprovada':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Em análise':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Expirada':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Aprovada':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {status}
        </Badge>;
      case 'Em análise':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {status}
        </Badge>;
      case 'Expirada':
        return <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleFilter = (filters: { status: string[]; type: string[] }) => {
    let result = [...licenses];
    
    if (filters.status.length > 0) {
      result = result.filter(license => filters.status.includes(license.status));
    }
    
    if (filters.type.length > 0) {
      result = result.filter(license => filters.type.includes(license.type));
    }
    
    setFilteredLicenses(result);
  };
  
  const viewLicenseDetails = (license: License) => {
    setSelectedLicense(license);
    setDetailsOpen(true);
  };
  
  const handleAddLicense = (data: any) => {
    const newLicense = {
      id: `LI-${(licenses.length + 1).toString().padStart(3, '0')}`,
      type: data.type,
      process: data.processId,
      expiry: new Date(data.expiryDate).toLocaleDateString('pt-BR'),
      status: 'Em análise',
      daysToExpiry: Math.round((data.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      issueDate: new Date(data.issueDate).toLocaleDateString('pt-BR'),
    };
    
    const updatedLicenses = [...licenses, newLicense];
    setLicenses(updatedLicenses);
    setFilteredLicenses(updatedLicenses);
    setFormOpen(false);
    
    toast({
      title: "Licença adicionada",
      description: `A licença ${newLicense.id} foi adicionada com sucesso.`,
    });
  };

  return (
    <PageLayout 
      title="Licenças de Importação" 
      description="Gerencie todas as licenças e autorizações relacionadas aos processos de importação"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <LicenseFilter onFilterChange={handleFilter} />
          
          <Button className="flex items-center gap-2 bg-[#7E69AB] hover:bg-[#6a5590]" onClick={() => setFormOpen(true)}>
            <FilePlus className="h-4 w-4" />
            Nova Licença
          </Button>
        </div>
        
        <Card className="border-t-4 border-t-[#7E69AB]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FilePlus className="h-5 w-5 text-[#7E69AB]" />
              Licenças Ativas
            </CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-[#7E69AB] border-[#7E69AB] hover:bg-[#7E69AB]/10">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Número</TableHead>
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold">Processo</TableHead>
                    <TableHead className="font-semibold">Validade</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLicenses.length > 0 ? (
                    filteredLicenses.map((license) => (
                      <TableRow key={license.id} className="hover:bg-gray-50/80">
                        <TableCell className="font-medium text-[#7E69AB]">{license.id}</TableCell>
                        <TableCell>{license.type}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            {license.process}
                          </span>
                        </TableCell>
                        <TableCell>
                          {license.expiry}
                          {license.daysToExpiry <= 30 && (
                            <span className="ml-2 text-xs text-red-500 font-medium">
                              ({license.daysToExpiry} dias)
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusBadge(license.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => viewLicenseDetails(license)}
                            className="hover:bg-[#7E69AB]/10 hover:text-[#7E69AB]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nenhuma licença encontrada com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-amber-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Alertas de Vencimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLicenses
                .filter(license => license.status !== 'Expirada' && license.daysToExpiry <= 60)
                .map((license) => (
                <div key={`alert-${license.id}`} className={`p-4 rounded-md ${
                  license.daysToExpiry <= 30 
                    ? 'bg-red-50 border-l-4 border-red-400 shadow-sm' 
                    : 'bg-yellow-50 border-l-4 border-yellow-400 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className={`h-5 w-5 mr-3 ${license.daysToExpiry <= 30 ? 'text-red-500' : 'text-yellow-500'}`} />
                      <div>
                        <h3 className="text-sm font-medium">
                          Licença {license.id} expira em {license.daysToExpiry} dias
                        </h3>
                        <p className="text-xs text-gray-600">
                          Processo: <span className="font-medium">{license.process}</span> | 
                          Tipo: <span className="font-medium">{license.type}</span>
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => viewLicenseDetails(license)}
                      className={`hover:bg-${license.daysToExpiry <= 30 ? 'red' : 'yellow'}-200`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredLicenses.filter(license => license.status !== 'Expirada' && license.daysToExpiry <= 60).length === 0 && (
                <div className="p-5 bg-gray-50 rounded-md text-center text-gray-500 border border-gray-100">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-1" />
                    <p className="font-medium">Não há licenças com vencimento próximo</p>
                    <p className="text-sm">Todas as licenças estão com datas de validade adequadas.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Modais */}
      <LicenseDetails 
        license={selectedLicense} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
      />
      
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#7E69AB]" />
              Nova Licença
            </DialogTitle>
          </DialogHeader>
          <LicenseForm 
            onSubmit={handleAddLicense} 
            processes={[
              { id: 'IMP-2023-001', name: 'Importação de Maquinário' },
              { id: 'IMP-2023-002', name: 'Importação de Eletrônicos' },
              { id: 'IMP-2023-003', name: 'Importação de Matéria-prima' },
              { id: 'IMP-2023-004', name: 'Importação de Produtos Químicos' }
            ]}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ImportLicenses;
