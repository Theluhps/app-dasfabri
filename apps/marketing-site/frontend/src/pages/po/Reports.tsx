
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import ReportsContent from '@/components/po/ReportsContent';

const Reports = () => {
  return (
    <PageLayout 
      title="Relatórios de Pedidos" 
      description="Visualize relatórios de desempenho dos seus pedidos internacionais"
    >
      <ReportsContent />
    </PageLayout>
  );
};

export default Reports;
