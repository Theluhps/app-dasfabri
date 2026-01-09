
import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, BarChart3, FileText } from 'lucide-react';
import ModuleDashboard from '@/components/dashboard/ModuleDashboard';
import CrossModuleAnalytics from '@/components/analytics/CrossModuleAnalytics';
import CustomReportGenerator from '@/components/reports/CustomReportGenerator';
import { useModule } from '@/contexts/ModuleContext';
import { MODULES } from '@/types/modules';

const DashboardAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentModule } = useModule();
  
  // Obter informações do módulo atual
  const moduleInfo = MODULES[currentModule];
  
  return (
    <PageLayout
      title={`Dashboard & Análises${moduleInfo ? ` - ${moduleInfo.name}` : ''}`}
      description="Visualize dados operacionais, análises avançadas e gere relatórios personalizados"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-[500px]">
          <TabsTrigger value="dashboard" className="flex items-center gap-1.5">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard {moduleInfo?.name.split(' ')[0] || 'Operacional'}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            Análises Integradas
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6 animate-fadeIn transition-opacity duration-300 ease-in-out">
          <ModuleDashboard />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 animate-fadeIn transition-opacity duration-300 ease-in-out">
          <CrossModuleAnalytics />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6 animate-fadeIn transition-opacity duration-300 ease-in-out">
          <CustomReportGenerator />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default DashboardAnalytics;
