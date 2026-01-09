
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import OrdersContent from '@/components/po/OrdersContent';

const Orders = () => {
  return (
    <PageLayout 
      title="Pedidos de Compra" 
      description="Gerencie seus pedidos de compra internacionais"
    >
      <OrdersContent />
    </PageLayout>
  );
};

export default Orders;
