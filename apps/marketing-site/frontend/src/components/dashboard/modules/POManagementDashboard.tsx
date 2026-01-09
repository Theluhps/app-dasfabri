
import React from 'react';
import { ModuleDashboardData } from './dashboardData';
import { MODULES } from '@/types/modules';
import ModuleFeatureHighlight from '../ModuleFeatureHighlight';
import StatCardsGrid from '../StatCardsGrid';
import SimplifiedDashboard from '../SimplifiedDashboard';
import { recentProcesses, upcomingDeadlines } from '@/components/dashboard/mockData';
import { useModule } from '@/contexts/ModuleContext';

interface POManagementDashboardProps {
  dashboardData: ModuleDashboardData;
}

const POManagementDashboard: React.FC<POManagementDashboardProps> = ({ dashboardData }) => {
  const { currentModule, moduleColor } = useModule();
  const moduleData = MODULES[currentModule];

  return (
    <div className="w-full">
      <ModuleFeatureHighlight
        title={moduleData.primaryFeature || moduleData.description}
        description={`Acesso às funcionalidades do módulo ${moduleData.name}`}
        actionText={dashboardData.mainAction.text}
        actionPath={dashboardData.mainAction.path}
        moduleColor={moduleColor}
      />
      <StatCardsGrid cards={dashboardData.statCards} />
      <SimplifiedDashboard processes={recentProcesses} deadlines={upcomingDeadlines} />
    </div>
  );
};

export default POManagementDashboard;
