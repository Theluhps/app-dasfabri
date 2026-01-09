
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Download, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Document } from '../types/DocumentTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentsTableProps {
  documents: Document[];
  selectedDocuments: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onViewDocument: (document: Document) => void;
  onDownloadDocument?: (document: Document) => void;
  getDocumentTypeLabel: (type: string) => string;
  getStatusColor: (status: string) => string;
  formatSize: (size?: number) => string;
  formatDate: (date: Date | string) => string;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  selectedDocuments,
  onToggleSelect,
  onSelectAll,
  onViewDocument,
  onDownloadDocument,
  getDocumentTypeLabel,
  getStatusColor,
  formatSize,
  formatDate
}) => {
  const handleDownload = (doc: Document) => {
    if (onDownloadDocument) {
      onDownloadDocument(doc);
    } else {
      // Fallback: criar um link de download simulado
      const link = document.createElement('a');
      link.href = `#download-${doc.id}`;
      link.download = doc.name;
      link.click();
    }
  };
  const allSelected = documents.length > 0 && documents.every(doc => 
    selectedDocuments.includes(doc.id)
  );
  
  const someSelected = selectedDocuments.length > 0 && !allSelected;
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-10">
              <Checkbox 
                checked={allSelected}
                className={someSelected ? "opacity-80" : ""}
                onCheckedChange={onSelectAll}
                aria-label="Selecionar todos"
              />
            </TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data de Upload</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="group">
              <TableCell>
                <Checkbox 
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={() => onToggleSelect(doc.id)}
                  aria-label={`Selecionar ${doc.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell>{getDocumentTypeLabel(doc.type)}</TableCell>
              <TableCell>{formatDate(doc.uploadDate)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(doc.status)}>
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell>{formatSize(doc.size)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8" 
                    onClick={() => onViewDocument(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDownload(doc)}
                    title="Baixar documento"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => onViewDocument(doc)}
                      >
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => handleDownload(doc)}
                      >
                        Fazer download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Compartilhar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-600">
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsTable;
