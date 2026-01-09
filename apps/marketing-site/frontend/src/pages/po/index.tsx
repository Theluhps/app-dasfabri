
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Orders from './Orders';
import Suppliers from './Suppliers';
import Reports from './Reports';

const PO = () => {
  return (
    <Routes>
      <Route index element={<Orders />} />
      <Route path="orders" element={<Orders />} />
      <Route path="suppliers" element={<Suppliers />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
};

export default PO;
