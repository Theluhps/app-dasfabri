
import { Process } from './types';

// Filter processes based on search term
export const filterProcessesBySearchTerm = (processes: Process[], searchTerm: string): Process[] => {
  if (!searchTerm) return processes;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return processes.filter(
    (process) =>
      process.id.toLowerCase().includes(lowerSearchTerm) ||
      process.client.toLowerCase().includes(lowerSearchTerm) ||
      process.product.toLowerCase().includes(lowerSearchTerm)
  );
};

// Apply all filters to processes
export const applyFilters = (processes: Process[], searchTerm: string, filters: any[]): Process[] => {
  let results = [...processes];
  
  // Apply search term filter
  if (searchTerm) {
    results = filterProcessesBySearchTerm(results, searchTerm);
  }
  
  return results;
};
