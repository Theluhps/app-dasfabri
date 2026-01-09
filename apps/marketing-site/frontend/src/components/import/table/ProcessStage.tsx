
import React from 'react';
import { Process } from '@/pages/import/ProcessesAdvanced';

interface ProcessStageProps {
  process: Process;
}

const ProcessStage: React.FC<ProcessStageProps> = ({ process }) => {
  const stage = getProcessStage(process);
  const dotColor = getStageDotColor(stage);
  
  return (
    <div className="flex items-center space-x-1.5">
      <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`}></div>
      <span className="text-xs">{stage}</span>
    </div>
  );
};

// Helper function to determine the stage of the process
const getProcessStage = (process: Process): string => {
  switch (process.status) {
    case 'Em andamento': 
      return 'Transporte Internacional';
    case 'Liberado': 
      return 'Entrega';
    case 'Aguardando documentos': 
      return 'Documentação';
    case 'Em análise': 
      return 'Alfândega';
    case 'Documentação completa': 
      return 'Câmbio';
    default: 
      return 'Pedido';
  }
};

// Helper function to determine the color of the stage dot
const getStageDotColor = (stage: string): string => {
  const stages: Record<string, string> = {
    'Transporte Internacional': 'bg-blue-500',
    'Entrega': 'bg-green-500',
    'Documentação': 'bg-yellow-500',
    'Alfândega': 'bg-purple-500',
    'Câmbio': 'bg-emerald-500',
    'Pedido': 'bg-gray-500'
  };
  
  return stages[stage] || 'bg-gray-500';
};

export default ProcessStage;
