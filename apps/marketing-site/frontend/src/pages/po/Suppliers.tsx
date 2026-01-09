
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import SuppliersContent from '@/components/po/SuppliersContent';

const Suppliers = () => {
  return (
    <PageLayout 
      title="Fornecedores" 
      description="Gerencie seus fornecedores internacionais"
    >
      <SuppliersContent />
    </PageLayout>
  );
};

export default Suppliers;
