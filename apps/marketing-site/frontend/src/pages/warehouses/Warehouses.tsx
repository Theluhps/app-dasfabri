import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import WarehouseManagement from '@/components/warehouses/WarehouseManagement';

const Warehouses: React.FC = () => {
  return (
    <PageLayout 
      title="Armazéns" 
      description="Gestão de armazéns e estoque"
    >
      <WarehouseManagement />
    </PageLayout>
  );
};

export default Warehouses;

