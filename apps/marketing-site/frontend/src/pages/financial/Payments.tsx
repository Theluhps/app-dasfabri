
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FilePlus, Eye, Download, Filter, FileCheck, FileText, FileMinus } from 'lucide-react';

const FinancialPayments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  
  const pendingPayments = [
    { id: 'PAG-001', description: 'Fatura de Importação', process: 'IMP-2023-001', dueDate: '20/05/2025', value: 'R$ 25.000,00', currency: 'BRL', status: 'Pendente' },
    { id: 'PAG-002', description: 'Despesas Aduaneiras', process: 'IMP-2023-001', dueDate: '25/05/2025', value: 'US$ 3.200,00', currency: 'USD', status: 'Pendente' },
    { id: 'PAG-003', description: 'Frete Internacional', process: 'IMP-2023-002', dueDate: '12/06/2025', value: 'US$ 4.500,00', currency: 'USD', status: 'Pendente' },
    { id: 'PAG-004', description: 'Serviço de Despacho', process: 'EXP-2023-001', dueDate: '15/06/2025', value: 'R$ 3.600,00', currency: 'BRL', status: 'Pendente' },
  ];

  const completedPayments = [
    { id: 'PAG-005', description: 'Seguro Internacional', process: 'IMP-2023-003', paymentDate: '10/05/2025', value: 'R$ 12.000,00', currency: 'BRL', status: 'Pago' },
    { id: 'PAG-006', description: 'Impostos de Importação', process: 'IMP-2023-003', paymentDate: '12/05/2025', value: 'R$ 35.400,00', currency: 'BRL', status: 'Pago' },
    { id: 'PAG-007', description: 'Armazenagem', process: 'IMP-2023-002', paymentDate: '05/05/2025', value: 'R$ 5.200,00', currency: 'BRL', status: 'Pago' },
  ];

  return (
    <PageLayout 
      title="Pagamentos" 
      description="Gerencie todos os pagamentos relacionados aos processos de importação e exportação"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
          <Button className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            Novo Pagamento
          </Button>
        </div>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <FileMinus className="h-4 w-4" />
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Realizados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Processo</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Moeda</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.process}</TableCell>
                        <TableCell>{payment.dueDate}</TableCell>
                        <TableCell>{payment.value}</TableCell>
                        <TableCell>{payment.currency}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowViewDialog(true);
                            }}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "Documentos",
                                description: `Abrindo documentos do pagamento ${payment.id}...`,
                              });
                            }}
                            title="Ver documentos"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Realizados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Processo</TableHead>
                      <TableHead>Data Pagamento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Moeda</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.process}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>{payment.value}</TableCell>
                        <TableCell>{payment.currency}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowViewDialog(true);
                            }}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "Download iniciado",
                                description: `Baixando comprovante do pagamento ${payment.id}...`,
                              });
                            }}
                            title="Baixar comprovante"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para Visualizar Pagamento */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pagamento</DialogTitle>
            <DialogDescription>
              Informações completas sobre o pagamento
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID</p>
                  <p className="font-medium">{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedPayment.status === 'Pago' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedPayment.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Descrição</p>
                  <p className="font-medium">{selectedPayment.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Processo</p>
                  <p className="font-medium">{selectedPayment.process}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Valor</p>
                  <p className="font-medium">{selectedPayment.value}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Moeda</p>
                  <p className="font-medium">{selectedPayment.currency}</p>
                </div>
                {selectedPayment.dueDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Vencimento</p>
                    <p className="font-medium">{selectedPayment.dueDate}</p>
                  </div>
                )}
                {selectedPayment.paymentDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Data Pagamento</p>
                    <p className="font-medium">{selectedPayment.paymentDate}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Fechar
            </Button>
            {selectedPayment && (
              <Button
                onClick={() => {
                  const processNumber = selectedPayment.process.split('-').pop();
                  navigate(`/import/process/${processNumber}`);
                  setShowViewDialog(false);
                }}
              >
                Ver Processo
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default FinancialPayments;
