
import React, { useState } from 'react';
import { CheckCircle, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TimelineEvent {
  date: string;
  status: string;
  description: string;
  current?: boolean;
}

interface ProcessTimelineProps {
  events: TimelineEvent[];
  onNewAnnotation?: () => void;
  onFollow?: () => void;
  onManage?: () => void;
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ events, onNewAnnotation, onFollow, onManage }) => {
  const { toast } = useToast();
  const [showAnnotationDialog, setShowAnnotationDialog] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState('');
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum evento registrado para este processo
      </div>
    );
  }

  // Find the index of the current event or default to the last one
  const currentIndex = events.findIndex(event => event.current) !== -1 
    ? events.findIndex(event => event.current)
    : events.length - 1;
  
  const handleNewAnnotation = () => {
    if (onNewAnnotation) {
      onNewAnnotation();
    } else {
      setShowAnnotationDialog(true);
    }
  };

  const handleAddAnnotation = () => {
    if (newAnnotation.trim()) {
      toast({
        title: "Anotação adicionada",
        description: "A anotação foi adicionada à linha do tempo.",
      });
      setShowAnnotationDialog(false);
      setNewAnnotation('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Linha do Tempo</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNewAnnotation}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Anotação
          </Button>
          {onFollow && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onFollow}
            >
              Acompanhar
            </Button>
          )}
          {onManage && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onManage}
            >
              Gerenciar
            </Button>
          )}
        </div>
      </div>
      
      <ol className="relative border-l border-gray-200 ml-4">
        {events.map((event, index) => (
        <li key={index} className="mb-6 ml-6">
          <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white
            ${index === currentIndex ? 'bg-blue-100' : index < currentIndex ? 'bg-green-100' : 'bg-gray-100'}`}>
            {index === currentIndex ? (
              <Clock className="w-3 h-3 text-blue-800" />
            ) : index < currentIndex ? (
              <CheckCircle className="w-3 h-3 text-green-500" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            )}
          </span>
          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
            {event.status}
            {index === currentIndex && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                Atual
              </span>
            )}
          </h3>
          <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
            {event.date}
          </time>
          <p className="mb-4 text-base font-normal text-gray-500">
            {event.description}
          </p>
        </li>
      ))}
      </ol>

      {/* Dialog para Nova Anotação */}
      <Dialog open={showAnnotationDialog} onOpenChange={setShowAnnotationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Anotação</DialogTitle>
            <DialogDescription>
              Adicione uma anotação à linha do tempo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="annotation">Anotação</Label>
              <Textarea
                id="annotation"
                placeholder="Digite sua anotação aqui..."
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAnnotationDialog(false);
              setNewAnnotation('');
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAddAnnotation}>
              Adicionar Anotação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessTimeline;
