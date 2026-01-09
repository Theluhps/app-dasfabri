
import React from 'react';
import RecentProcesses from '@/components/dashboard/RecentProcesses';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import { Process, Deadline } from '@/components/dashboard/mockData';

interface SimplifiedDashboardProps {
  processes: Process[];
  deadlines: Deadline[];
}

const SimplifiedDashboard: React.FC<SimplifiedDashboardProps> = ({ processes, deadlines }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <RecentProcesses processes={processes} />
      <UpcomingDeadlines deadlines={deadlines} />
    </div>
  );
};

export default SimplifiedDashboard;
