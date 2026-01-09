
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
import { FilePlus, Eye, Filter, FileText, Search, Container } from 'lucide-react';

const LogisticsContainers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContainer, setSelectedContainer] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const containers = [
    { 
      id: 'CNTR-001', 
      number: 'MSCU1234567',
      type: '40HC',
      process: 'IMP-2023-001', 
      booking: 'BKG-12345',
      vessel: 'MSC ANTONELLA',
      voyage: 'MA123E',
      origin: 'Shanghai, China',
      destination: 'Santos, Brasil',
      eta: '28/05/2025',
      status: 'Em trânsito'
    },
    { 
      id: 'CNTR-002', 
      number: 'MAEU7654321',
      type: '20DC',
      process: 'IMP-2023-002', 
      booking: 'BKG-67890',
      vessel: 'MAERSK HONAM',
      voyage: 'MH456W',
      origin: 'Hamburg, Alemanha',
      destination: 'Santos, Brasil',
      eta: '15/06/2025',
      status: 'Embarcado'
    },
    { 
      id: 'CNTR-003', 
      number: 'HLXU8765432',
      type: '40RF',
      process: 'IMP-2023-003', 
      booking: 'BKG-54321',
      vessel: 'HAMBURG SUD COPACABANA',
      voyage: 'HS789N',
      origin: 'Rotterdam, Holanda',
      destination: 'Salvador, Brasil',
      eta: '22/06/2025',
      status: 'Em trânsito'
    },
    { 
      id: 'CNTR-004', 
      number: 'TCLU1122334',
      type: '40HC',
      process: 'EXP-2023-001', 
      booking: 'BKG-13579',
      vessel: 'MSC AVNI',
      voyage: 'AV321S',
      origin: 'Santos, Brasil',
      destination: 'New York, EUA',
      eta: '30/05/2025',
      status: 'Embarcado'
    },
  ];

  const filteredContainers = containers.filter(container =>
    container.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.process.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewContainer = (container: typeof containers[0]) => {
    setSelectedContainer(container);
    setShowViewDialog(true);
  };

  const handleCreateContainer = () => {
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
      title="Gestão de Contêineres" 
      description="Gerencie todos os contêineres relacionados aos processos de importação e exportação"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar contêineres..."
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
              onClick={handleCreateContainer}
            >
              <FilePlus className="h-4 w-4" />
              Novo Contêiner
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Contêineres Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Navio/Viagem</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContainers.map((container) => (
                  <TableRow key={container.id}>
                    <TableCell>{container.id}</TableCell>
                    <TableCell>{container.number}</TableCell>
                    <TableCell>{container.type}</TableCell>
                    <TableCell>{container.process}</TableCell>
                    <TableCell>{`${container.vessel} / ${container.voyage}`}</TableCell>
                    <TableCell>{container.origin}</TableCell>
                    <TableCell>{container.destination}</TableCell>
                    <TableCell>{container.eta}</TableCell>
                    <TableCell>{getStatusBadge(container.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewContainer(container)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          toast({
                            title: "Documentos",
                            description: `Abrindo documentos do contêiner ${container.number}...`,
                          });
                        }}
                        title="Ver documentos"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados de Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {containers.slice(0, 2).map((container) => (
                  <div key={`booking-${container.id}`} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Booking: {container.booking}</h3>
                        <p className="text-sm text-gray-500">Contêiner: {container.number}</p>
                      </div>
                      {getStatusBadge(container.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm">
                        <p className="font-medium">Navio</p>
                        <p className="text-gray-600">{container.vessel}</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Viagem</p>
                        <p className="text-gray-600">{container.voyage}</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Tipo</p>
                        <p className="text-gray-600">{container.type}</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">ETA</p>
                        <p className="text-gray-600">{container.eta}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas de Demurrage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">CNTR-002 - MAEU7654321</h3>
                      <p className="text-sm text-gray-500">Tipo: 20DC</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      3 dias para demurrage
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">Free time termina em: 18/05/2025</p>
                </div>

                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">CNTR-001 - MSCU1234567</h3>
                      <p className="text-sm text-gray-500">Tipo: 40HC</p>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      Em demurrage
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">Custo atual: US$ 120/dia (2 dias)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog para Visualizar Contêiner */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Container className="h-5 w-5" />
              Detalhes do Contêiner
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre o contêiner
            </DialogDescription>
          </DialogHeader>
          
          {selectedContainer && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID</p>
                  <p className="font-medium">{selectedContainer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Número</p>
                  <p className="font-medium">{selectedContainer.number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tipo</p>
                  <p className="font-medium">{selectedContainer.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Processo</p>
                  <p className="font-medium">{selectedContainer.process}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Booking</p>
                  <p className="font-medium">{selectedContainer.booking}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  {getStatusBadge(selectedContainer.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Navio</p>
                  <p className="font-medium">{selectedContainer.vessel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Viagem</p>
                  <p className="font-medium">{selectedContainer.voyage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Origem</p>
                  <p className="font-medium">{selectedContainer.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Destino</p>
                  <p className="font-medium">{selectedContainer.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ETA</p>
                  <p className="font-medium">{selectedContainer.eta}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Fechar
            </Button>
            {selectedContainer && (
              <Button
                onClick={() => {
                  const processNumber = selectedContainer.process.split('-').pop();
                  navigate(`/import/process/${processNumber}`);
                  setShowViewDialog(false);
                }}
              >
                Ver Processo
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Criar Novo Contêiner */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Contêiner</DialogTitle>
            <DialogDescription>
              Crie um novo contêiner para rastreamento
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Número do Contêiner</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="MSCU1234567"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Selecione</option>
                  <option value="20DC">20DC</option>
                  <option value="40HC">40HC</option>
                  <option value="40RF">40RF</option>
                </select>
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
                <label className="text-sm font-medium mb-1 block">Booking</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="BKG-12345"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Navio</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Nome do navio"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Viagem</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Código da viagem"
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
                title: "Contêiner criado",
                description: "O novo contêiner foi criado com sucesso.",
              });
              setShowCreateDialog(false);
            }}>
              Criar Contêiner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default LogisticsContainers;
