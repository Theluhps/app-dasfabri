import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, LinkIcon, ExternalLink, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ContainerListProps {
  processId: string;
  containerId?: string;
  showLinkButton?: boolean;
}

interface Container {
  id: string;
  number: string;
  type: string;
  booking: string;
  vessel: string;
  voyage: string;
  origin: string;
  destination: string;
  eta: string;
  status: string;
  processId?: string;
}

const ContainerList: React.FC<ContainerListProps> = ({ processId, containerId, showLinkButton = false }) => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchContainers();
  }, [processId, containerId]);

  const fetchContainers = async () => {
    setLoading(true);
    // Simulando uma chamada de API
    setTimeout(() => {
      // Se temos um containerId, filtramos apenas esse container
      if (containerId) {
        const filteredContainers = mockContainers.filter(c => c.id === containerId);
        setContainers(filteredContainers);
      } else {
        // Se temos um processId, filtramos containers relacionados a esse processo
        const relatedContainers = mockContainers.filter(c => c.processId === processId);
        setContainers(relatedContainers.length > 0 ? relatedContainers : mockContainers.slice(0, 2));
      }
      setLoading(false);
    }, 500);
  };

  const handleLinkContainer = () => {
    toast({
      title: "Container vinculado",
      description: `O container foi vinculado ao processo ${processId} com sucesso.`,
    });
  };

  const handleViewFullDetails = (containerId: string) => {
    navigate(`/logistics/containers?id=${containerId}`);
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

  // Mock data
  const mockContainers = [
    { 
      id: 'CNTR-001', 
      number: 'MSCU1234567',
      type: '40HC',
      booking: 'BKG-12345',
      vessel: 'MSC ANTONELLA',
      voyage: 'MA123E',
      origin: 'Shanghai, China',
      destination: 'Santos, Brasil',
      eta: '28/05/2025',
      status: 'Em trânsito',
      processId: 'IMP-2023-001'
    },
    { 
      id: 'CNTR-002', 
      number: 'MAEU7654321',
      type: '20DC',
      booking: 'BKG-67890',
      vessel: 'MAERSK HONAM',
      voyage: 'MH456W',
      origin: 'Hamburg, Alemanha',
      destination: 'Santos, Brasil',
      eta: '15/06/2025',
      status: 'Embarcado',
      processId: 'IMP-2023-002'
    },
    { 
      id: 'CNTR-003', 
      number: 'HLXU8765432',
      type: '40RF',
      booking: 'BKG-54321',
      vessel: 'HAMBURG SUD COPACABANA',
      voyage: 'HS789N',
      origin: 'Rotterdam, Holanda',
      destination: 'Salvador, Brasil',
      eta: '22/06/2025',
      status: 'Em trânsito',
      processId: 'IMP-2023-003'
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Contêineres Vinculados</CardTitle>
        <div className="flex gap-2">
          {showLinkButton && (
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleLinkContainer}>
              <Link className="h-4 w-4" />
              Vincular Contêiner
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={fetchContainers}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando contêineres...</div>
        ) : containers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Não há contêineres vinculados a este processo.</p>
            {showLinkButton && (
              <Button variant="outline" className="mt-4" onClick={handleLinkContainer}>
                <Link className="h-4 w-4 mr-2" />
                Vincular Contêiner Existente
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {containers.map((container) => (
              <div key={container.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{container.number}</h3>
                    <p className="text-sm text-muted-foreground">
                      {container.type} • {container.booking}
                    </p>
                  </div>
                  {getStatusBadge(container.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Navio/Viagem</p>
                    <p>{container.vessel} / {container.voyage}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ETA</p>
                    <p>{container.eta}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Origem</p>
                    <p>{container.origin}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Destino</p>
                    <p>{container.destination}</p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleViewFullDetails(container.id)}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver detalhes completos
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContainerList;
