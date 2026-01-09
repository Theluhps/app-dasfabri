import React, { useMemo, useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import ProcessesAdvancedContent from '@/components/import/ProcessesAdvancedContent';
import ProcessForm from '@/components/import/ProcessForm';
import { useTheme } from '@/hooks/use-theme';
import { useProcessesData } from '@/hooks/useProcessesData';
import { useToast } from '@/hooks/use-toast';

// Process interface
export interface Process {
  id: string;
  client: string;
  product: string;
  origin: string;
  status: string;
  date: string;
  value: string;
  category: string;
  // Additional properties based on the Dasfabri platform requirements
  tracking_number?: string;
  bl_number?: string;
  shipping_status?: string;
  priority?: string;
  integration?: string;
  tracking_stage?: string;
  estimatedArrival?: string;
  supplier?: string;
  referenceNumber?: string;
}

const ProcessesAdvanced: React.FC = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  
  // Dados simulados - agora são memorizados para evitar recriações desnecessárias
  const processes = useMemo(() => [
    { id: 'IMP-2023-001', client: 'Empresa ABC Ltda', product: 'Máquinas industriais', origin: 'China', status: 'Em andamento', date: '15/05/2025', value: 'USD 120,000.00', category: 'maquinas', tracking_number: 'TRK00123456789', bl_number: 'BL123456', shipping_status: 'em-transito', priority: 'p1', integration: 'sap', tracking_stage: 'loaded' },
    { id: 'IMP-2023-002', client: 'Distribuidora XYZ', product: 'Componentes eletrônicos', origin: 'Alemanha', status: 'Liberado', date: '10/05/2025', value: 'EUR 85,000.00', category: 'eletronicos', tracking_number: 'TRK00234567890', bl_number: 'BL234567', shipping_status: 'porto-destino', priority: 'p2', integration: 'totvs', tracking_stage: 'discharged' },
    { id: 'IMP-2023-003', client: 'Indústria Nacional', product: 'Matéria-prima', origin: 'Estados Unidos', status: 'Aguardando documentos', date: '05/05/2025', value: 'USD 65,000.00', category: 'materia-prima', tracking_number: 'TRK00345678901', bl_number: 'BL345678', shipping_status: 'aguardando', priority: 'p3', integration: 'sap-business-one', tracking_stage: 'empty-to-shipper' },
    { id: 'IMP-2023-004', client: 'Comércio Global', product: 'Produtos químicos', origin: 'Índia', status: 'Em análise', date: '01/05/2025', value: 'USD 45,000.00', category: 'quimicos', tracking_number: 'TRK00456789012', bl_number: 'BL456789', shipping_status: 'em-transito', priority: 'p4', integration: 'receita-federal', tracking_stage: 'gate-in-full' },
    { id: 'IMP-2023-005', client: 'Tecnologia Avançada', product: 'Equipamentos médicos', origin: 'Japão', status: 'Documentação completa', date: '28/04/2025', value: 'JPY 8,500,000.00', category: 'equipamentos', tracking_number: 'TRK00567890123', bl_number: 'BL567890', shipping_status: 'desembaraco', priority: 'p2', integration: 'siscomex', tracking_stage: 'loaded' },
    { id: 'IMP-2023-006', client: 'Empresa DEF S.A.', product: 'Máquinas industriais', origin: 'China', status: 'Em andamento', date: '25/04/2025', value: 'USD 95,000.00', category: 'maquinas', tracking_number: 'TRK00678901234', bl_number: 'BL678901', shipping_status: 'porto-origem', priority: 'p1', integration: 'sap', tracking_stage: 'empty-to-shipper' },
    { id: 'IMP-2023-007', client: 'MicroTech', product: 'Componentes eletrônicos', origin: 'Taiwan', status: 'Liberado', date: '22/04/2025', value: 'USD 42,000.00', category: 'eletronicos', tracking_number: 'TRK00789012345', bl_number: 'BL789012', shipping_status: 'em-transito', priority: 'p3', integration: 'totvs', tracking_stage: 'transhipment-loaded' },
    { id: 'IMP-2023-008', client: 'FarmaBrasil', product: 'Produtos químicos', origin: 'Alemanha', status: 'Aguardando documentos', date: '20/04/2025', value: 'EUR 75,000.00', category: 'quimicos', tracking_number: 'TRK00890123456', bl_number: 'BL890123', shipping_status: 'porto-destino', priority: 'p2', integration: 'receita-federal', tracking_stage: 'discharged' },
    { id: 'IMP-2023-009', client: 'Auto Parts', product: 'Peças automotivas', origin: 'Japão', status: 'Em análise', date: '18/04/2025', value: 'JPY 5,200,000.00', category: 'maquinas', tracking_number: 'TRK00901234567', bl_number: 'BL901234', shipping_status: 'desembaraco', priority: 'p4', integration: 'siscomex', tracking_stage: 'gate-out-full' },
    { id: 'IMP-2023-010', client: 'Construtora Horizonte', product: 'Matéria-prima', origin: 'Estados Unidos', status: 'Documentação completa', date: '15/04/2025', value: 'USD 130,000.00', category: 'materia-prima', tracking_number: 'TRK00012345678', bl_number: 'BL012345', shipping_status: 'entregue', priority: 'p5', integration: 'sap-business-one', tracking_stage: 'empty-in-depot' },
    { id: 'IMP-2023-011', client: 'Metalúrgica Sul', product: 'Aço especial', origin: 'Coreia do Sul', status: 'Em andamento', date: '12/04/2025', value: 'USD 110,000.00', category: 'materia-prima', tracking_number: 'TRK00123456789', bl_number: 'BL123456', shipping_status: 'em-transito', priority: 'p1', integration: 'sap', tracking_stage: 'loaded' },
    { id: 'IMP-2023-012', client: 'RioTech', product: 'Equipamentos eletrônicos', origin: 'China', status: 'Liberado', date: '10/04/2025', value: 'USD 67,000.00', category: 'eletronicos', tracking_number: 'TRK00234567890', bl_number: 'BL234567', shipping_status: 'entregue', priority: 'p3', integration: 'totvs', tracking_stage: 'empty-in-depot' },
    { id: 'IMP-2023-013', client: 'Hospital São Lucas', product: 'Equipamentos médicos', origin: 'Alemanha', status: 'Aguardando documentos', date: '08/04/2025', value: 'EUR 92,000.00', category: 'equipamentos', tracking_number: 'TRK00345678901', bl_number: 'BL345678', shipping_status: 'aguardando', priority: 'p2', integration: 'sap-business-one', tracking_stage: 'empty-to-shipper' },
    { id: 'IMP-2023-014', client: 'Indústria Têxtil', product: 'Matéria-prima', origin: 'Índia', status: 'Em análise', date: '05/04/2025', value: 'USD 48,000.00', category: 'materia-prima', tracking_number: 'TRK00456789012', bl_number: 'BL456789', shipping_status: 'em-transito', priority: 'p4', integration: 'receita-federal', tracking_stage: 'gate-in-full' },
    { id: 'IMP-2023-015', client: 'Tecnologia Avançada', product: 'Microprocessadores', origin: 'Taiwan', status: 'Documentação completa', date: '02/04/2025', value: 'USD 155,000.00', category: 'eletronicos', tracking_number: 'TRK00567890123', bl_number: 'BL567890', shipping_status: 'desembaraco', priority: 'p1', integration: 'siscomex', tracking_stage: 'discharged' },
  ], []);
  
  // Use our refactored hook
  const {
    filteredProcesses,
    isLoading,
    isSearching,
    isPending,
    currentPage,
    setCurrentPage,
    handleSearch,
    handleResetSearch,
    allProcesses
  } = useProcessesData({ initialData: processes });
  
  // Pagination - agora calculada de forma memoizada
  const itemsPerPage = 10;
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProcesses.slice(startIndex, endIndex);
  }, [filteredProcesses, currentPage, itemsPerPage]);

  // Handle new process
  const handleNewProcess = React.useCallback(() => {
    setEditingProcess(null);
    setShowProcessForm(true);
  }, []);

  // Handle edit process
  const handleEditProcess = React.useCallback((process: Process) => {
    setEditingProcess(process);
    setShowProcessForm(true);
  }, []);

  // Handle form submit
  const handleProcessSubmit = React.useCallback((formData: any) => {
    if (editingProcess) {
      toast({
        title: "Processo atualizado",
        description: `O processo ${editingProcess.id} foi atualizado com sucesso.`,
      });
    } else {
      toast({
        title: "Processo criado",
        description: `Novo processo criado para ${formData.client}.`,
      });
    }
    setShowProcessForm(false);
    setEditingProcess(null);
  }, [editingProcess, toast]);

  return (
    <PageLayout 
      title="Processos de Importação" 
      description="Gerencie todos os processos de importação da sua empresa"
    >
      <ProcessesAdvancedContent
        theme={theme}
        filteredProcesses={filteredProcesses}
        allProcesses={allProcesses}
        currentItems={currentItems}
        isLoading={isLoading}
        isSearching={isSearching}
        isPending={isPending}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        handleSearch={handleSearch}
        handleResetSearch={handleResetSearch}
        handleNewProcess={handleNewProcess}
        handleEditProcess={handleEditProcess}
      />
      
      <ProcessForm
        open={showProcessForm}
        onOpenChange={setShowProcessForm}
        onSubmit={handleProcessSubmit}
        initialValues={editingProcess ? {
          client: editingProcess.client,
          product: editingProcess.product,
          origin: editingProcess.origin,
          currency: editingProcess.value?.split(' ')[0] || 'USD',
          invoiceValue: editingProcess.value?.replace(/[^\d.,]/g, '') || '',
        } : undefined}
      />
    </PageLayout>
  );
};

export default ProcessesAdvanced;
