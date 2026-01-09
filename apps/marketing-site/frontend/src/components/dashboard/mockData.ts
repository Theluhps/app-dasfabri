
// Mock data for dashboard components
export const recentProcesses = [
  { id: 'IMP-2023-001', type: 'Importação Regular', status: 'Em andamento', date: '12/05/2025' },
  { id: 'IMP-2023-002', type: 'Drawback', status: 'Liberado', date: '10/05/2025' },
  { id: 'IMP-2023-003', type: 'Importação Temporária', status: 'Pendente', date: '08/05/2025' },
  { id: 'IMP-2023-004', type: 'Importação Regular', status: 'Em análise', date: '05/05/2025' },
  { id: 'IMP-2023-005', type: 'Reimportação', status: 'Documentação Completa', date: '03/05/2025' }
];

export const upcomingDeadlines = [
  { title: 'Entrega de BL Original', process: 'IMP-2023-001', date: '15/05/2025' },
  { title: 'Pagamento de Impostos', process: 'IMP-2023-003', date: '17/05/2025' },
  { title: 'Vistoria Anvisa', process: 'IMP-2023-002', date: '20/05/2025' },
  { title: 'Deadline Documentação', process: 'IMP-2023-004', date: '22/05/2025' },
  { title: 'Validade da LI', process: 'IMP-2023-005', date: '25/05/2025' }
];

export interface Process {
  id: string;
  type: string;
  status: string;
  date: string;
}

export interface Deadline {
  title: string;
  process: string;
  date: string;
}
