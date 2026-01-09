
import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { useTheme } from '@/hooks/use-theme';
import ProcessForm from '@/components/import/ProcessForm';
import ProcessesHeader from '@/components/import/processes/ProcessesHeader';
import ProcessesFiltersCard from '@/components/import/processes/ProcessesFiltersCard';
import ProcessesListCard from '@/components/import/processes/ProcessesListCard';
import { useProcessesData } from '@/components/import/processes/useProcessesData';
import { ProcessFormValues } from '@/components/import/process-form/FormSchema';
import { Process } from '@/components/import/processes/data/types';
import CSVUploadDialog from '@/components/csv/CSVUploadDialog';

const Processes: React.FC = () => {
  const { theme } = useTheme();
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const {
    processes,
    filteredProcesses,
    currentItems,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    handleSearch,
    handleResetSearch,
    handleNewProcess,
    handleEditProcess,
    handleProcessSubmit,
    handleExportData,
    showProcessForm,
    setShowProcessForm,
    editingProcess
  } = useProcessesData();

  // Manipulador para exibir detalhes do processo
  const handleShowDetails = (process: Process) => {
    // Esta função agora é tratada dentro do ProcessesTable
    // com o novo componente ProcessDetailView
  };

  // Converter string de data para objeto Date quando estiver editando
  const getInitialValues = (): Partial<ProcessFormValues> | undefined => {
    if (!editingProcess) return undefined;
    
    const formattedProcess: Partial<ProcessFormValues> = {
      client: editingProcess.client,
      product: editingProcess.product,
      description: editingProcess.description,
      origin: editingProcess.origin,
      supplier: editingProcess.supplier,
      ncm: editingProcess.ncm,
      invoiceValue: editingProcess.invoiceValue,
      currency: editingProcess.currency,
      importType: editingProcess.importType,
      shippingMethod: editingProcess.shippingMethod,
      referenceNumber: editingProcess.referenceNumber,
      incoterm: editingProcess.incoterm,
      customsBroker: editingProcess.customsBroker
    };
    
    // Converter a string de data para objeto Date se existir
    if (editingProcess.estimatedArrival && typeof editingProcess.estimatedArrival === 'string') {
      const [day, month, year] = editingProcess.estimatedArrival.split('/').map(Number);
      formattedProcess.estimatedArrival = new Date(year, month - 1, day);
    }
    
    return formattedProcess;
  };

  return (
    <PageLayout 
      title="Processos de Importação" 
      description="Gerencie todos os processos de importação da sua empresa"
    >
      <div className="space-y-6">
        <ProcessesHeader
          handleNewProcess={handleNewProcess}
          handleExportData={handleExportData}
          handleCSVUpload={() => setShowCSVUpload(true)}
        />
        
        <ProcessesFiltersCard
          theme={theme}
          onSearch={handleSearch}
          onReset={handleResetSearch}
        />
        
        <ProcessesListCard
          theme={theme}
          currentItems={currentItems}
          handleShowDetails={handleShowDetails}
          handleEditProcess={handleEditProcess}
          filteredProcesses={filteredProcesses}
          processes={processes}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          handleResetSearch={handleResetSearch}
        />
      </div>

      {/* Formulário de processo (novo ou edição) */}
      <ProcessForm
        open={showProcessForm}
        onOpenChange={setShowProcessForm}
        onSubmit={handleProcessSubmit}
        initialValues={getInitialValues()}
      />

      {/* CSV Upload Dialog */}
      <CSVUploadDialog
        open={showCSVUpload}
        onOpenChange={setShowCSVUpload}
        onSuccess={() => {
          // Recarregar processos após importação
          window.location.reload();
        }}
        type="processes"
      />
    </PageLayout>
  );
};

export default Processes;
