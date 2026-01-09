
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Download } from 'lucide-react';

const mockOrders = [
  { id: 'PO-2025-001', supplier: 'Shanghai Electronics', product: 'Componentes Eletrônicos', value: '$45,000', date: '10/05/2025', status: 'Em análise' },
  { id: 'PO-2025-002', supplier: 'Delhi Textiles', product: 'Tecidos', value: '$23,500', date: '08/05/2025', status: 'Aprovado' },
  { id: 'PO-2025-003', supplier: 'German Machinery Co.', product: 'Equipamento Industrial', value: '$120,000', date: '05/05/2025', status: 'Enviado' },
  { id: 'PO-2025-004', supplier: 'Taiwan Semiconductors', product: 'Chips e Processadores', value: '$78,000', date: '01/05/2025', status: 'Em produção' },
  { id: 'PO-2025-005', supplier: 'South Korea Displays', product: 'Telas LCD', value: '$56,000', date: '28/04/2025', status: 'Pendente' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Aprovado': return 'bg-green-100 text-green-800';
    case 'Em análise': return 'bg-blue-100 text-blue-800';
    case 'Pendente': return 'bg-yellow-100 text-yellow-800';
    case 'Enviado': return 'bg-purple-100 text-purple-800';
    case 'Em produção': return 'bg-cyan-100 text-cyan-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrdersContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pedidos de Compra</h2>
          <p className="text-gray-500">Gerencie seus pedidos de compra internacionais</p>
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
            Novo Pedido
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.value}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
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

export default OrdersContent;
