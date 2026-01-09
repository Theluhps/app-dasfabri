
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Filter } from 'lucide-react';
import RecentProcesses from './RecentProcesses';
import UpcomingDeadlines from './UpcomingDeadlines';
import { useTheme } from '@/hooks/use-theme';

interface Process {
  id: string;
  type: string;
  status: string;
  date: string;
}

interface Deadline {
  title: string;
  process: string;
  date: string;
}

interface ProcessDeadlinesTabsProps {
  recentProcesses: Process[];
  upcomingDeadlines: Deadline[];
}

const ProcessDeadlinesTabs: React.FC<ProcessDeadlinesTabsProps> = ({ 
  recentProcesses, 
  upcomingDeadlines 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tabs defaultValue="recent" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="recent">
            <Calendar className="mr-2 h-4 w-4" />
            Processos Recentes
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Clock className="mr-2 h-4 w-4" />
            Próximos Vencimentos
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Últimos 30 dias
          </Badge>
        </div>
      </div>
      
      <TabsContent value="recent">
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className={isDark ? 'text-gray-100' : ''}>
              Processos Recentes
            </CardTitle>
            <CardDescription className={isDark ? 'text-gray-400' : ''}>
              Os últimos processos criados ou atualizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentProcesses processes={recentProcesses} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="upcoming">
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className={isDark ? 'text-gray-100' : ''}>
              Próximos Vencimentos
            </CardTitle>
            <CardDescription className={isDark ? 'text-gray-400' : ''}>
              Processos com prazos se aproximando
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingDeadlines deadlines={upcomingDeadlines} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProcessDeadlinesTabs;
