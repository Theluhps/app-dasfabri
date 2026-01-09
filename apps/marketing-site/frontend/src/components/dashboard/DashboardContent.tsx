
import React from 'react';
import KPICards from './KPICards';
import ImportDashboard from './ImportDashboard';
import ImportPerformance from './ImportPerformance';
import ProcessDeadlinesTabs from './ProcessDeadlinesTabs';
import DashboardTabs from './DashboardTabs';
import { recentProcesses, upcomingDeadlines } from './mockData';
import DashboardApprovalWidget from '../workflow/DashboardApprovalWidget';
import WorkflowDashboardStats from '../workflow/WorkflowDashboardStats';

const DashboardContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards />

      {/* Aprovações Pendentes e Alertas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <DashboardApprovalWidget />
        <div className="md:col-span-2">
          <WorkflowDashboardStats />
        </div>
      </div>

      {/* Gráficos, Performance e Métricas */}
      <div className="space-y-6">
        <ImportDashboard />
        <ImportPerformance />
      </div>
      
      {/* Tabs para processos recentes e deadlines */}
      <ProcessDeadlinesTabs 
        recentProcesses={recentProcesses} 
        upcomingDeadlines={upcomingDeadlines} 
      />
    </div>
  );
};

export default DashboardContent;
