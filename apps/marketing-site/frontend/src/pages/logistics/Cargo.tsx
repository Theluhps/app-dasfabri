
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
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FilePlus, Eye, Download, Filter, Search, History, Truck } from 'lucide-react';

const LogisticsCargo = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCargo, setSelectedCargo] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const cargos = [
    { 
      id: 'CARGO-001', 
      description: 'Maquinário Industrial', 
      process: 'IMP-2023-001', 
      weight: '3.500 kg',
      volume: '15 m³',
      origin: 'Shanghai, China',
      destination: 'Santos, Brasil',
      eta: '28/05/2025',
      status: 'Em trânsito'
    },
    { 
      id: 'CARGO-002', 
      description: 'Peças Automotivas', 
      process: 'IMP-2023-002', 
      weight: '2.100 kg',
      volume: '8 m³',
      origin: 'Hamburg, Alemanha',
      destination: 'Santos, Brasil',
      eta: '15/06/2025',
      status: 'Embarcado'
    },
    { 
      id: 'CARGO-003', 
      description: 'Produtos Químicos', 
      process: 'IMP-2023-003', 
      weight: '1.800 kg',
      volume: '6 m³',
      origin: 'Rotterdam, Holanda',
      destination: 'Salvador, Brasil',
      eta: '22/06/2025',
      status: 'Em trânsito'
    },
    { 
      id: 'CARGO-004', 
      description: 'Café', 
      process: 'EXP-2023-001', 
      weight: '5.000 kg',
      volume: '10 m³',
      origin: 'Santos, Brasil',
      destination: 'New York, EUA',
      eta: '30/05/2025',
      status: 'Embarcado'
    },
  ];

  const filteredCargos = cargos.filter(cargo =>
    cargo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cargo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cargo.process.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCargo = (cargo: typeof cargos[0]) => {
    setSelectedCargo(cargo);
    setShowViewDialog(true);
  };

  const handleViewHistory = (cargo: typeof cargos[0]) => {
    setSelectedCargo(cargo);
    setShowHistoryDialog(true);
  };

  const handleCreateCargo = () => {
    setShowCreateDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Em trânsito':
        return <Badge variant="secondary">{status}</Badge>;
      case 'Embarcado':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{status}</Badge>;
      case 'Entregue':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{status}</Badge>;
      case 'Atrasado':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <PageLayout 
      title="Gestão de Cargas" 
      description="Gerencie todas as cargas relacionadas aos processos de importação e exportação"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar cargas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={handleCreateCargo}
            >
              <FilePlus className="h-4 w-4" />
              Nova Carga
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Cargas em Movimento</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Peso/Volume</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCargos.map((cargo) => (
                  <TableRow key={cargo.id}>
                    <TableCell>{cargo.id}</TableCell>
                    <TableCell>{cargo.description}</TableCell>
                    <TableCell>{cargo.process}</TableCell>
                    <TableCell>{`${cargo.weight} / ${cargo.volume}`}</TableCell>
                    <TableCell>{cargo.origin}</TableCell>
                    <TableCell>{cargo.destination}</TableCell>
                    <TableCell>{cargo.eta}</TableCell>
                    <TableCell>{getStatusBadge(cargo.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewCargo(cargo)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          toast({
                            title: "Download iniciado",
                            description: `Baixando informações da carga ${cargo.id}...`,
                          });
                        }}
                        title="Baixar informações"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Rastreamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cargos.slice(0, 2).map((cargo) => (
                <div 
                  key={`history-${cargo.id}`} 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleViewHistory(cargo)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{cargo.id} - {cargo.description}</h3>
                      <p className="text-sm text-gray-500">Processo: {cargo.process}</p>
                    </div>
                    {getStatusBadge(cargo.status)}
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Chegada ao porto de origem</span>
                      <span className="text-gray-500">10/05/2025</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Liberação aduaneira</span>
                      <span className="text-gray-500">12/05/2025</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Embarque</span>
                      <span className="text-gray-500">15/05/2025</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Em trânsito</span>
                      <span className="text-gray-500">Atual</span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewHistory(cargo);
                      }}
                      className="flex items-center gap-1"
                    >
                      <History className="h-4 w-4" />
                      Ver Histórico Completo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para Visualizar Carga */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Detalhes da Carga
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre a carga
            </DialogDescription>
          </DialogHeader>
          
          {selectedCargo && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID</p>
                  <p className="font-medium">{selectedCargo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Descrição</p>
                  <p className="font-medium">{selectedCargo.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Processo</p>
                  <p className="font-medium">{selectedCargo.process}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  {getStatusBadge(selectedCargo.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Peso</p>
                  <p className="font-medium">{selectedCargo.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Volume</p>
                  <p className="font-medium">{selectedCargo.volume}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Origem</p>
                  <p className="font-medium">{selectedCargo.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Destino</p>
                  <p className="font-medium">{selectedCargo.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ETA</p>
                  <p className="font-medium">{selectedCargo.eta}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Fechar
            </Button>
            {selectedCargo && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleViewHistory(selectedCargo);
                    setShowViewDialog(false);
                  }}
                >
                  <History className="h-4 w-4 mr-2" />
                  Ver Histórico
                </Button>
                <Button
                  onClick={() => {
                    const processNumber = selectedCargo.process.split('-').pop();
                    navigate(`/import/process/${processNumber}`);
                    setShowViewDialog(false);
                  }}
                >
                  Ver Processo
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Histórico */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Rastreamento
            </DialogTitle>
            <DialogDescription>
              Histórico completo de eventos da carga
            </DialogDescription>
          </DialogHeader>
          
          {selectedCargo && (
            <div className="space-y-4 py-4">
              <div className="space-y-2 mb-4">
                <p className="font-medium">{selectedCargo.id} - {selectedCargo.description}</p>
                <p className="text-sm text-gray-500">Processo: {selectedCargo.process}</p>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="border-l-2 border-blue-500 pl-4 py-2">
                  <p className="text-sm font-medium">Chegada ao porto de origem</p>
                  <p className="text-xs text-gray-500">10/05/2025 14:30</p>
                </div>
                <div className="border-l-2 border-green-500 pl-4 py-2">
                  <p className="text-sm font-medium">Liberação aduaneira</p>
                  <p className="text-xs text-gray-500">12/05/2025 10:15</p>
                </div>
                <div className="border-l-2 border-yellow-500 pl-4 py-2">
                  <p className="text-sm font-medium">Embarque realizado</p>
                  <p className="text-xs text-gray-500">15/05/2025 08:00</p>
                </div>
                <div className="border-l-2 border-purple-500 pl-4 py-2">
                  <p className="text-sm font-medium">Em trânsito</p>
                  <p className="text-xs text-gray-500">Atual</p>
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

      {/* Dialog para Criar Nova Carga */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Carga</DialogTitle>
            <DialogDescription>
              Crie uma nova carga para rastreamento
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Descrição</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Descrição da carga"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Processo</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="IMP-2023-XXX"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Peso (kg)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Volume (m³)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Origem</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Cidade, País"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Destino</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Cidade, País"
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
                title: "Carga criada",
                description: "A nova carga foi criada com sucesso.",
              });
              setShowCreateDialog(false);
            }}>
              Criar Carga
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default LogisticsCargo;
