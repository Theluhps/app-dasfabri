
import React, { useState } from 'react';
import { Process } from '@/components/import/processes/data/types';
import { TableRow, TableCell } from '@/components/ui/table';
import { Eye, ClipboardCheck, Star } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { watchlistService } from '@/services/watchlistService';

interface ProcessTableRowProps {
  process: Process;
  theme?: string;
  onViewDetails?: (process: Process) => void;
  onEditProcess?: (process: Process) => void;
  onEdit?: (process: Process) => void; // Added for compatibility with ProcessesAdvancedTable
  isSelected?: boolean;
  onSelect?: (processId: string, selected: boolean) => void;
}

const ProcessTableRow: React.FC<ProcessTableRowProps> = ({ 
  process, 
  theme,
  onViewDetails,
  onEditProcess,
  onEdit,
  isSelected = false,
  onSelect
}) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(process.is_favorite || false);
  const [isToggling, setIsToggling] = useState(false);
  
  const handleViewProcess = () => {
    if (onViewDetails) {
      onViewDetails(process);
      toast({
        title: "Detalhes do Processo",
        description: `Visualizando detalhes do processo ${process.id}.`,
      });
    } else if (onEdit) {
      // For compatibility with ProcessesAdvancedTable
      onEdit(process);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;

    setIsToggling(true);
    try {
      // Extrair ID numérico do process.id (ex: "IMP-2023-001" -> 1)
      const processId = typeof process.id === 'string' 
        ? parseInt(process.id.split('-').pop() || '0', 10)
        : process.id;
      
      if (isNaN(processId) || processId === 0) {
        // Fallback: usar localStorage para mock
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const newFavorites = isFavorite 
          ? favorites.filter((id: string) => id !== process.id)
          : [...favorites, process.id];
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
        toast({
          title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
          description: `Processo ${process.id} ${isFavorite ? 'removido' : 'adicionado'} com sucesso.`,
        });
      } else {
        const response = await watchlistService.toggleFavorite(processId);
        setIsFavorite(response.is_favorite);
        toast({
          title: response.is_favorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
          description: response.message,
        });
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o favorito. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <TableRow className={`border-b hover:${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} ${isSelected ? (theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`}>
      <TableCell className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect?.(process.id, e.target.checked)}
          className="rounded border-gray-300"
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
      <TableCell className={`px-6 py-4 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{process.id}</TableCell>
      <TableCell className="px-6 py-4">{process.client}</TableCell>
      <TableCell className="px-6 py-4">{process.product}</TableCell>
      <TableCell className="px-6 py-4">{process.supplier || '-'}</TableCell>
      <TableCell className="px-6 py-4">{process.origin}</TableCell>
      <TableCell className="px-6 py-4">
        <StatusBadge status={process.status} />
      </TableCell>
      <TableCell className="px-6 py-4">{process.date}</TableCell>
      <TableCell className="px-6 py-4">
        {process.invoiceValue && process.currency ? 
          `${process.currency} ${process.invoiceValue}` : 
          '-'}
      </TableCell>
      <TableCell className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
            onClick={handleToggleFavorite}
            disabled={isToggling}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-gray-800"
            onClick={handleViewProcess}
          >
            <Eye className="h-4 w-4 mr-1" />
            <span>Detalhes</span>
          </Button>
          <Link to={`/workflow/process/${process.id}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#7E69AB] hover:text-[#7E69AB]/80 hover:bg-[#7E69AB]/10"
            >
              <ClipboardCheck className="h-4 w-4 mr-1" />
              <span>Workflow</span>
            </Button>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProcessTableRow;
