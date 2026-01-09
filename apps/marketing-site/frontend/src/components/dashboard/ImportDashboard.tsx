
import React from 'react';
import ProcessOriginChart from './charts/ProcessOriginChart';
import ProcessEvolutionChart from './charts/ProcessEvolutionChart';
import ProcessStatusChart from './charts/ProcessStatusChart';
import ProcessProgressCard from './charts/ProcessProgressCard';
import { barData, lineData, pieData, statusData } from './charts/chartData';

const ImportDashboard: React.FC = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
        <ProcessOriginChart data={barData} />
        <ProcessEvolutionChart data={lineData} />
        <ProcessStatusChart data={pieData} />
      </div>

      <ProcessProgressCard data={statusData} />
    </div>
  );
};

export default ImportDashboard;
