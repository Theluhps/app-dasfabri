// Mock data service for import processes
export interface Process {
  id: string;
  client: string;
  product: string;
  origin: string;
  status: string;
  date: string;
  estimatedArrival?: string;
  invoiceValue?: string;
  ncm?: string;
  description?: string;
  importType?: string;
  shippingMethod?: string;
  currency?: string;
  incoterm?: string;
  referenceNumber?: string;
  customsBroker?: string;
  supplier?: string;
  documents?: {
    id: string;
    name: string;
    type: string;
    uploadDate: Date | string;
    status: 'Aprovado' | 'Pendente' | 'Rejeitado' | 'Em análise';
    size?: number;
    comments?: string;
    processId: string;
  }[];
  timeline?: {
    date: string;
    status: string;
    description: string;
  }[];
}

// Dados mock expandidos para processos de importação
export const getProcesses = (): Process[] => {
  const baseProcesses = [
    { 
      id: 'IMP-2023-001', 
      client: 'Empresa ABC Ltda', 
      product: 'Máquinas industriais', 
      description: 'Equipamentos para linha de produção de alimentos processados',
      origin: 'China', 
      status: 'Em andamento', 
      date: '15/05/2025', 
      estimatedArrival: '30/06/2025', 
      invoiceValue: '120.000,00', 
      currency: 'USD',
      ncm: '8477.10.11',
      importType: 'regular',
      shippingMethod: 'maritime',
      incoterm: 'FOB',
      referenceNumber: 'PO-ABC-2023-42',
      customsBroker: 'Aduaneira Express',
      supplier: 'Shanghai Machinery Co.'
    },
    { 
      id: 'IMP-2023-002', 
      client: 'Distribuidora XYZ', 
      product: 'Componentes eletrônicos', 
      description: 'Microcontroladores e placas de circuito para montagem',
      origin: 'Alemanha', 
      status: 'Liberado', 
      date: '10/05/2025', 
      estimatedArrival: '25/05/2025', 
      invoiceValue: '85.000,00',
      currency: 'EUR', 
      ncm: '8542.31.90',
      importType: 'regular',
      shippingMethod: 'air',
      incoterm: 'CIF',
      referenceNumber: 'XYZ-2023-105',
      customsBroker: 'LogImport',
      supplier: 'Elektronik GmbH'
    },
    { 
      id: 'IMP-2023-003', 
      client: 'Indústria Nacional', 
      product: 'Matéria-prima', 
      description: 'Produtos químicos para indústria farmacêutica',
      origin: 'Estados Unidos', 
      status: 'Aguardando documentos', 
      date: '05/05/2025', 
      estimatedArrival: '20/06/2025', 
      invoiceValue: '65.000,00',
      currency: 'USD', 
      ncm: '2815.12.00',
      importType: 'drawback',
      shippingMethod: 'maritime',
      incoterm: 'EXW',
      referenceNumber: 'IN-MP-2023-78',
      customsBroker: 'Aduaneira Rápida',
      supplier: 'ChemUS Corp'
    },
    { 
      id: 'IMP-2023-004', 
      client: 'Comércio Global', 
      product: 'Produtos químicos', 
      description: 'Compostos para indústria de tintas',
      origin: 'Índia', 
      status: 'Em análise', 
      date: '01/05/2025', 
      estimatedArrival: '15/06/2025', 
      invoiceValue: '45.000,00',
      currency: 'USD', 
      ncm: '2804.50.00',
      importType: 'regular',
      shippingMethod: 'maritime',
      incoterm: 'CIF',
      referenceNumber: 'CG-2023-65',
      customsBroker: 'Mundial Despachos',
      supplier: 'Indian Chemicals Ltd'
    },
    { 
      id: 'IMP-2023-005', 
      client: 'Tecnologia Avançada', 
      product: 'Equipamentos médicos', 
      description: 'Equipamentos para diagnóstico por imagem',
      origin: 'Japão', 
      status: 'Documentação completa', 
      date: '28/04/2025', 
      estimatedArrival: '10/05/2025', 
      invoiceValue: '8.500.000,00',
      currency: 'JPY', 
      ncm: '9018.90.99',
      importType: 'temporary',
      shippingMethod: 'air',
      incoterm: 'DAP',
      referenceNumber: 'TA-MED-2023-12',
      customsBroker: 'MediImport',
      supplier: 'Tokyo Medical Systems'
    },
  ];
  
  // Adicionar mais processos para paginação
  const moreProcesses = [];
  for (let i = 6; i <= 25; i++) {
    const id = `IMP-2023-${i.toString().padStart(3, '0')}`;
    const randomClient = [`Importadora ${i}`, 'Tech Solutions', 'Global Trade', 'Amazon BR', 'FastShip'][Math.floor(Math.random() * 5)];
    const randomProduct = ['Eletrônicos', 'Matéria-prima', 'Peças automotivas', 'Equipamentos médicos', 'Produtos químicos'][Math.floor(Math.random() * 5)];
    const randomOrigin = ['China', 'EUA', 'Alemanha', 'Japão', 'Coreia do Sul', 'Taiwan', 'Índia', 'México'][Math.floor(Math.random() * 8)];
    const randomStatus = ['Em andamento', 'Liberado', 'Aguardando documentos', 'Em análise', 'Documentação completa'][Math.floor(Math.random() * 5)];
    
    // Data entre janeiro e maio de 2025
    const randomMonth = Math.floor(Math.random() * 5) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomDate = `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/2025`;
    
    const randomArrivalMonth = Math.min(randomMonth + Math.floor(Math.random() * 3) + 1, 12);
    const randomArrivalDay = Math.floor(Math.random() * 28) + 1;
    const estimatedArrival = `${randomArrivalDay.toString().padStart(2, '0')}/${randomArrivalMonth.toString().padStart(2, '0')}/2025`;
    
    const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'CNY'];
    const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
    const randomValue = Math.floor(Math.random() * 100000) + 10000;
    
    const invoiceValue = `${randomValue.toLocaleString('pt-BR')}`;
    const randomNcm = `${Math.floor(Math.random() * 9999)}.${Math.floor(Math.random() * 99)}.${Math.floor(Math.random() * 99)}`;
    
    const importTypes = ['regular', 'temporary', 'drawback', 'reimport', 'express'];
    const randomImportType = importTypes[Math.floor(Math.random() * importTypes.length)];
    
    const shippingMethods = ['maritime', 'air', 'road', 'rail', 'multimodal'];
    const randomShippingMethod = shippingMethods[Math.floor(Math.random() * shippingMethods.length)];
    
    const incoterms = ['FOB', 'CIF', 'EXW', 'DAP', 'FCA', 'CFR', 'CPT', 'CIP', 'DPU', 'DDP'];
    const randomIncoterm = incoterms[Math.floor(Math.random() * incoterms.length)];
    
    const brokers = ['Aduaneira Express', 'LogImport', 'Mundial Despachos', 'MediImport', 'FastClear'];
    const randomBroker = brokers[Math.floor(Math.random() * brokers.length)];
    
    const suppliers = ['Shanghai Machinery Co.', 'Elektronik GmbH', 'ChemUS Corp', 'Indian Chemicals Ltd', 'Tokyo Medical Systems', 'Global Supply Inc.'];
    const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    
    moreProcesses.push({
      id,
      client: randomClient,
      product: randomProduct,
      description: `Descrição do produto ${id}`,
      origin: randomOrigin,
      status: randomStatus,
      date: randomDate,
      estimatedArrival,
      invoiceValue,
      currency: randomCurrency,
      ncm: randomNcm,
      importType: randomImportType,
      shippingMethod: randomShippingMethod,
      incoterm: randomIncoterm,
      referenceNumber: `REF-${id}`,
      customsBroker: randomBroker,
      supplier: randomSupplier
    });
  }
  
  return [...baseProcesses, ...moreProcesses];
};

// Função para obter processos com paginação
export const getPaginatedProcesses = (
  processes: Process[],
  page: number = 1,
  pageSize: number = 10
): Process[] => {
  const startIndex = (page - 1) * pageSize;
  return processes.slice(startIndex, startIndex + pageSize);
};

export const filterProcesses = (
  processes: Process[],
  searchTerm: string = '',
  filterStatus: string = '',
  filterDate?: Date,
  filterOrigin: string = '',
  filterClient: string = '',
  filterRange?: { start?: Date; end?: Date }
): Process[] => {
  return processes.filter(process => {
    // Filtro por termo de busca (busca em vários campos)
    const matchesSearch = searchTerm === '' || 
      process.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (process.ncm && process.ncm.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtro por status
    const matchesStatus = filterStatus === '' || process.status === filterStatus;
    
    // Filtro por data específica
    const matchesDate = !filterDate || process.date.includes(
      filterDate.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })
    );
    
    // Filtro por origem
    const matchesOrigin = filterOrigin === '' || 
      process.origin.toLowerCase().includes(filterOrigin.toLowerCase());
    
    // Filtro por cliente
    const matchesClient = filterClient === '' || 
      process.client.toLowerCase().includes(filterClient.toLowerCase());
    
    // Filtro por intervalo de datas
    let matchesDateRange = true;
    if (filterRange && (filterRange.start || filterRange.end)) {
      const processDate = parseDate(process.date);
      
      if (filterRange.start && filterRange.end) {
        matchesDateRange = processDate >= filterRange.start && processDate <= filterRange.end;
      } else if (filterRange.start) {
        matchesDateRange = processDate >= filterRange.start;
      } else if (filterRange.end) {
        matchesDateRange = processDate <= filterRange.end;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate && 
           matchesOrigin && matchesClient && matchesDateRange;
  });
};

// Helper para converter string de data no formato DD/MM/YYYY para objeto Date
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// Obter todos os status distintos para o filtro
export const getDistinctStatuses = (processes: Process[]): string[] => {
  const statuses = new Set(processes.map(process => process.status));
  return Array.from(statuses);
};

// Obter todos os países de origem distintos para o filtro
export const getDistinctOrigins = (processes: Process[]): string[] => {
  const origins = new Set(processes.map(process => process.origin));
  return Array.from(origins);
};

// Obter todos os clientes distintos para o filtro
export const getDistinctClients = (processes: Process[]): string[] => {
  const clients = new Set(processes.map(process => process.client));
  return Array.from(clients);
};

// Obter processo por ID
export const getProcessById = (id: string): Process | undefined => {
  const allProcesses = getProcesses();
  return allProcesses.find(process => process.id === id);
};

// Função para criar um novo processo de importação
export const createProcess = (process: Partial<Process>): Process => {
  const allProcesses = getProcesses();
  const lastId = allProcesses.length > 0 
    ? parseInt(allProcesses[0].id.split('-')[2]) 
    : 0;
    
  const newId = `IMP-2023-${(lastId + 1).toString().padStart(3, '0')}`;
  const today = new Date().toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  const newProcess: Process = {
    id: newId,
    client: process.client || 'Cliente não informado',
    product: process.product || 'Produto não informado',
    description: process.description || '',
    origin: process.origin || 'Origem não informada',
    status: 'Em andamento',
    date: today,
    estimatedArrival: process.estimatedArrival ? new Date(process.estimatedArrival).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }) : undefined,
    invoiceValue: process.invoiceValue,
    currency: process.currency,
    ncm: process.ncm,
    importType: process.importType,
    shippingMethod: process.shippingMethod,
    incoterm: process.incoterm,
    referenceNumber: process.referenceNumber,
    customsBroker: process.customsBroker,
    supplier: process.supplier,
    documents: [],
    timeline: [
      { 
        date: today, 
        status: 'Criação', 
        description: 'Processo criado no sistema' 
      }
    ]
  };
  
  // Em um cenário real, salvaria no banco de dados
  // Aqui estamos apenas retornando o novo processo
  return newProcess;
};

// Atualizar processo existente
export const updateProcess = (id: string, updates: Partial<Process>): Process | undefined => {
  const allProcesses = getProcesses();
  const processIndex = allProcesses.findIndex(p => p.id === id);
  
  if (processIndex === -1) return undefined;
  
  const process = allProcesses[processIndex];
  const updatedProcess = { ...process, ...updates };
  
  // Em um cenário real, salvaria no banco de dados
  // Aqui estamos apenas retornando o processo atualizado
  return updatedProcess;
};
