
// Mock exchange operations interface
export interface MockExchangeOperation {
  id: string;
  date: string;
  processId: string;
  operationType: string;
  invoiceId: string;
  financialInstitution: string;
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: string;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: Date;
  executionDate: Date;
  settlementDate?: Date;
  description?: string;
}

// Mock operations data
export const exchangeOperations: MockExchangeOperation[] = [
  {
    id: 'OP-001',
    date: '10/05/2025',
    processId: 'IMP-2023-001',
    operationType: 'payment',
    invoiceId: 'INV-12345',
    financialInstitution: 'Banco do Brasil',
    amount: '25000',
    sourceCurrency: 'USD',
    targetCurrency: 'BRL',
    exchangeRate: '5.02',
    status: 'completed',
    createdAt: new Date('2025-05-10'),
    executionDate: new Date('2025-05-10'),
  },
  {
    id: 'OP-002',
    date: '08/05/2025',
    processId: 'IMP-2023-002',
    operationType: 'payment',
    invoiceId: 'INV-67890',
    financialInstitution: 'Itaú',
    amount: '18500',
    sourceCurrency: 'EUR',
    targetCurrency: 'BRL',
    exchangeRate: '5.45',
    status: 'pending',
    createdAt: new Date('2025-05-08'),
    executionDate: new Date('2025-05-08'),
  },
  {
    id: 'OP-003',
    date: '05/05/2025',
    processId: 'EXP-2023-001',
    operationType: 'receipt',
    invoiceId: 'BR-INV-001',
    financialInstitution: 'Santander',
    amount: '32000',
    sourceCurrency: 'USD',
    targetCurrency: 'BRL',
    exchangeRate: '4.98',
    status: 'completed',
    createdAt: new Date('2025-05-05'),
    executionDate: new Date('2025-05-05'),
  }
];
