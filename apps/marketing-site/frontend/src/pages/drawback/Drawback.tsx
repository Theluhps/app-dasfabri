import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import DrawbackManagement from '@/components/drawback/DrawbackManagement';

const Drawback: React.FC = () => {
  return (
    <PageLayout 
      title="Drawback" 
      description="Gestão de atos de drawback e créditos"
    >
      <DrawbackManagement />
    </PageLayout>
  );
};

export default Drawback;

