
import React from 'react';
import { Eye, MoreHorizontal, ExternalLink, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProcessRowActionsProps {
  theme?: string;
  onEdit?: () => void;
}

const ProcessRowActions: React.FC<ProcessRowActionsProps> = ({ theme, onEdit }) => {
  return (
    <div className="flex space-x-1 justify-end">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#7E69AB] hover:bg-[#7E69AB]/10">
        <Eye className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#7E69AB] hover:bg-[#7E69AB]/10">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-700' : ''}>
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Eye className="h-4 w-4" /> Visualizar detalhes
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={onEdit}>
            <Edit className="h-4 w-4" /> Editar processo
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <ExternalLink className="h-4 w-4" /> Abrir processo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProcessRowActions;
