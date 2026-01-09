
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Deadline {
  title: string;
  process: string;
  date: string;
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ deadlines }) => {
  const navigate = useNavigate();
  
  const handleDeadlineClick = (processId: string) => {
    // Extrair o número do processo (ex: IMP-2023-004 -> 004)
    const processNumber = processId.split('-').pop();
    navigate(`/import/process/${processNumber || processId}`);
  };
  
  const handleViewAll = () => {
    navigate('/import/processes?filter=vencimentos');
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Próximos Vencimentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((item, i) => (
            <div 
              key={i} 
              onClick={() => handleDeadlineClick(item.process)}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 transition-colors rounded p-2 -m-2"
            >
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-dasfabri-blue" />
                <div>
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.process}</div>
                </div>
              </div>
              <div className="text-sm font-medium">{item.date}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={handleViewAll}
            className="text-sm text-dasfabri-blue hover:underline flex items-center justify-center w-full"
          >
            Ver todos os vencimentos <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
