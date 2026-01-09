
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OperationsDashboard from './OperationsDashboard';

const Operations = () => {
  return (
    <Routes>
      <Route index element={<OperationsDashboard />} />
    </Routes>
  );
};

export default Operations;
