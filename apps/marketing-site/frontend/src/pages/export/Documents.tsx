
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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FilePlus, Download, Eye, Search, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DocumentForm from '@/components/import/DocumentForm';

const ExportDocuments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const documents = [
    { id: 'DOC-EXP-001', name: 'Commercial Invoice', process: 'EXP-2023-001', date: '06/04/2025', status: 'Aprovado' },
    { id: 'DOC-EXP-002', name: 'Packing List', process: 'EXP-2023-001', date: '06/04/2025', status: 'Aprovado' },
    { id: 'DOC-EXP-003', name: 'Bill of Lading', process: 'EXP-2023-002', date: '14/04/2025', status: 'Pendente' },
    { id: 'DOC-EXP-004', name: 'Certificate of Origin', process: 'EXP-2023-003', date: '19/04/2025', status: 'Aprovado' },
    { id: 'DOC-EXP-005', name: 'Export License', process: 'EXP-2023-003', date: '19/04/2025', status: 'Pendente' },
    { id: 'DOC-EXP-006', name: 'Insurance Certificate', process: 'EXP-2023-004', date: '23/04/2025', status: 'Pendente' },
    { id: 'DOC-EXP-007', name: 'Shipping Instructions', process: 'EXP-2023-005', date: '28/04/2025', status: 'Aprovado' },
    { id: 'DOC-EXP-008', name: 'Dangerous Goods Declaration', process: 'EXP-2023-005', date: '29/04/2025', status: 'Reprovado' },
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.process.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDocument = (doc: typeof documents[0]) => {
    setSelectedDocument(doc);
    setShowViewDialog(true);
  };

  const handleDownloadDocument = (doc: typeof documents[0]) => {
    const link = document.createElement('a');
    link.href = `#download-${doc.id}`;
    link.download = `${doc.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: `Baixando ${doc.name}...`,
    });
  };

  const handleCreateDocument = (documentData: any) => {
    toast({
      title: "Documento criado",
      description: `O documento foi adicionado com sucesso.`,
    });
    setShowCreateDialog(false);
  };

  return (
    <PageLayout 
      title="Documentos de Exportação" 
      description="Gerencie todos os documentos relacionados aos processos de exportação"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar documentos..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setShowCreateDialog(true)}
          >
            <FilePlus className="h-4 w-4" />
            Novo Documento
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Documentos de Exportação</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.id}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.process}</TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        doc.status === 'Aprovado' 
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'Pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doc.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDocument(doc)}
                        title="Visualizar documento"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownloadDocument(doc)}
                        title="Baixar documento"
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
      </div>

      {/* Dialog para Visualizar Documento */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Visualizar Documento
            </DialogTitle>
            <DialogDescription>
              Detalhes do documento de exportação
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID</p>
                  <p className="font-medium">{selectedDocument.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nome</p>
                  <p className="font-medium">{selectedDocument.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Processo</p>
                  <p className="font-medium">{selectedDocument.process}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Data</p>
                  <p className="font-medium">{selectedDocument.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedDocument.status === 'Aprovado' 
                      ? 'bg-green-100 text-green-800'
                      : selectedDocument.status === 'Pendente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedDocument.status}
                  </span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Visualização do documento</p>
                  <p className="text-xs mt-1">{selectedDocument.name}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Fechar
            </Button>
            {selectedDocument && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleDownloadDocument(selectedDocument);
                    setShowViewDialog(false);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
                <Button 
                  onClick={() => {
                    const processNumber = selectedDocument.process.split('-').pop();
                    navigate(`/export/processes?process=${processNumber}`);
                    setShowViewDialog(false);
                  }}
                >
                  Ver Processo
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Criar Novo Documento */}
      <DocumentForm
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateDocument}
        processId=""
      />
    </PageLayout>
  );
};

export default ExportDocuments;
