
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  UserPlus, 
  Plus, 
  X, 
  Save,
  ArrowRight,
  MoveHorizontal,
  CheckSquare
} from 'lucide-react';
import { ApprovalRole } from '@/types/workflow';
import { Switch } from '@/components/ui/switch';

// Create a custom FlowChart icon since it's not in lucide-react
const FlowChart = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="lucide lucide-flow-chart"
  >
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="9" y="15" width="6" height="6" rx="1" />
    <path d="M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" />
  </svg>
);

type WorkflowStep = {
  id: string;
  name: string;
  description: string;
  requiredRole: ApprovalRole;
  hasCondition: boolean;
  conditionField?: string;
  conditionValue?: string;
  conditionOperator?: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
  nextStepId?: string;
};

const CustomWorkflowBuilder: React.FC = () => {
  const { toast } = useToast();
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 'step-1',
      name: 'Criação do Pedido',
      description: 'Início do processo de pedido',
      requiredRole: 'comprador',
      hasCondition: false
    }
  ]);

  const handleAddStep = () => {
    const newStepId = `step-${steps.length + 1}`;
    const newStep: WorkflowStep = {
      id: newStepId,
      name: `Etapa ${steps.length + 1}`,
      description: '',
      requiredRole: 'admin',
      hasCondition: false
    };
    
    // If there's a previous step, update its nextStepId
    if (steps.length > 0) {
      const updatedSteps = [...steps];
      const lastStep = updatedSteps[updatedSteps.length - 1];
      lastStep.nextStepId = newStepId;
      setSteps([...updatedSteps, newStep]);
    } else {
      setSteps([newStep]);
    }
  };

  const handleRemoveStep = (stepId: string) => {
    // Don't allow removing the first step
    if (steps.length <= 1 || steps[0].id === stepId) return;
    
    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;
    
    const updatedSteps = [...steps];
    
    // Update the nextStepId of the previous step to the nextStepId of the removed step
    if (stepIndex > 0) {
      updatedSteps[stepIndex - 1].nextStepId = steps[stepIndex].nextStepId;
    }
    
    // Remove the step
    updatedSteps.splice(stepIndex, 1);
    
    setSteps(updatedSteps);
  };

  const handleUpdateStep = (stepId: string, field: string, value: any) => {
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    );
    setSteps(updatedSteps);
  };

  const handleSaveWorkflow = () => {
    if (!workflowName.trim()) {
      toast({
        title: "Erro na validação",
        description: "O nome do workflow é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    if (steps.length < 2) {
      toast({
        title: "Workflow incompleto",
        description: "O workflow deve ter pelo menos duas etapas",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save the workflow to the backend
    toast({
      title: "Workflow salvo",
      description: `O workflow "${workflowName}" foi salvo com sucesso!`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlowChart />
          Construtor de Workflow
        </CardTitle>
        <CardDescription>
          Crie fluxos de trabalho personalizados para seus processos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Workflow Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Nome do Workflow</Label>
              <Input
                id="workflow-name"
                placeholder="Ex: Processo de Importação"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Descrição</Label>
              <Input
                id="workflow-description"
                placeholder="Ex: Fluxo de aprovação para processos de importação"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Steps Section */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Etapas do Workflow
            </h3>
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <Card key={step.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <Input
                            value={step.name}
                            onChange={(e) => handleUpdateStep(step.id, 'name', e.target.value)}
                            className="h-7 text-sm w-64"
                          />
                        </CardTitle>
                      </div>
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          onClick={() => handleRemoveStep(step.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`step-${step.id}-description`} className="text-xs">Descrição</Label>
                          <Input
                            id={`step-${step.id}-description`}
                            placeholder="Descrição da etapa"
                            value={step.description}
                            onChange={(e) => handleUpdateStep(step.id, 'description', e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`step-${step.id}-role`} className="text-xs">Perfil Responsável</Label>
                          <Select
                            value={step.requiredRole}
                            onValueChange={(value) => handleUpdateStep(step.id, 'requiredRole', value)}
                          >
                            <SelectTrigger id={`step-${step.id}-role`} className="h-8 text-sm">
                              <SelectValue placeholder="Selecione o perfil" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="comprador">Comprador</SelectItem>
                              <SelectItem value="gerente_compras">Gerente de Compras</SelectItem>
                              <SelectItem value="administrativo_importacao">Administrativo Importação</SelectItem>
                              <SelectItem value="analista_importacao">Analista de Importação</SelectItem>
                              <SelectItem value="financeiro">Financeiro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`step-${step.id}-condition`}
                            checked={step.hasCondition}
                            onCheckedChange={(checked) => handleUpdateStep(step.id, 'hasCondition', checked)}
                          />
                          <Label htmlFor={`step-${step.id}-condition`} className="text-xs">
                            Adicionar condição
                          </Label>
                        </div>
                        
                        {step.hasCondition && (
                          <div className="grid grid-cols-3 gap-2">
                            <Select
                              value={step.conditionField || ''}
                              onValueChange={(value) => handleUpdateStep(step.id, 'conditionField', value)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Campo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="value">Valor</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="urgency">Urgência</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Select
                              value={step.conditionOperator || ''}
                              onValueChange={(value) => handleUpdateStep(step.id, 'conditionOperator', value as any)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Operador" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Igual a</SelectItem>
                                <SelectItem value="notEquals">Diferente de</SelectItem>
                                <SelectItem value="greaterThan">Maior que</SelectItem>
                                <SelectItem value="lessThan">Menor que</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Input
                              placeholder="Valor"
                              value={step.conditionValue || ''}
                              onChange={(e) => handleUpdateStep(step.id, 'conditionValue', e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleAddStep}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Etapa
                </Button>
              </div>
            </div>
          </div>
          
          {/* Workflow Preview */}
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-3">Preview do Workflow</h3>
            
            <div className="flex flex-wrap items-center gap-2">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 bg-blue-50 rounded-md p-2 border border-blue-100">
                      <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div className="text-sm">{step.name}</div>
                      {step.hasCondition && (
                        <div className="bg-amber-100 rounded-sm px-1 text-xs text-amber-700">
                          Cond.
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {step.requiredRole.replace('_', ' ')}
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              className="flex items-center gap-2" 
              onClick={handleSaveWorkflow}
            >
              <Save className="h-4 w-4" />
              Salvar Workflow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomWorkflowBuilder;
