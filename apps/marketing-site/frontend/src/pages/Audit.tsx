
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
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  UserCheck, 
  FilePlus, 
  FileEdit, 
  Trash, 
  FileCheck,
  FileText
} from 'lucide-react';

const Audit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const auditLogs = [
    { 
      id: 1,
      date: '10/05/2025 14:35:22',
      user: 'João Silva',
      action: 'Criação',
      entityType: 'Processo',
      entityId: 'IMP-2023-001',
      description: 'Criou um novo processo de importação',
      ip: '192.168.1.100'
    },
    { 
      id: 2,
      date: '10/05/2025 14:40:15',
      user: 'João Silva',
      action: 'Edição',
      entityType: 'Processo',
      entityId: 'IMP-2023-001',
      description: 'Atualizou informações do processo',
      ip: '192.168.1.100'
    },
    { 
      id: 3,
      date: '10/05/2025 15:10:07',
      user: 'Maria Souza',
      action: 'Upload',
      entityType: 'Documento',
      entityId: 'DOC-001',
      description: 'Enviou fatura comercial ao processo IMP-2023-001',
      ip: '192.168.1.101'
    },
    { 
      id: 4,
      date: '10/05/2025 15:30:45',
      user: 'Pedro Santos',
      action: 'Aprovação',
      entityType: 'Documento',
      entityId: 'DOC-001',
      description: 'Aprovou documento fatura comercial',
      ip: '192.168.1.102'
    },
    { 
      id: 5,
      date: '10/05/2025 16:00:12',
      user: 'Ana Oliveira',
      action: 'Pagamento',
      entityType: 'Financeiro',
      entityId: 'PAG-001',
      description: 'Registrou pagamento de fatura no processo IMP-2023-001',
      ip: '192.168.1.103'
    },
    { 
      id: 6,
      date: '09/05/2025 10:15:33',
      user: 'Carlos Ferreira',
      action: 'Exclusão',
      entityType: 'Documento',
      entityId: 'DOC-002',
      description: 'Removeu documento duplicado do processo IMP-2023-002',
      ip: '192.168.1.104'
    },
    { 
      id: 7,
      date: '09/05/2025 11:20:58',
      user: 'Maria Souza',
      action: 'Login',
      entityType: 'Sistema',
      entityId: '-',
      description: 'Login no sistema',
      ip: '192.168.1.101'
    },
  ];

  const filteredLogs = auditLogs
    .filter(log => 
      (searchTerm === '' || 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (typeFilter === undefined || log.action === typeFilter)
    );

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'Criação':
        return <FilePlus className="h-4 w-4 text-green-600" />;
      case 'Edição':
        return <FileEdit className="h-4 w-4 text-blue-600" />;
      case 'Exclusão':
        return <Trash className="h-4 w-4 text-red-600" />;
      case 'Upload':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'Aprovação':
        return <FileCheck className="h-4 w-4 text-green-600" />;
      case 'Pagamento':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'Login':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      default:
        return <ClipboardCheck className="h-4 w-4" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch(action) {
      case 'Criação':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{action}</Badge>;
      case 'Edição':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{action}</Badge>;
      case 'Exclusão':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">{action}</Badge>;
      case 'Upload':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">{action}</Badge>;
      case 'Aprovação':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{action}</Badge>;
      case 'Pagamento':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{action}</Badge>;
      case 'Login':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">{action}</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <PageLayout 
      title="Auditoria" 
      description="Acompanhe todas as ações realizadas no sistema"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              className="pl-10 pr-4" 
              placeholder="Buscar log de auditoria..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="flex gap-2 w-full sm:w-[180px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Tipo de ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Criação">Criação</SelectItem>
                <SelectItem value="Edição">Edição</SelectItem>
                <SelectItem value="Exclusão">Exclusão</SelectItem>
                <SelectItem value="Upload">Upload</SelectItem>
                <SelectItem value="Aprovação">Aprovação</SelectItem>
                <SelectItem value="Pagamento">Pagamento</SelectItem>
                <SelectItem value="Login">Login</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="flex-shrink-0"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter(undefined);
              }}
            >
              Limpar
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Registros de Auditoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        {getActionBadge(log.action)}
                      </div>
                    </TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{log.entityId}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.description}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Distribuição de Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FilePlus className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Criação</span>
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileEdit className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Edição</span>
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Upload</span>
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Aprovação</span>
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trash className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Exclusão</span>
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Usuários Mais Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maria Souza</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">João Silva</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pedro Santos</span>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ana Oliveira</span>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Carlos Ferreira</span>
                  <span className="text-sm font-medium">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Últimos IPs de Acesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">192.168.1.100</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">192.168.1.101</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">192.168.1.102</span>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">192.168.1.103</span>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">192.168.1.104</span>
                  <span className="text-sm font-medium">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Audit;
