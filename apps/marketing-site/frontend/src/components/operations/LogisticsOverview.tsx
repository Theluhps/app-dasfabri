
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Ship, Plane, Truck, ArrowRight, MapPin, Calendar } from 'lucide-react';

const shipments = [
  {
    id: "SHIP001",
    processId: "IMP-2023-001",
    origin: "Shanghai, China",
    destination: "Santos, Brasil",
    departureDate: "05/05/2025",
    arrivalDate: "30/06/2025",
    status: "Em trânsito",
    type: "maritime",
    client: "Empresa ABC Ltda",
    daysToArrival: 50
  },
  {
    id: "SHIP002",
    processId: "IMP-2023-005",
    origin: "Tokyo, Japão",
    destination: "Guarulhos, Brasil",
    departureDate: "08/05/2025",
    arrivalDate: "15/05/2025",
    status: "Em trânsito",
    type: "air",
    client: "Tecnologia Avançada",
    daysToArrival: 5
  },
  {
    id: "SHIP003",
    processId: "IMP-2023-003",
    origin: "Los Angeles, EUA",
    destination: "Santos, Brasil",
    departureDate: "01/05/2025",
    arrivalDate: "10/06/2025",
    status: "Em trânsito",
    type: "maritime",
    client: "Indústria Nacional",
    daysToArrival: 30
  }
];

const LogisticsOverview = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'maritime':
        return <Ship className="h-5 w-5 text-blue-500" />;
      case 'air':
        return <Plane className="h-5 w-5 text-purple-500" />;
      case 'road':
        return <Truck className="h-5 w-5 text-amber-500" />;
      default:
        return <Ship className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (daysToArrival: number) => {
    if (daysToArrival <= 7) return 'bg-green-100 text-green-800 border-green-300';
    if (daysToArrival <= 30) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  const getStatusText = (daysToArrival: number) => {
    if (daysToArrival <= 7) return 'Chegada próxima';
    if (daysToArrival <= 30) return 'Em trânsito';
    return 'Longa distância';
  };

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={isDark ? 'text-gray-100' : ''}>
              Logística e Cargas
            </CardTitle>
            <CardDescription className={isDark ? 'text-gray-400' : ''}>
              Transporte e cargas em andamento
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5"
          >
            Ver mapa de cargas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        <div className="divide-y">
          {shipments.map((shipment) => (
            <div 
              key={shipment.id} 
              className={`px-6 py-4 ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getTransportIcon(shipment.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isDark ? 'text-gray-100' : ''}`}>
                        {shipment.client}
                      </span>
                      <Badge className={getStatusColor(shipment.daysToArrival)}>
                        {getStatusText(shipment.daysToArrival)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Processo: {shipment.processId} • Embarque: {shipment.id}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Origem</p>
                    <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {shipment.origin}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Destino</p>
                    <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {shipment.destination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Saída</p>
                    <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {shipment.departureDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Chegada</p>
                    <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {shipment.arrivalDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 text-center">
          <Button variant="link" className="text-sm flex items-center gap-1.5">
            Ver todos os embarques <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogisticsOverview;
