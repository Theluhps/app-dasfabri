
import { useState } from 'react';
import { Process } from './types';

interface UsePaginationProps {
  filteredProcesses: Process[];
  itemsPerPage?: number;
}

export const usePagination = ({
  filteredProcesses,
  itemsPerPage = 10
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProcesses.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    currentItems,
    itemsPerPage,
    totalPages,
    resetPagination
  };
};
