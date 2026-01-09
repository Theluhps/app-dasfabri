
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, MapPin, Calendar, ArrowRight, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShipmentEvent {
  date: string;
  location: string;
  status: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

interface ShipmentTrackingProps {
  shipmentId: string;
  origin: string;
  destination: string;
  vessel?: string;
  departureDate?: string;
  arrivalDate?: string;
  events: ShipmentEvent[];
}

const ShipmentTracking: React.FC<ShipmentTrackingProps> = ({ 
  shipmentId,
  origin,
  destination,
  vessel,
  departureDate,
  arrivalDate,
  events
}) => {
  return (
    <Card className="border-t-2 border-t-blue-500 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Ship className="h-5 w-5 text-blue-500" />
          Tracking de Embarque {shipmentId}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1 text-sm mt-1">
            <span>{origin}</span>
            <ArrowRight className="h-3 w-3 mx-1" />
            <span>{destination}</span>
            {vessel && (
              <span className="ml-2 flex items-center gap-1">
                <Ship className="h-3 w-3" /> {vessel}
              </span>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>ETD: {departureDate || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>ETA: {arrivalDate || 'N/A'}</span>
          </div>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Events */}
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={index} className="relative pl-10">
                {/* Status dot */}
                <div 
                  className={cn(
                    "absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    event.current 
                      ? "bg-blue-500 border-blue-200" 
                      : event.completed 
                        ? "bg-green-500 border-green-200"
                        : "bg-gray-200 border-gray-100"
                  )}
                >
                  <Package className={cn("h-3 w-3", event.current || event.completed ? "text-white" : "text-gray-400")} />
                </div>
                
                {/* Event content */}
                <div className={cn(
                  "p-3 rounded-lg border", 
                  event.current ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"
                )}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{event.status}</span>
                    <span className="text-gray-500">{event.date}</span>
                  </div>
                  <p className="text-sm mt-1">{event.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentTracking;
