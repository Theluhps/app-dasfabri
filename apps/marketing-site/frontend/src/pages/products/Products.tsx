import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import ProductsManagement from '@/components/products/ProductsManagement';

const Products: React.FC = () => {
  return (
    <PageLayout 
      title="Produtos" 
      description="Catálogo de produtos e categorias"
    >
      <ProductsManagement />
    </PageLayout>
  );
};

export default Products;

