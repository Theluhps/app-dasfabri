
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Download } from 'lucide-react';

const mockSuppliers = [
  { id: 'SUP-001', name: 'Shanghai Electronics', country: 'China', category: 'Componentes', rating: 4.8, status: 'Ativo' },
  { id: 'SUP-002', name: 'Delhi Textiles', country: 'Índia', category: 'Têxtil', rating: 4.2, status: 'Ativo' },
  { id: 'SUP-003', name: 'German Machinery Co.', country: 'Alemanha', category: 'Maquinário', rating: 4.9, status: 'Ativo' },
  { id: 'SUP-004', name: 'Taiwan Semiconductors', country: 'Taiwan', category: 'Eletrônicos', rating: 4.7, status: 'Em análise' },
  { id: 'SUP-005', name: 'South Korea Displays', country: 'Coreia do Sul', category: 'Eletrônicos', rating: 4.5, status: 'Ativo' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ativo': return 'bg-green-100 text-green-800';
    case 'Em análise': return 'bg-blue-100 text-blue-800';
    case 'Inativo': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const SuppliersContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fornecedores</h2>
          <p className="text-gray-500">Gerencie seus fornecedores internacionais</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Novo Fornecedor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.id}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.country}</TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>{supplier.rating}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(supplier.status)}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersContent;
