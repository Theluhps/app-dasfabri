
import React from 'react';
import { ModuleDashboardData } from './dashboardData';
import { MODULES } from '@/types/modules';
import ModuleFeatureHighlight from '../ModuleFeatureHighlight';
import StatCardsGrid from '../StatCardsGrid';
import ImportDashboardContent from '@/components/dashboard/ImportDashboardContent';
import { useModule } from '@/contexts/ModuleContext';

interface ImportFullDashboardProps {
  dashboardData: ModuleDashboardData;
}

const ImportFullDashboard: React.FC<ImportFullDashboardProps> = ({ dashboardData }) => {
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
      <ImportDashboardContent />
    </div>
  );
};

export default ImportFullDashboard;
