
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Process {
  id: string;
  type: string;
  status: string;
  date: string;
}

interface RecentProcessesProps {
  processes: Process[];
}

const RecentProcesses: React.FC<RecentProcessesProps> = ({ processes }) => {
  const navigate = useNavigate();
  
  const handleProcessClick = (processId: string) => {
    // Extrair o número do processo (ex: IMP-2023-004 -> 004)
    const processNumber = processId.split('-').pop();
    navigate(`/import/process/${processNumber || processId}`);
  };
  
  const handleViewAll = () => {
    navigate('/import/processes');
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Processos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {processes.map(process => (
            <div 
              key={process.id} 
              onClick={() => handleProcessClick(process.id)}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 transition-colors rounded p-2 -m-2"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{process.id}</span>
                <span className="text-sm text-gray-500">{process.type}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">{process.status}</span>
                <span className="text-xs text-gray-500">{process.date}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={handleViewAll}
            className="text-sm text-dasfabri-blue hover:underline flex items-center justify-center w-full"
          >
            Ver todos os processos <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentProcesses;
