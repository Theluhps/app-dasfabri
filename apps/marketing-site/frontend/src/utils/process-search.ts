
import { Process } from '@/pages/import/ProcessesAdvanced';

/**
 * Apply text search filter on processes
 */
export function applyTextSearch(processes: Process[], searchTerm: string): Process[] {
  if (!searchTerm) return processes;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return processes.filter(
    (process) =>
      process.id.toLowerCase().includes(lowerSearchTerm) ||
      process.client.toLowerCase().includes(lowerSearchTerm) ||
      process.product.toLowerCase().includes(lowerSearchTerm) ||
      (process.tracking_number?.toLowerCase().includes(lowerSearchTerm) || false) ||
      (process.bl_number?.toLowerCase().includes(lowerSearchTerm) || false)
  );
}

/**
 * Apply status filter on processes
 */
export function applyStatusFilter(processes: Process[], statusValues: string[]): Process[] {
  if (!statusValues || statusValues.length === 0) return processes;
  
  return processes.filter((process) => {
    const statusMap: { [key: string]: string } = {
      'em-andamento': 'Em andamento',
      'liberado': 'Liberado',
      'aguardando': 'Aguardando documentos',
      'analise': 'Em análise',
      'documentacao': 'Documentação completa'
    };
    
    return statusValues.some((statusValue) => process.status === statusMap[statusValue]);
  });
}

/**
 * Apply origin filter on processes
 */
export function applyOriginFilter(processes: Process[], origin: string): Process[] {
  if (!origin) return processes;
  
  const originMap: { [key: string]: string } = {
    'china': 'China',
    'eua': 'Estados Unidos',
    'alemanha': 'Alemanha',
    'india': 'Índia',
    'japao': 'Japão',
    'coreia-do-sul': 'Coreia do Sul',
    'taiwan': 'Taiwan'
  };
  
  return processes.filter((process) => process.origin === originMap[origin]);
}

/**
 * Apply date filters on processes
 */
export function applyDateFilters(
  processes: Process[], 
  startDate?: string, 
  endDate?: string
): Process[] {
  let results = [...processes];
  
  // Apply start date filter
  if (startDate) {
    results = results.filter((process) => {
      const processDateParts = process.date.split('/');
      // Convert to comparable format (year-month-day)
      const processDateFormatted = `${processDateParts[2]}-${processDateParts[1]}-${processDateParts[0]}`;
      return processDateFormatted >= startDate;
    });
  }
  
  // Apply end date filter
  if (endDate) {
    results = results.filter((process) => {
      const processDateParts = process.date.split('/');
      // Convert to comparable format (year-month-day)
      const processDateFormatted = `${processDateParts[2]}-${processDateParts[1]}-${processDateParts[0]}`;
      return processDateFormatted <= endDate;
    });
  }
  
  return results;
}

/**
 * Apply category filter on processes
 */
export function applyCategoryFilter(processes: Process[], category?: string): Process[] {
  if (!category) return processes;
  return processes.filter((process) => process.category === category);
}

/**
 * Apply shipping status filter on processes
 */
export function applyShippingStatusFilter(processes: Process[], shippingStatus?: string): Process[] {
  if (!shippingStatus) return processes;
  return processes.filter((process) => process.shipping_status === shippingStatus);
}

/**
 * Apply priority filter on processes
 */
export function applyPriorityFilter(processes: Process[], priority?: string): Process[] {
  if (!priority) return processes;
  return processes.filter((process) => process.priority === priority);
}

/**
 * Apply integration filter on processes
 */
export function applyIntegrationFilter(processes: Process[], integration?: string): Process[] {
  if (!integration) return processes;
  return processes.filter((process) => process.integration === integration);
}

/**
 * Apply tracking stage filter on processes
 */
export function applyTrackingStageFilter(processes: Process[], trackingStage?: string): Process[] {
  if (!trackingStage) return processes;
  return processes.filter((process) => process.tracking_stage === trackingStage);
}
