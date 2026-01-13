
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ImportDashboard from './ImportDashboard';
import ImportPerformance from './ImportPerformance';
import ProcessDeadlinesTabs from './ProcessDeadlinesTabs';
import DashboardTabs from './DashboardTabs';
import { recentProcesses, upcomingDeadlines } from './mockData';

const ImportDashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6 w-full">
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab}>
        {/* Gráficos */}
        <ImportDashboard />

        {/* Performance e Métricas */}
        <ImportPerformance />
        
        {/* Tabs para processos recentes e deadlines */}
        <ProcessDeadlinesTabs 
          recentProcesses={recentProcesses} 
          upcomingDeadlines={upcomingDeadlines} 
        />
      </DashboardTabs>
    </div>
  );
};

export default ImportDashboardContent;
