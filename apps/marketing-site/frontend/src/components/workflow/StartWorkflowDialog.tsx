
import React, { useState } from 'react';
import { useWorkflow } from '@/hooks/use-workflow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Workflow } from 'lucide-react';

interface StartWorkflowDialogProps {
  processId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StartWorkflowDialog: React.FC<StartWorkflowDialogProps> = ({ 
  processId, 
  open, 
  onOpenChange 
}) => {
  const { workflows, startWorkflow } = useWorkflow();
  const { currentUser } = useCurrentUser();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  
  const handleStartWorkflow = () => {
    if (selectedWorkflowId) {
      startWorkflow(processId, selectedWorkflowId);
      onOpenChange(false);
    }
  };
  
  const availableWorkflows = workflows.filter(w => {
    const initialStep = w.steps.find(s => s.id === w.initialStepId);
    
    // Exibir apenas workflows compatíveis com o papel do usuário
    return initialStep?.requiredRole === currentUser.role;
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Iniciar Workflow para Processo {processId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o Tipo de Workflow:
          </label>
          
          {availableWorkflows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Não há workflows disponíveis para seu papel atual.</p>
              <p className="text-sm mt-2">Seu papel: {currentUser.role}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {availableWorkflows.map(workflow => (
                <div 
                  key={workflow.id}
                  className={`border p-4 rounded-md cursor-pointer transition-colors ${
                    selectedWorkflowId === workflow.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedWorkflowId(workflow.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{workflow.name}</h3>
                      <p className="text-sm text-gray-500">{workflow.description}</p>
                    </div>
                    <div className="h-5 w-5 rounded-full border flex items-center justify-center">
                      {selectedWorkflowId === workflow.id && (
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleStartWorkflow}
            disabled={!selectedWorkflowId}
          >
            Iniciar Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartWorkflowDialog;
