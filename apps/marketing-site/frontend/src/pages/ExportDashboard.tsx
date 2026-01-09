
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import ExportDashboard from '@/components/dashboard/ExportDashboard';

const ExportDashboardPage = () => {
  return (
    <PageLayout 
      title="Dashboard de Exportação" 
      description="Acompanhe os principais indicadores dos processos de exportação"
    >
      <ExportDashboard />
    </PageLayout>
  );
};

export default ExportDashboardPage;
