
import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import ExportVolumeChart from './export/ExportVolumeChart';
import ExportDestinationsPieChart from './export/ExportDestinationsPieChart';
import ExportPerformanceBarChart from './export/ExportPerformanceBarChart';
import ExportCategoryRadarChart from './export/ExportCategoryRadarChart';

const ExportDashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ExportVolumeChart />
        <ExportDestinationsPieChart />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ExportPerformanceBarChart />
        <ExportCategoryRadarChart />
      </div>
    </div>
  );
};

export default ExportDashboard;
