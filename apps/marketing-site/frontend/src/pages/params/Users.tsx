
import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Eye, Search, UserCheck, UserX } from 'lucide-react';

const ParamsUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { 
      id: 1,
      name: 'João Silva', 
      email: 'joao.silva@empresa.com',
      role: 'Administrador',
      department: 'Comercial',
      status: 'Ativo',
      lastAccess: '10/05/2025 14:30'
    },
    { 
      id: 2,
      name: 'Maria Souza', 
      email: 'maria.souza@empresa.com',
      role: 'Gerente',
      department: 'Importação',
      status: 'Ativo',
      lastAccess: '10/05/2025 10:15'
    },
    { 
      id: 3,
      name: 'Pedro Santos', 
      email: 'pedro.santos@empresa.com',
      role: 'Analista',
      department: 'Exportação',
      status: 'Ativo',
      lastAccess: '09/05/2025 16:45'
    },
    { 
      id: 4,
      name: 'Ana Oliveira', 
      email: 'ana.oliveira@empresa.com',
      role: 'Analista',
      department: 'Financeiro',
      status: 'Inativo',
      lastAccess: '02/05/2025 09:20'
    },
    { 
      id: 5,
      name: 'Carlos Ferreira', 
      email: 'carlos.ferreira@empresa.com',
      role: 'Operador',
      department: 'Logística',
      status: 'Ativo',
      lastAccess: '10/05/2025 08:10'
    },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'Administrador':
        return <Badge variant="default">{role}</Badge>;
      case 'Gerente':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{role}</Badge>;
      case 'Analista':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{role}</Badge>;
      case 'Operador':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">{role}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Ativo' 
      ? <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{status}</Badge>
      : <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">{status}</Badge>;
  };

  return (
    <PageLayout 
      title="Gestão de Usuários" 
      description="Administre os usuários do sistema e suas permissões"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              className="pl-10 pr-4" 
              placeholder="Buscar usuários..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Usuário</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo usuário do sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    placeholder="Nome completo"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="email@empresa.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Função
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="analyst">Analista</SelectItem>
                      <SelectItem value="operator">Operador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Departamento
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Comercial</SelectItem>
                      <SelectItem value="import">Importação</SelectItem>
                      <SelectItem value="export">Exportação</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                      <SelectItem value="logistics">Logística</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Ativo
                  </Label>
                  <div className="col-span-3">
                    <Switch id="status" defaultChecked />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Adicionar Usuário</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Usuários do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.lastAccess}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {user.status === 'Ativo' ? (
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="text-green-500">
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ParamsUsers;
