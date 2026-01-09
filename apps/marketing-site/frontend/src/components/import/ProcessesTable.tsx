
import React, { useState } from 'react';
import ProcessDetailView from './ProcessDetailView';
import { Table, TableBody } from '@/components/ui/table';
import { Process } from './processes/data/types';
import ProcessTableHeader from './table/ProcessTableHeader';
import ProcessTableRow from './table/ProcessTableRow';
import EmptyTableState from './table/EmptyTableState';
import BulkActionsBar from '@/components/bulk-actions/BulkActionsBar';
import { useToast } from '@/hooks/use-toast';

interface ProcessesTableProps {
  processes: Process[];
  handleShowDetails: (process: Process) => void;
  handleEditProcess?: (process: Process) => void;
}

const ProcessesTable: React.FC<ProcessesTableProps> = ({ 
  processes, 
  handleShowDetails,
  handleEditProcess 
}) => {
  const { toast } = useToast();
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedProcessIds, setSelectedProcessIds] = useState<Set<string>>(new Set());

  const handleViewProcess = (process: Process) => {
    setSelectedProcess(process);
    setShowDetailView(true);
    handleShowDetails(process);
  };

  const handleEditFromDetails = (process: Process) => {
    if (handleEditProcess) {
      handleEditProcess(process);
    }
  };

  const handleSelectProcess = (processId: string, selected: boolean) => {
    setSelectedProcessIds(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(processId);
      } else {
        newSet.delete(processId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProcessIds(new Set(processes.map(p => p.id)));
    } else {
      setSelectedProcessIds(new Set());
    }
  };

  const handleBulkApprove = async () => {
    if (selectedProcessIds.size === 0) return;

    try {
      // Extrair IDs numéricos dos processos selecionados
      const processIds = Array.from(selectedProcessIds)
        .map(id => {
          // Tentar extrair ID numérico (ex: "IMP-2023-001" -> 1)
          const match = id.match(/(\d+)$/);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((id): id is number => id !== null);

      if (processIds.length === 0) {
        toast({
          title: "Erro",
          description: "Não foi possível identificar os processos selecionados.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/import-processes/bulk-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(processIds),
      });

      if (!response.ok) {
        throw new Error('Erro ao aprovar processos');
      }

      const result = await response.json();
      
      toast({
        title: "Sucesso",
        description: `${result.approved} processos aprovados com sucesso.`,
      });

      setSelectedProcessIds(new Set());
      // Recarregar página para atualizar lista
      window.location.reload();
    } catch (error) {
      console.error('Erro ao aprovar processos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar os processos. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = () => {
    if (selectedProcessIds.size === 0) return;
    
    // Implementar exportação
    toast({
      title: "Exportação",
      description: `Exportando ${selectedProcessIds.size} processos...`,
    });
  };

  const allSelected = processes.length > 0 && selectedProcessIds.size === processes.length;

  return (
    <>
      <BulkActionsBar
        selectedCount={selectedProcessIds.size}
        onApprove={handleBulkApprove}
        onExport={handleBulkExport}
        onClearSelection={() => setSelectedProcessIds(new Set())}
      />
      
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm text-left">
            <ProcessTableHeader
              onSelectAll={handleSelectAll}
              allSelected={allSelected}
              hasSelection={selectedProcessIds.size > 0}
            />
            <TableBody>
              {processes.length > 0 ? (
                processes.map((process) => (
                  <ProcessTableRow 
                    key={process.id} 
                    process={process}
                    onViewDetails={handleViewProcess}
                    onEditProcess={handleEditProcess}
                    isSelected={selectedProcessIds.has(process.id)}
                    onSelect={handleSelectProcess}
                  />
                ))
              ) : (
                <EmptyTableState />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <ProcessDetailView 
        process={selectedProcess} 
        open={showDetailView} 
        onOpenChange={setShowDetailView} 
        onEdit={handleEditFromDetails}
      />
    </>
  );
};

export default ProcessesTable;
