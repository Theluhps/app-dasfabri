export interface Company {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  type: 'Cliente' | 'Fornecedor' | 'Parceiro';
  segment: string;
  status: 'Ativo' | 'Inativo';
}

export const companies: Company[] = [
  { 
    id: 1,
    name: 'Empresa ABC Ltda', 
    cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000, São Paulo - SP',
    type: 'Cliente',
    segment: 'Tecnologia',
    status: 'Ativo'
  },
  { 
    id: 2,
    name: 'XYZ Importadora S.A.', 
    cnpj: '98.765.432/0001-10',
    address: 'Rua Augusta, 500, São Paulo - SP',
    type: 'Cliente',
    segment: 'Comércio',
    status: 'Ativo'
  },
  { 
    id: 3,
    name: 'Transportes Rápidos Ltda', 
    cnpj: '45.678.901/0001-23',
    address: 'Av. Brasil, 2000, Rio de Janeiro - RJ',
    type: 'Fornecedor',
    segment: 'Logística',
    status: 'Ativo'
  },
  { 
    id: 4,
    name: 'Global Trading Corp', 
    cnpj: '78.901.234/0001-56',
    address: 'Av. do Estado, 1500, São Paulo - SP',
    type: 'Parceiro',
    segment: 'Comércio Exterior',
    status: 'Inativo'
  },
  { 
    id: 5,
    name: 'Indústrias Reunidas S.A.', 
    cnpj: '56.789.012/0001-34',
    address: 'Rod. Anchieta, km 10, São Bernardo - SP',
    type: 'Cliente',
    segment: 'Manufatura',
    status: 'Ativo'
  },
];
