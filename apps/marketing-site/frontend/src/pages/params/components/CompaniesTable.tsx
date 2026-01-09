
import React from 'react';
import { Eye, FileText } from 'lucide-react';
import { Company } from '../data/companiesData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompaniesTableProps {
  companies: Company[];
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({ companies }) => {
  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'Cliente':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{type}</Badge>;
      case 'Fornecedor':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{type}</Badge>;
      case 'Parceiro':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Ativo' 
      ? <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{status}</Badge>
      : <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Empresas Cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.cnpj}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{getTypeBadge(company.type)}</TableCell>
                <TableCell>{company.segment}</TableCell>
                <TableCell>{getStatusBadge(company.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompaniesTable;
