import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Download, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface BulkActionsBarProps {
  selectedCount: number;
  onApprove?: () => void;
  onReject?: () => void;
  onExport?: () => void;
  onAssign?: () => void;
  onClearSelection?: () => void;
  className?: string;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onApprove,
  onReject,
  onExport,
  onAssign,
  onClearSelection,
  className = ''
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={`sticky top-0 z-10 bg-white dark:bg-gray-800 border-b shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpar seleção
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {onApprove && (
            <Button
              variant="default"
              size="sm"
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Aprovar ({selectedCount})
            </Button>
          )}
          
          {onReject && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onReject}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeitar ({selectedCount})
            </Button>
          )}
          
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          )}
          {onAssign && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAssign}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Atribuir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;

