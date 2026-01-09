
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import FinancialDashboard from '@/components/dashboard/FinancialDashboard';

const FinancialDashboardPage = () => {
  return (
    <PageLayout 
      title="Dashboard Financeiro" 
      description="Acompanhe os principais indicadores financeiros"
    >
      <FinancialDashboard />
    </PageLayout>
  );
};

export default FinancialDashboardPage;
