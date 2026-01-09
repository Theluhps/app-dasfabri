
import React from 'react';
import AdvancedSearch, { FilterOption } from '@/components/table/AdvancedSearch';

interface ProcessesAdvancedFiltersProps {
  onSearch: (searchTerm: string, filters: any[]) => void;
  onReset: () => void;
}

const ProcessesAdvancedFilters: React.FC<ProcessesAdvancedFiltersProps> = ({ onSearch, onReset }) => {
  
  // Define filter options, expanded based on the Dasfabri platform requirements
  const filterOptions: FilterOption[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      options: [
        { value: 'em-andamento', label: 'Em andamento' },
        { value: 'liberado', label: 'Liberado' },
        { value: 'aguardando', label: 'Aguardando documentos' },
        { value: 'analise', label: 'Em análise' },
        { value: 'documentacao', label: 'Documentação completa' },
      ]
    },
    {
      id: 'origin',
      label: 'Origem',
      type: 'select',
      options: [
        { value: 'china', label: 'China' },
        { value: 'eua', label: 'Estados Unidos' },
        { value: 'alemanha', label: 'Alemanha' },
        { value: 'india', label: 'Índia' },
        { value: 'japao', label: 'Japão' },
        { value: 'coreia-do-sul', label: 'Coreia do Sul' },
        { value: 'taiwan', label: 'Taiwan' },
      ]
    },
    {
      id: 'date',
      label: 'Data Inicial',
      type: 'date',
    },
    {
      id: 'date_end',
      label: 'Data Final',
      type: 'date',
    },
    {
      id: 'category',
      label: 'Categoria',
      type: 'select',
      options: [
        { value: 'maquinas', label: 'Máquinas industriais' },
        { value: 'eletronicos', label: 'Componentes eletrônicos' },
        { value: 'materia-prima', label: 'Matéria-prima' },
        { value: 'quimicos', label: 'Produtos químicos' },
        { value: 'equipamentos', label: 'Equipamentos médicos' },
      ]
    },
    {
      id: 'shipping_status',
      label: 'Status de Embarque',
      type: 'select',
      options: [
        { value: 'aguardando', label: 'Aguardando embarque' },
        { value: 'em-transito', label: 'Em trânsito' },
        { value: 'porto-origem', label: 'No porto de origem' },
        { value: 'porto-destino', label: 'No porto de destino' },
        { value: 'desembaraco', label: 'Em desembaraço' },
        { value: 'entregue', label: 'Entregue' },
      ]
    },
    {
      id: 'priority',
      label: 'Prioridade',
      type: 'select',
      options: [
        { value: 'p1', label: 'P1 - Muito alta' },
        { value: 'p2', label: 'P2 - Alta' },
        { value: 'p3', label: 'P3 - Média' },
        { value: 'p4', label: 'P4 - Baixa' },
        { value: 'p5', label: 'P5 - Muito baixa' },
      ]
    },
    {
      id: 'integration',
      label: 'Integração',
      type: 'select',
      options: [
        { value: 'sap', label: 'SAP' },
        { value: 'totvs', label: 'TOTVS' },
        { value: 'sap-business-one', label: 'SAP Business One' },
        { value: 'receita-federal', label: 'Receita Federal' },
        { value: 'siscomex', label: 'Siscomex' },
      ]
    },
    {
      id: 'tracking_stage',
      label: 'Etapa de Tracking',
      type: 'select',
      options: [
        { value: 'empty-to-shipper', label: 'Empty to shipper' },
        { value: 'gate-in-full', label: 'Gate in full' },
        { value: 'loaded', label: 'Loaded' },
        { value: 'discharged', label: 'Discharged' },
        { value: 'gate-out-full', label: 'Gate out full' },
        { value: 'empty-in-depot', label: 'Empty in depot' },
        { value: 'transhipment-loaded', label: 'Transhipment loaded' },
        { value: 'transhipment-discharged', label: 'Transhipment discharged' },
      ]
    }
  ];

  return (
    <AdvancedSearch
      placeholder="Buscar por ID, cliente, produto, BL, ou tracking..."
      filterOptions={filterOptions}
      onSearch={onSearch}
      onReset={onReset}
    />
  );
};

export default ProcessesAdvancedFilters;
