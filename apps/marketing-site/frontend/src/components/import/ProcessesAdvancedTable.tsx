
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Process } from '@/components/import/processes/data/types';
import ProcessTableRow from './table/ProcessTableRow';
import EmptyTableState from './table/EmptyTableState';

interface ProcessesAdvancedTableProps {
  processes: Process[];
  theme?: string;
  onEditProcess?: (process: Process) => void;
}

const ProcessesAdvancedTable: React.FC<ProcessesAdvancedTableProps> = ({ processes, theme, onEditProcess }) => {
  return (
    <div className="w-full border rounded-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
            <TableRow className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}>
              <TableHead className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>ID</TableHead>
              <TableHead className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Cliente</TableHead>
              <TableHead className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Produto</TableHead>
              <TableHead className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fornecedor</TableHead>
              <TableHead className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Origem</TableHead>
              <TableHead className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Status</TableHead>
              <TableHead className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Data</TableHead>
              <TableHead className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Valor</TableHead>
              <TableHead className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.length > 0 ? (
              processes.map((process) => (
                <ProcessTableRow 
                  key={process.id} 
                  process={process} 
                  theme={theme} 
                  onEdit={onEditProcess}
                />
              ))
            ) : (
              <EmptyTableState colSpan={9} theme={theme} />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProcessesAdvancedTable;
