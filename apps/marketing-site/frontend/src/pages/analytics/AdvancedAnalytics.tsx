
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrossModuleAnalytics from '@/components/analytics/CrossModuleAnalytics';
import CustomReportGenerator from '@/components/reports/CustomReportGenerator';
import CustomWorkflowBuilder from '@/components/workflow/CustomWorkflowBuilder';
import { BarChart3, FileText } from 'lucide-react';

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

const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('analytics');
  
  return (
    <PageLayout
      title="Analytics Avançados"
      description="Visualize análises avançadas, gere relatórios personalizados e crie novos workflows"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="analytics" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            Análises Integradas
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-1.5">
            <FlowChart />
            Workflows
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-6">
          <CrossModuleAnalytics />
          
          {/* We could add more analytics components here */}
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <CustomReportGenerator />
          
          {/* We could add more reporting components here */}
        </TabsContent>
        
        <TabsContent value="workflows" className="space-y-6">
          <CustomWorkflowBuilder />
          
          {/* We could add more workflow components here */}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default AdvancedAnalytics;
