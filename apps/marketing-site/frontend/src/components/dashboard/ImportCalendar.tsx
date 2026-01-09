
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Ship,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Package,
  Eye,
  CheckCircle,
  Calendar as CalendarIcon
} from 'lucide-react';

// Dados simulados para eventos do calendário
const calendarEvents = [
  { date: new Date(2025, 4, 15), type: 'arrival', process: 'IMP-2023-001', title: 'Chegada de Carga', description: 'Contêiner ABCD1234567 - Porto de Santos' },
  { date: new Date(2025, 4, 17), type: 'payment', process: 'IMP-2023-003', title: 'Pagamento de Impostos', description: 'Valor: R$ 45.320,00' },
  { date: new Date(2025, 4, 20), type: 'inspection', process: 'IMP-2023-002', title: 'Vistoria Anvisa', description: 'Local: Armazém 12 - 10:30h' },
  { date: new Date(2025, 4, 22), type: 'document', process: 'IMP-2023-004', title: 'Deadline Documentação', description: 'Documentos obrigatórios para liberação' },
  { date: new Date(2025, 4, 25), type: 'license', process: 'IMP-2023-005', title: 'Validade da LI', description: 'Licença de Importação expira em 7 dias' },
  { date: new Date(2025, 4, 28), type: 'arrival', process: 'IMP-2023-006', title: 'Chegada de Carga', description: 'Contêiner WXYZ7654321 - Aeroporto de Guarulhos' },
  { date: new Date(2025, 4, 30), type: 'delivery', process: 'IMP-2023-002', title: 'Entrega ao Cliente', description: 'Entrega programada ao armazém do cliente' },
  { date: new Date(2025, 5, 3), type: 'license', process: 'IMP-2023-007', title: 'Renovação LPCO', description: 'Prazo final para renovação' },
  { date: new Date(2025, 5, 5), type: 'payment', process: 'IMP-2023-008', title: 'Vencimento Fatura', description: 'Frete internacional - USD 12.800,00' },
  { date: new Date(2025, 5, 10), type: 'arrival', process: 'IMP-2023-009', title: 'Chegada de Carga', description: 'Contêiner PQRS5678901 - Porto de Itajaí' },
];

const ImportCalendar = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  
  // Funções para gerenciar a exibição de eventos
  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Verificar se uma data tem eventos
  const hasEvents = (date: Date) => {
    return calendarEvents.some(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Ícone baseado no tipo de evento
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'arrival':
        return <Ship className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case 'license':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'inspection':
        return <CheckCircle2 className="h-4 w-4 text-indigo-500" />;
      case 'delivery':
        return <Package className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Badge cor baseada no tipo de evento
  const getEventBadgeClass = (type: string) => {
    switch(type) {
      case 'arrival':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'document':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'payment':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'license':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'inspection':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivery':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleResolve = (event: any) => {
    toast({
      title: "Evento resolvido",
      description: `O evento "${event.title}" foi marcado como resolvido.`,
    });
    setShowEventDialog(false);
  };

  const handleViewProcess = (processId: string) => {
    const processNumber = processId.split('-').pop();
    navigate(`/import/process/${processNumber}`);
    setShowEventDialog(false);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className={cn("rounded-md border", isDark ? 'bg-gray-800 border-gray-700' : 'bg-white')}
          modifiers={{
            hasEvent: (date) => hasEvents(date),
          }}
          modifiersClassNames={{
            hasEvent: cn(
              'font-bold text-[#7E69AB] relative',
              isDark ? 'text-purple-400' : 'text-[#7E69AB]'
            ),
          }}
        />
      </div>
      
      <div className="lg:col-span-2">
        <Card className={isDark ? 'bg-gray-800 border-gray-700 h-full' : 'h-full'}>
          <CardContent className="p-4 h-full">
            {selectedDate && (
              <>
                <div className="mb-4">
                  <h3 className={`font-medium text-lg ${isDark ? 'text-gray-100' : ''}`}>
                    Eventos para {selectedDate.toLocaleDateString('pt-BR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </h3>
                </div>
                
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-md border cursor-pointer hover:shadow-md transition-shadow ${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2 flex-1">
                            <div className={`p-2 rounded-md ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`}>
                              {getEventIcon(event.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-medium ${isDark ? 'text-gray-100' : ''}`}>
                                {event.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {event.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`${getEventBadgeClass(event.type)} ${isDark ? '!bg-opacity-20 border-opacity-30' : ''}`}
                            >
                              {event.process}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`flex flex-col items-center justify-center h-[calc(100%-40px)] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Calendar className="h-12 w-12 mb-2 opacity-50" />
                    <p className="text-lg font-medium">Nenhum evento para esta data</p>
                    <p className="text-sm">Selecione outra data com eventos marcados</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Detalhes do Evento */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent && getEventIcon(selectedEvent.type)}
              {selectedEvent?.title || 'Detalhes do Evento'}
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre o evento do calendário
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4" />
                  Data
                </div>
                <p className="font-medium">
                  {selectedEvent.date.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  Processo
                </div>
                <p className="font-medium">{selectedEvent.process}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <AlertTriangle className="h-4 w-4" />
                  Descrição
                </div>
                <p className="text-sm text-gray-700">{selectedEvent.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  Tipo
                </div>
                <Badge className={getEventBadgeClass(selectedEvent.type)}>
                  {selectedEvent.type}
                </Badge>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowEventDialog(false)}
            >
              Fechar
            </Button>
            <div className="flex gap-2">
              {selectedEvent && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleViewProcess(selectedEvent.process)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Processo
                  </Button>
                  <Button
                    onClick={() => handleResolve(selectedEvent)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolver
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportCalendar;
