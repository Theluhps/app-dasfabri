
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FilePlus, Eye, Settings, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ExportProcesses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  
  const processes = [
    { id: 'EXP-2023-001', client: 'ABC Corporation', country: 'Estados Unidos', status: 'Em andamento', date: '05/04/2025', value: 'USD 45,000.00' },
    { id: 'EXP-2023-002', client: 'Global Enterprises', country: 'Canadá', status: 'Aguardando documentos', date: '12/04/2025', value: 'USD 32,500.00' },
    { id: 'EXP-2023-003', client: 'Sunrise Ltd', country: 'Alemanha', status: 'Embarque realizado', date: '18/04/2025', value: 'EUR 28,750.00' },
    { id: 'EXP-2023-004', client: 'Pacific Trading', country: 'Japão', status: 'Aguardando pagamento', date: '22/04/2025', value: 'JPY 5,200,000.00' },
    { id: 'EXP-2023-005', client: 'United Corp', country: 'China', status: 'Documentação concluída', date: '28/04/2025', value: 'USD 64,200.00' },
  ];

  const handleViewProcess = (process: typeof processes[0]) => {
    const processNumber = process.id.split('-').pop();
    navigate(`/export/processes?process=${processNumber}`);
  };

  const handleViewHistory = (process: typeof processes[0]) => {
    setSelectedProcess(process);
    setShowHistoryDialog(true);
  };

  const handleCreateProcess = () => {
    toast({
      title: "Novo processo",
      description: "Abrindo formulário para criar novo processo de exportação...",
    });
    setShowCreateDialog(true);
  };

  return (
    <PageLayout 
      title="Processos de Exportação" 
      description="Gerencie todos os processos de exportação da sua empresa"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button 
            className="flex items-center gap-2"
            onClick={handleCreateProcess}
          >
            <FilePlus className="h-4 w-4" />
            Novo Processo
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Processos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referência</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell className="font-medium">{process.id}</TableCell>
                    <TableCell>{process.client}</TableCell>
                    <TableCell>{process.country}</TableCell>
                    <TableCell>
                      <Badge variant={
                        process.status === 'Em andamento' ? 'default' :
                        process.status === 'Aguardando documentos' ? 'outline' :
                        process.status === 'Embarque realizado' ? 'secondary' :
                        process.status === 'Aguardando pagamento' ? 'destructive' :
                        'success'
                      }>
                        {process.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{process.date}</TableCell>
                    <TableCell>{process.value}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewProcess(process)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewHistory(process)}
                        title="Ver histórico"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          toast({
                            title: "Gerenciar processo",
                            description: `Abrindo opções de gerenciamento para ${process.id}`,
                          });
                        }}
                        title="Gerenciar"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para Histórico do Processo */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico do Processo
            </DialogTitle>
            <DialogDescription>
              Histórico completo de eventos e alterações
            </DialogDescription>
          </DialogHeader>
          
          {selectedProcess && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="font-medium">Processo: {selectedProcess.id}</p>
                <p className="text-sm text-gray-500">Cliente: {selectedProcess.client}</p>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="border-l-2 border-blue-500 pl-4 py-2">
                  <p className="text-sm font-medium">Processo criado</p>
                  <p className="text-xs text-gray-500">{selectedProcess.date}</p>
                </div>
                <div className="border-l-2 border-green-500 pl-4 py-2">
                  <p className="text-sm font-medium">Documentação iniciada</p>
                  <p className="text-xs text-gray-500">{selectedProcess.date}</p>
                </div>
                <div className="border-l-2 border-yellow-500 pl-4 py-2">
                  <p className="text-sm font-medium">Aguardando aprovação</p>
                  <p className="text-xs text-gray-500">{selectedProcess.date}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Criar Novo Processo */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Processo de Exportação</DialogTitle>
            <DialogDescription>
              Crie um novo processo de exportação
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Cliente</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Produto</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Descrição do produto"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Destino</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="País de destino"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Valor</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="USD 0,00"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({
                title: "Processo criado",
                description: "O novo processo de exportação foi criado com sucesso.",
              });
              setShowCreateDialog(false);
            }}>
              Criar Processo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ExportProcesses;
