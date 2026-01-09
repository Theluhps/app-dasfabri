
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

interface ProcessesPaginationProps {
  filteredCount: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const ProcessesPagination: React.FC<ProcessesPaginationProps> = ({
  filteredCount,
  totalCount,
  currentPage,
  pageSize,
  onPageChange
}) => {
  const totalPages = Math.ceil(filteredCount / pageSize);
  
  // Calculate page range to display (show max 5 pages)
  const getPageRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    return range;
  };

  const pageRange = getPageRange();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  
  // Calculate display range for items
  const startItem = filteredCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, filteredCount);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-4">
      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-[#7E69AB]">{startItem}-{endItem}</span> de <span className="font-medium text-[#7E69AB]">{filteredCount}</span> processos
        {filteredCount !== totalCount && (
          <span className="text-xs ml-1">(Filtrados de {totalCount} total)</span>
        )}
      </div>
      
      <Pagination>
        <PaginationContent>
          {totalPages > 3 && (
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!hasPrevious}
                onClick={() => onPageChange(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => hasPrevious && onPageChange(currentPage - 1)}
              className={!hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {pageRange.map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={page === currentPage}
                className={`cursor-pointer ${page === currentPage ? 'bg-[#7E69AB] text-white hover:bg-[#6a5590] hover:text-white' : ''}`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {totalPages > pageRange[pageRange.length - 1] && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => hasNext && onPageChange(currentPage + 1)}
              className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {totalPages > 3 && (
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!hasNext}
                onClick={() => onPageChange(totalPages)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProcessesPagination;
