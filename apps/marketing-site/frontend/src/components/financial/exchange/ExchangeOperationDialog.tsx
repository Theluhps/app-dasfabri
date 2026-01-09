
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currency';
import { MockExchangeOperation } from './mockData';
import { ExchangeOperation } from '@/hooks/use-exchange-operations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProcessWorkflowStatus from '@/components/workflow/ProcessWorkflowStatus';
import ApprovalHistory from '@/components/workflow/ApprovalHistory';
import { useCurrentUser } from '@/hooks/use-current-user';
import StartWorkflowDialog from '@/components/workflow/StartWorkflowDialog';
import { useWorkflow } from '@/hooks/use-workflow';

type Operation = MockExchangeOperation | ExchangeOperation;

interface ExchangeOperationDialogProps {
  operation: Operation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateOperation?: (operation: Operation) => void;
}

const ExchangeOperationDialog: React.FC<ExchangeOperationDialogProps> = ({ 
  operation, 
  open, 
  onOpenChange, 
  onUpdateOperation 
}) => {
  const { currentUser } = useCurrentUser();
  const { getWorkflowForProcess } = useWorkflow();
  const [activeTab, setActiveTab] = useState('details');
  const [showStartWorkflow, setShowStartWorkflow] = useState(false);

  if (!operation) return null;

  const hasWorkflow = !!getWorkflowForProcess(operation.id);

  const handleStartWorkflow = () => {
    setShowStartWorkflow(true);
  };

  // Manipulando de acordo com o tipo de operação
  // O tipo MockExchangeOperation tem uma propriedade date, mas ExchangeOperation não
  const operationDate = 'date' in operation ? operation.date : operation.createdAt.toLocaleDateString('pt-BR');

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Operação de Câmbio {operation.id}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="approval">Aprovações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Informações Gerais</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-500">ID do Processo:</div>
                    <div>{operation.processId}</div>
                    <div className="text-gray-500">Data:</div>
                    <div>{operationDate}</div>
                    <div className="text-gray-500">Instituição:</div>
                    <div>{operation.financialInstitution}</div>
                    <div className="text-gray-500">Status:</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        operation.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : operation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {operation.status === 'completed' 
                          ? 'Concluído' 
                          : operation.status === 'pending'
                            ? 'Pendente'
                            : 'Cancelado'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Valores da Operação</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-500">Valor:</div>
                    <div>{formatCurrency(operation.amount, operation.sourceCurrency)}</div>
                    <div className="text-gray-500">Moeda Origem:</div>
                    <div>{operation.sourceCurrency}</div>
                    <div className="text-gray-500">Moeda Destino:</div>
                    <div>{operation.targetCurrency}</div>
                    <div className="text-gray-500">Taxa de Câmbio:</div>
                    <div>{operation.exchangeRate}</div>
                  </div>
                </div>
              </div>
              
              {operation.description && (
                <div className="mt-2">
                  <h3 className="font-medium text-gray-800 mb-1">Descrição</h3>
                  <p className="text-sm text-gray-600 py-2 px-3 bg-gray-50 rounded-md">
                    {operation.description}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Datas</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-500">Criação:</div>
                    <div>{operation.createdAt.toLocaleDateString('pt-BR')}</div>
                    <div className="text-gray-500">Execução:</div>
                    <div>{operation.executionDate.toLocaleDateString('pt-BR')}</div>
                    {operation.settlementDate && (
                      <>
                        <div className="text-gray-500">Liquidação:</div>
                        <div>{operation.settlementDate.toLocaleDateString('pt-BR')}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="workflow" className="py-4">
              {hasWorkflow ? (
                <ProcessWorkflowStatus 
                  processId={operation.id} 
                  userRole={currentUser.role} 
                  userId={currentUser.id}
                />
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <h3 className="text-lg font-medium mb-2">Nenhum workflow iniciado</h3>
                  <p className="text-gray-500 mb-6">Inicie um workflow para esta operação de câmbio.</p>
                  <Button onClick={handleStartWorkflow}>Iniciar Workflow</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="approval" className="py-4">
              <ApprovalHistory processId={operation.id} />
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="gap-2">
            {onUpdateOperation && (
              <Button 
                variant="outline" 
                onClick={() => onUpdateOperation(operation)}
              >
                Editar
              </Button>
            )}
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <StartWorkflowDialog 
        processId={operation.id}
        open={showStartWorkflow}
        onOpenChange={setShowStartWorkflow}
      />
    </>
  );
};

export default ExchangeOperationDialog;
