
import { DocumentType, DocumentStatus } from '../types/DocumentTypes';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Retorna o rótulo legível para o tipo de documento
 */
export const getDocumentTypeLabel = (type: string): string => {
  const documentTypes: Record<string, string> = {
    'invoice': 'Fatura Comercial',
    'packing': 'Packing List',
    'bl': 'Bill of Lading',
    'awb': 'Air Waybill',
    'certificate': 'Certificado de Origem',
    'license': 'Licença de Importação',
    'customs': 'Declaração Aduaneira',
    'insurance': 'Apólice de Seguro',
    'payment': 'Comprovante de Pagamento',
    'other': 'Outro'
  };

  return documentTypes[type] || type;
};

/**
 * Retorna as classes CSS para cor de status do documento
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'Aprovado': 'bg-green-100 text-green-800 border-green-200',
    'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Em análise': 'bg-blue-100 text-blue-800 border-blue-200',
    'Rejeitado': 'bg-red-100 text-red-800 border-red-200',
    'Expirado': 'bg-gray-100 text-gray-800 border-gray-200',
    'Arquivado': 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Formata o tamanho do arquivo para exibição
 */
export const formatSize = (bytes?: number): string => {
  if (!bytes) return 'N/A';
  
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * Formata a data para exibição
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Data inválida';
    }
    
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (error) {
    return 'Data inválida';
  }
};

/**
 * Retorna o ícone correspondente ao tipo de documento
 */
export const getDocumentTypeIcon = (type: string): string => {
  const documentIcons: Record<string, string> = {
    'invoice': '📄',
    'packing': '📦',
    'bl': '🚢',
    'awb': '✈️',
    'certificate': '🏅',
    'license': '🔐',
    'customs': '🏛️',
    'insurance': '🛡️',
    'payment': '💰',
    'other': '📎'
  };

  return documentIcons[type] || '📄';
};

/**
 * Verifica se um documento está expirado
 */
export const isDocumentExpired = (document: { expirationDate?: Date | string }): boolean => {
  if (!document.expirationDate) return false;
  
  try {
    const expirationDate = typeof document.expirationDate === 'string' 
      ? new Date(document.expirationDate) 
      : document.expirationDate;
      
    return expirationDate < new Date();
  } catch {
    return false;
  }
};

/**
 * Retorna a lista de documentos obrigatórios para um processo por tipo de importação
 */
export const getRequiredDocuments = (importType: string): Array<{type: DocumentType, name: string}> => {
  const commonDocuments = [
    { type: 'invoice' as DocumentType, name: 'Fatura Comercial' },
    { type: 'packing' as DocumentType, name: 'Packing List' },
  ];
  
  switch (importType) {
    case 'maritime':
      return [
        ...commonDocuments,
        { type: 'bl' as DocumentType, name: 'Bill of Lading' },
        { type: 'insurance' as DocumentType, name: 'Apólice de Seguro' },
        { type: 'license' as DocumentType, name: 'Licença de Importação' },
        { type: 'certificate' as DocumentType, name: 'Certificado de Origem' }
      ];
    case 'air':
      return [
        ...commonDocuments,
        { type: 'awb' as DocumentType, name: 'Air Waybill' },
        { type: 'insurance' as DocumentType, name: 'Apólice de Seguro' },
        { type: 'license' as DocumentType, name: 'Licença de Importação' }
      ];
    default:
      return commonDocuments;
  }
};
