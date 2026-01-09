
// Mock chart data for import dashboard

// Line chart data for process evolution
export const lineData = [
  { month: 'Jan', processos: 4 },
  { month: 'Feb', processos: 3 },
  { month: 'Mar', processos: 5 },
  { month: 'Apr', processos: 7 },
  { month: 'May', processos: 6 },
];

// Bar chart data for processes by origin
export const barData = [
  { name: 'China', value: 12 },
  { name: 'EUA', value: 8 },
  { name: 'Alemanha', value: 6 },
  { name: 'Japão', value: 4 },
  { name: 'Coreia', value: 3 },
];

// Pie chart data for process status
export const pieData = [
  { name: 'Em andamento', value: 15, color: '#1E40AF' },
  { name: 'Concluído', value: 8, color: '#10B981' },
  { name: 'Pendente', value: 5, color: '#F59E0B' },
  { name: 'Atrasado', value: 2, color: '#EF4444' },
];

// Progress data for process stages
export const statusData = [
  { id: 1, name: 'Processo em análise', porcentagem: 15 },
  { id: 2, name: 'Licença de importação', porcentagem: 35 },
  { id: 3, name: 'Desembaraço aduaneiro', porcentagem: 50 },
  { id: 4, name: 'Em trânsito', porcentagem: 78 },
  { id: 5, name: 'Entrega final', porcentagem: 23 },
];
