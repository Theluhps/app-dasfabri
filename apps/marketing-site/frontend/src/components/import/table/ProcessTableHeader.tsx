
import React from 'react';
import { TableHead } from '@/components/ui/table';

interface ProcessTableHeaderProps {
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  hasSelection?: boolean;
}

const ProcessTableHeader: React.FC<ProcessTableHeaderProps> = ({
  onSelectAll,
  allSelected = false,
  hasSelection = false
}) => {
  return (
    <thead className="text-xs uppercase bg-gray-50 text-gray-700">
      <tr>
        <TableHead className="px-6 py-3 w-12">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => onSelectAll?.(e.target.checked)}
            className="rounded border-gray-300"
            title="Selecionar todos"
          />
        </TableHead>
        <TableHead className="px-6 py-3">ID</TableHead>
        <TableHead className="px-6 py-3">Cliente</TableHead>
        <TableHead className="px-6 py-3">Produto</TableHead>
        <TableHead className="px-6 py-3">Fornecedor</TableHead>
        <TableHead className="px-6 py-3">Origem</TableHead>
        <TableHead className="px-6 py-3">Status</TableHead>
        <TableHead className="px-6 py-3">Data</TableHead>
        <TableHead className="px-6 py-3">Valor</TableHead>
        <TableHead className="px-6 py-3 text-right">Ações</TableHead>
      </tr>
    </thead>
  );
};

export default ProcessTableHeader;
