
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import ImportCalendar from './ImportCalendar';
import AlertsWidget from './AlertsWidget';
import IntelligentDashboard from './IntelligentDashboard';
import { useTheme } from '@/hooks/use-theme';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab, children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="overview" className="flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4" />
          Visão Geral
        </TabsTrigger>
        <TabsTrigger value="intelligent" className="flex items-center gap-1.5">
          <Zap className="h-4 w-4" />
          Inteligente
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4" />
          Calendário
        </TabsTrigger>
        <TabsTrigger value="alerts" className="flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4" />
          Alertas
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        {children}
      </TabsContent>
      
      <TabsContent value="intelligent" className="space-y-6">
        <IntelligentDashboard />
      </TabsContent>
      
      <TabsContent value="calendar">
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-gray-100' : ''}>
              Calendário de Importações
            </CardTitle>
            <CardDescription className={isDark ? 'text-gray-400' : ''}>
              Datas importantes, chegadas de cargas e prazos de documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImportCalendar />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="alerts">
        <AlertsWidget />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
