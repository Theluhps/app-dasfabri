
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import ImportDashboardContent from '@/components/dashboard/ImportDashboardContent';

const ImportDashboardPage = () => {
  return (
    <PageLayout 
      title="Dashboard de Importação" 
      description="Acompanhe os principais indicadores dos processos de importação"
    >
      <ImportDashboardContent />
    </PageLayout>
  );
};

export default ImportDashboardPage;
