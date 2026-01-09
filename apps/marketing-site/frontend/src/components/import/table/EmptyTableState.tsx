
import React from 'react';

interface EmptyTableStateProps {
  colSpan?: number;
  theme?: string;
}

const EmptyTableState: React.FC<EmptyTableStateProps> = ({ colSpan = 9, theme }) => {
  return (
    <tr>
      <td 
        colSpan={colSpan} 
        className={`px-6 py-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
      >
        Nenhum processo encontrado com os filtros aplicados
      </td>
    </tr>
  );
};

export default EmptyTableState;
