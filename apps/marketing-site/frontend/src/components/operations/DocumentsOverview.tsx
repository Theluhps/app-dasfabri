
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  FileCheck, 
  AlertCircle, 
  FileSearch, 
  FileClock,
  ArrowRight,
  Plus 
} from 'lucide-react';

interface DocumentStat {
  name: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

const DocumentsOverview = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === 'dark';

  const handleAddDocument = () => {
    toast({
      title: "Adicionar documento",
      description: "Funcionalidade de adicionar documento será aberta."
    });
  };

  const documentStats: DocumentStat[] = [
    {
      name: "Documentos pendentes",
      count: 12,
      color: "text-amber-500",
      icon: <FileClock className="h-5 w-5" />
    },
    {
      name: "Documentos aprovados",
      count: 45,
      color: "text-green-500",
      icon: <FileCheck className="h-5 w-5" />
    },
    {
      name: "Em análise",
      count: 8,
      color: "text-blue-500",
      icon: <FileSearch className="h-5 w-5" />
    },
    {
      name: "Com problemas",
      count: 3,
      color: "text-red-500",
      icon: <AlertCircle className="h-5 w-5" />
    }
  ];

  const recentDocuments = [
    { id: 'DOC0012', name: 'Invoice #78324', processId: 'IMP-2023-002', date: '10/05/2025', status: 'Pendente' },
    { id: 'DOC0011', name: 'Bill of Lading', processId: 'IMP-2023-001', date: '09/05/2025', status: 'Aprovado' },
    { id: 'DOC0010', name: 'Certificado de Origem', processId: 'IMP-2023-003', date: '08/05/2025', status: 'Em análise' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'text-green-500';
      case 'Pendente': return 'text-amber-500';
      case 'Em análise': return 'text-blue-500';
      case 'Rejeitado': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#7E69AB]" />
              <CardTitle className={isDark ? 'text-gray-100' : ''}>
                Documentos
              </CardTitle>
            </div>
            <CardDescription className={isDark ? 'text-gray-400' : ''}>
              Visão geral dos documentos do sistema
            </CardDescription>
          </div>
          <Button 
            size="sm"
            className="bg-[#7E69AB] hover:bg-[#6a5590] flex items-center gap-1.5"
            onClick={handleAddDocument}
          >
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {documentStats.map((stat, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center justify-center p-3 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
            >
              <div className={`mb-1.5 ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.count}</span>
              <span className="text-xs text-muted-foreground text-center mt-1">{stat.name}</span>
            </div>
          ))}
        </div>
        
        <div className={`rounded-md overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`px-4 py-2.5 font-medium ${isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-50 text-gray-700'}`}>
            Documentos Recentes
          </div>
          <div className="divide-y">
            {recentDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className={`px-4 py-3 flex justify-between items-center ${isDark ? 'hover:bg-gray-700/50 divide-gray-700' : 'hover:bg-gray-50 divide-gray-200'} cursor-pointer`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#7E69AB]" />
                    <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{doc.name}</span>
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>ID: {doc.id}</span>
                    <span>Processo: {doc.processId}</span>
                    <span>Data: {doc.date}</span>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="link" className="text-sm flex items-center gap-1.5 mx-auto">
            Ver todos os documentos <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsOverview;
