import React, { useState, useEffect, useRef } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, MapPin, Ship, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mapService, MapShipmentPoint } from '@/services/mapService';
import { useTheme } from '@/hooks/use-theme';

// Componente de Mapa Simples usando SVG (sem dependências externas)
const SimpleMap: React.FC<{
  shipments: MapShipmentPoint[];
  onShipmentClick: (shipment: MapShipmentPoint) => void;
}> = ({ shipments, onShipmentClick }) => {
  const [selectedShipment, setSelectedShipment] = useState<MapShipmentPoint | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Calcular bounds do mapa
  const calculateBounds = () => {
    if (shipments.length === 0) {
      return { minLat: -30, maxLat: 10, minLng: -80, maxLng: -30 }; // Brasil default
    }

    const lats = shipments.map(s => s.latitude);
    const lngs = shipments.map(s => s.longitude);
    
    return {
      minLat: Math.min(...lats) - 5,
      maxLat: Math.max(...lats) + 5,
      minLng: Math.min(...lngs) - 5,
      maxLng: Math.max(...lngs) + 5,
    };
  };

  const bounds = calculateBounds();
  const width = 800;
  const height = 600;

  const latRange = bounds.maxLat - bounds.minLat;
  const lngRange = bounds.maxLng - bounds.minLng;

  const projectPoint = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / lngRange) * width;
    const y = height - ((lat - bounds.minLat) / latRange) * height; // Invertido para SVG
    return { x, y };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#10b981'; // green
      case 'in-transit':
        return '#3b82f6'; // blue
      case 'departed':
        return '#8b5cf6'; // purple
      case 'arrived':
        return '#f59e0b'; // amber
      case 'delayed':
        return '#ef4444'; // red
      case 'customs':
        return '#f97316'; // orange
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="relative w-full h-[600px] border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0"
      >
        {/* Grid de referência */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Linhas de rota */}
        {shipments.map((shipment) => {
          const origin = projectPoint(
            parseFloat(shipment.origin.split(',')[0]) || shipment.latitude,
            parseFloat(shipment.origin.split(',')[1]) || shipment.longitude
          );
          const dest = projectPoint(
            parseFloat(shipment.destination.split(',')[0]) || shipment.latitude,
            parseFloat(shipment.destination.split(',')[1]) || shipment.longitude
          );
          const current = projectPoint(shipment.latitude, shipment.longitude);

          return (
            <g key={shipment.shipment_id}>
              {/* Linha origem -> destino */}
              <line
                x1={origin.x}
                y1={origin.y}
                x2={dest.x}
                y2={dest.y}
                stroke="#d1d5db"
                strokeWidth="1"
                strokeDasharray="5,5"
                opacity="0.5"
              />
              {/* Linha origem -> atual */}
              <line
                x1={origin.x}
                y1={origin.y}
                x2={current.x}
                y2={current.y}
                stroke={getStatusColor(shipment.status)}
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Pins dos embarques */}
        {shipments.map((shipment) => {
          const point = projectPoint(shipment.latitude, shipment.longitude);
          const color = getStatusColor(shipment.status);
          const isSelected = selectedShipment?.shipment_id === shipment.shipment_id;

          return (
            <g
              key={shipment.shipment_id}
              onClick={() => {
                setSelectedShipment(shipment);
                onShipmentClick(shipment);
              }}
              className="cursor-pointer"
            >
              {/* Sombra */}
              <circle
                cx={point.x}
                cy={point.y + 2}
                r="8"
                fill="rgba(0,0,0,0.2)"
              />
              {/* Pin */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isSelected ? "10" : "8"}
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="hover:r-10 transition-all"
              />
              {/* Ícone interno */}
              <text
                x={point.x}
                y={point.y + 4}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
              >
                {shipment.process_type === 'import' ? 'I' : shipment.process_type === 'export' ? 'E' : '?'}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
        <h4 className="text-sm font-semibold mb-2">Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Entregue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Em Trânsito</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Partiu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Chegou</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Atrasado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Alfândega</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Map: React.FC = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [shipments, setShipments] = useState<MapShipmentPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedShipment, setSelectedShipment] = useState<MapShipmentPoint | null>(null);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const data = await mapService.getMapData(selectedStatus === 'all' ? undefined : selectedStatus);
      setShipments(data.shipments);
    } catch (error) {
      console.error('Erro ao carregar dados do mapa:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do mapa',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapData();
  }, [selectedStatus]);

  const handleShipmentClick = (shipment: MapShipmentPoint) => {
    setSelectedShipment(shipment);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PageLayout
      title="Mapa Global de Embarques"
      description="Visualize todos os seus embarques em tempo real no mapa"
      icon={MapPin}
    >
      <div className="space-y-6">
        {/* Filtros e Controles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Controles do Mapa</CardTitle>
                <CardDescription>
                  {shipments.length} {shipments.length === 1 ? 'embarque' : 'embarques'} no mapa
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="departed">Partiu</SelectItem>
                    <SelectItem value="in-transit">Em Trânsito</SelectItem>
                    <SelectItem value="arrived">Chegou</SelectItem>
                    <SelectItem value="delayed">Atrasado</SelectItem>
                    <SelectItem value="customs">Alfândega</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadMapData} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Mapa */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#7E69AB]" />
              </div>
            ) : shipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[600px] text-center">
                <MapPin className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum embarque no mapa</h3>
                <p className="text-muted-foreground">
                  Não há embarques com localização disponível no momento.
                </p>
              </div>
            ) : (
              <SimpleMap shipments={shipments} onShipmentClick={handleShipmentClick} />
            )}
          </CardContent>
        </Card>

        {/* Detalhes do Embarque Selecionado */}
        {selectedShipment && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalhes do Embarque</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedShipment(null)}>
                  Fechar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID do Embarque</p>
                  <p className="font-medium">{selectedShipment.shipment_id}</p>
                </div>
                {selectedShipment.container_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">Container</p>
                    <p className="font-medium">{selectedShipment.container_number}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge>{selectedShipment.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge variant="outline">
                    {selectedShipment.process_type === 'import' ? 'Importação' : 
                     selectedShipment.process_type === 'export' ? 'Exportação' : 'Desconhecido'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Origem</p>
                  <p className="font-medium">{selectedShipment.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destino</p>
                  <p className="font-medium">{selectedShipment.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Localização Atual</p>
                  <p className="font-medium">{selectedShipment.location}</p>
                </div>
                {selectedShipment.vessel && (
                  <div>
                    <p className="text-sm text-muted-foreground">Navio</p>
                    <p className="font-medium">{selectedShipment.vessel}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Última Atualização</p>
                  <p className="font-medium">{formatDate(selectedShipment.last_update)}</p>
                </div>
                {selectedShipment.description && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="font-medium">{selectedShipment.description}</p>
                  </div>
                )}
                {selectedShipment.process_id && (
                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `/import/process/${selectedShipment.process_id}`}
                    >
                      Ver Detalhes do Processo
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Embarques */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Embarques</CardTitle>
            <CardDescription>
              Clique em um embarque no mapa ou na lista para ver detalhes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shipments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum embarque encontrado
              </p>
            ) : (
              <div className="space-y-2">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.shipment_id}
                    onClick={() => setSelectedShipment(shipment)}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedShipment?.shipment_id === shipment.shipment_id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {shipment.process_type === 'import' ? (
                          <Package className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Ship className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium">{shipment.shipment_id}</p>
                          <p className="text-sm text-muted-foreground">
                            {shipment.location} → {shipment.destination}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{shipment.status}</Badge>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(shipment.last_update)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Map;

