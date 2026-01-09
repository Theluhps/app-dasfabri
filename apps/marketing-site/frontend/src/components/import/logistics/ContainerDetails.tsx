
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, ArrowRight, Ship, Calendar } from 'lucide-react';

interface Container {
  id: string;
  number: string;
  type: string;
  status: string;
  location: string;
  originPort: string;
  destinationPort: string;
  vessel?: string;
  departure?: string;
  arrival?: string;
  loadingDate?: string;
  unloadingDate?: string;
  events?: {
    date: string;
    location: string;
    status: string;
    description: string;
  }[];
}

interface ContainerDetailsProps {
  container: Container;
}

const ContainerDetails: React.FC<ContainerDetailsProps> = ({ container }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em trânsito': return 'bg-blue-100 text-blue-800';
      case 'descarregado': return 'bg-green-100 text-green-800';
      case 'aguardando embarque': return 'bg-yellow-100 text-yellow-800';
      case 'carregado': return 'bg-purple-100 text-purple-800';
      case 'liberado': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-t-2 border-t-blue-500 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Box className="h-5 w-5 text-blue-500" />
          Contêiner {container.number}
        </CardTitle>
        <CardDescription>
          {container.type} - <Badge className={getStatusColor(container.status)}>{container.status}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Localização Atual</p>
              <p>{container.location}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo</p>
              <p>{container.type}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Rota</p>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{container.originPort}</span>
              <ArrowRight className="h-4 w-4" />
              <span className="font-medium">{container.destinationPort}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Navio</p>
              <p className="flex items-center gap-1.5">
                <Ship className="h-4 w-4 text-gray-500" />
                {container.vessel || 'Não informado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">ETD (Partida)</p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-500" />
                {container.departure || 'Não informado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">ETA (Chegada)</p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-500" />
                {container.arrival || 'Não informado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Carregamento</p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-500" />
                {container.loadingDate || 'Não informado'}
              </p>
            </div>
          </div>
          
          {container.events && container.events.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Eventos Recentes</p>
              <div className="space-y-2">
                {container.events.slice(0, 3).map((event, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded-md text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{event.date}</span>
                      <Badge variant="outline">{event.status}</Badge>
                    </div>
                    <p className="text-gray-600">{event.description}</p>
                    <p className="text-gray-500 text-xs">{event.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContainerDetails;
