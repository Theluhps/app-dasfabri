import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ship, MapPin, Clock, Navigation, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getTrackingStatus, getTrackingEvents, refreshTracking, TrackingEvent as APITrackingEvent } from '@/services/trackingService';

interface TrackingEvent {
  id: string;
  timestamp: Date;
  location: string;
  latitude?: number;
  longitude?: number;
  status: 'departed' | 'in-transit' | 'arrived' | 'delayed' | 'customs';
  description: string;
  vessel?: string;
  port?: string;
}

interface RealTimeTrackingProps {
  shipmentId: string;
  containerNumber?: string;
  origin?: string;
  destination?: string;
  vessel?: string;
  currentLocation?: string;
  events?: TrackingEvent[];
  onRefresh?: () => void;
}

const RealTimeTracking: React.FC<RealTimeTrackingProps> = ({
  shipmentId,
  containerNumber,
  origin: propOrigin,
  destination: propDestination,
  vessel: propVessel,
  currentLocation: propCurrentLocation,
  events: propEvents,
  onRefresh
}) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<TrackingEvent | null>(null);
  const [trackingData, setTrackingData] = useState<{
    origin: string;
    destination: string;
    vessel?: string;
    currentLocation?: string;
    events: TrackingEvent[];
  } | null>(null);

  // Converter eventos da API para o formato do componente
  const convertAPIEvents = (apiEvents: APITrackingEvent[]): TrackingEvent[] => {
    return apiEvents.map(event => ({
      id: event.id.toString(),
      timestamp: new Date(event.timestamp),
      location: event.location,
      latitude: event.latitude,
      longitude: event.longitude,
      status: event.status as any,
      description: event.description,
      vessel: event.vessel,
      port: event.port,
    }));
  };

  // Carregar dados de rastreamento
  const loadTrackingData = async () => {
    try {
      setIsLoading(true);
      const [status, events] = await Promise.all([
        getTrackingStatus(shipmentId),
        getTrackingEvents(shipmentId),
      ]);

      const convertedEvents = convertAPIEvents(events);
      
      setTrackingData({
        origin: propOrigin || status.current_location || 'Origem não informada',
        destination: propDestination || 'Destino não informado',
        vessel: propVessel || status.events.find(e => e.vessel)?.vessel,
        currentLocation: propCurrentLocation || status.current_location,
        events: convertedEvents.length > 0 ? convertedEvents : propEvents || [],
      });
    } catch (error) {
      console.error('Erro ao carregar rastreamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar informações de rastreamento.",
        variant: "destructive",
      });
      // Usar dados de props como fallback
      setTrackingData({
        origin: propOrigin || 'Origem não informada',
        destination: propDestination || 'Destino não informado',
        vessel: propVessel,
        currentLocation: propCurrentLocation,
        events: propEvents || [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados na montagem
  useEffect(() => {
    loadTrackingData();
  }, [shipmentId]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh || !shipmentId) return;
    
    const interval = setInterval(() => {
      loadTrackingData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, shipmentId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTracking(shipmentId);
      await loadTrackingData();
      toast({
        title: "Atualizado",
        description: "Informações de rastreamento atualizadas.",
      });
    } catch (error) {
      console.error('Erro ao atualizar rastreamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o rastreamento.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const origin = trackingData?.origin || propOrigin || 'Origem não informada';
  const destination = trackingData?.destination || propDestination || 'Destino não informado';
  const vessel = trackingData?.vessel || propVessel;
  const currentLocation = trackingData?.currentLocation || propCurrentLocation;
  const events = trackingData?.events || propEvents || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'departed': { label: 'Embarque', color: 'bg-blue-100 text-blue-800', icon: <Ship className="h-3 w-3" /> },
      'in-transit': { label: 'Em Trânsito', color: 'bg-purple-100 text-purple-800', icon: <Navigation className="h-3 w-3" /> },
      'arrived': { label: 'Chegou', color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-3 w-3" /> },
      'delayed': { label: 'Atrasado', color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-3 w-3" /> },
      'customs': { label: 'Alfândega', color: 'bg-amber-100 text-amber-800', icon: <Clock className="h-3 w-3" /> },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['in-transit'];
    
    return (
      <Badge className={cn("flex items-center gap-1", config.color)}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getCurrentStatus = () => {
    if (events.length === 0) return null;
    return events[events.length - 1];
  };

  const currentStatus = getCurrentStatus();

  return (
    <div className="space-y-6">
      {/* Header com informações principais */}
      <Card className="border-l-4 border-l-[#7E69AB]">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-[#7E69AB]" />
                Rastreamento em Tempo Real
              </CardTitle>
              <CardDescription className="mt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Embarque:</span>
                    <span>{shipmentId}</span>
                  </div>
                  {containerNumber && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Contêiner:</span>
                      <span>{containerNumber}</span>
                    </div>
                  )}
                  {vessel && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Navio:</span>
                      <span>{vessel}</span>
                    </div>
                  )}
                </div>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
              >
                <Clock className={cn("h-4 w-4 mr-2", autoRefresh && "animate-pulse")} />
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Origem</span>
              </div>
              <p className="text-lg font-semibold text-blue-700">{origin}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Localização Atual</span>
              </div>
              <p className="text-lg font-semibold text-purple-700">
                {currentLocation || currentStatus?.location || 'Em trânsito'}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Destino</span>
              </div>
              <p className="text-lg font-semibold text-green-700">{destination}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status atual */}
      {currentStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                {getStatusBadge(currentStatus.status)}
                <div>
                  <p className="font-medium">{currentStatus.description}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {currentStatus.location}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Última atualização</p>
                <p className="font-medium">
                  {currentStatus.timestamp.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline de eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Rastreamento</CardTitle>
          <CardDescription>
            Timeline completa de eventos do embarque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Linha vertical da timeline */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {events.map((event, index) => {
                const isLast = index === events.length - 1;
                const isCurrent = event.status === currentStatus?.status;
                
                return (
                  <div
                    key={event.id}
                    className="relative pl-12 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Ponto da timeline */}
                    <div
                      className={cn(
                        "absolute left-0 w-8 h-8 rounded-full border-4 flex items-center justify-center",
                        isCurrent
                          ? "bg-[#7E69AB] border-white shadow-lg"
                          : isLast
                            ? "bg-green-500 border-white"
                            : "bg-gray-300 border-white"
                      )}
                    >
                      {isCurrent ? (
                        <Navigation className="h-4 w-4 text-white animate-pulse" />
                      ) : isLast ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    
                    {/* Conteúdo do evento */}
                    <div className={cn(
                      "p-4 rounded-lg border",
                      isCurrent
                        ? "border-[#7E69AB] bg-[#7E69AB]/5"
                        : "border-gray-200 bg-white"
                    )}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(event.status)}
                          {isCurrent && (
                            <Badge variant="outline" className="bg-[#7E69AB] text-white border-[#7E69AB]">
                              Atual
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {event.timestamp.toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="font-medium mb-1">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                        {event.port && (
                          <span className="flex items-center gap-1">
                            <Ship className="h-3 w-3" />
                            {event.port}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa visual (placeholder para integração futura com Google Maps/Mapbox) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rota Visual</CardTitle>
          <CardDescription>
            Visualização da rota do embarque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Placeholder para mapa - pode ser integrado com Google Maps ou Mapbox */}
            <div className="text-center z-10">
              <Navigation className="h-12 w-12 text-[#7E69AB] mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Visualização de Mapa</p>
              <p className="text-sm text-gray-500 mt-1">
                Integração com Google Maps / Mapbox em desenvolvimento
              </p>
            </div>
            
            {/* Indicadores de rota simulados */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
                <div className="w-32 h-1 bg-blue-300 rounded"></div>
                <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-lg animate-pulse"></div>
                <div className="w-32 h-1 bg-purple-300 rounded"></div>
                <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-lg"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeTracking;

