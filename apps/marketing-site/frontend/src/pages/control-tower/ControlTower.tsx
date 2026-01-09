import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import ControlTowerDashboard from '@/components/control-tower/ControlTowerDashboard';

const ControlTower: React.FC = () => {
  return (
    <PageLayout 
      title="Control Tower" 
      description="Visão única de toda a supply chain"
    >
      <ControlTowerDashboard />
    </PageLayout>
  );
};

export default ControlTower;

