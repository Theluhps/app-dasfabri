
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Table, BarChart2, CalendarRange, Filter, Settings } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ModuleType } from '@/types/modules';

type ReportField = {
  id: string;
  label: string;
  module: ModuleType | 'all';
  selected: boolean;
};

type ReportFormat = 'excel' | 'pdf' | 'csv';
type ReportType = 'table' | 'chart';
type DateRange = 'last7days' | 'last30days' | 'lastQuarter' | 'lastYear' | 'custom';

const fieldGroups: Record<string, ReportField[]> = {
  'import_full': [
    { id: 'process_id', label: 'ID do Processo', module: 'import_full', selected: true },
    { id: 'client', label: 'Cliente', module: 'import_full', selected: true },
    { id: 'status', label: 'Status', module: 'import_full', selected: true },
    { id: 'origin', label: 'Origem', module: 'import_full', selected: false },
    { id: 'arrival_date', label: 'Data de Chegada', module: 'import_full', selected: false },
    { id: 'customs_clearance', label: 'Desembaraço', module: 'import_full', selected: false },
  ],
  'po_management': [
    { id: 'po_number', label: 'Número do Pedido', module: 'po_management', selected: true },
    { id: 'supplier', label: 'Fornecedor', module: 'po_management', selected: true },
    { id: 'po_value', label: 'Valor do Pedido', module: 'po_management', selected: true },
    { id: 'po_date', label: 'Data do Pedido', module: 'po_management', selected: false },
    { id: 'items_count', label: 'Quantidade de Itens', module: 'po_management', selected: false },
  ],
  'payment_documents': [
    { id: 'invoice_number', label: 'Número da Nota', module: 'payment_documents', selected: true },
    { id: 'payment_date', label: 'Data de Pagamento', module: 'payment_documents', selected: true },
    { id: 'payment_value', label: 'Valor', module: 'payment_documents', selected: true },
    { id: 'currency', label: 'Moeda', module: 'payment_documents', selected: false },
    { id: 'exchange_rate', label: 'Taxa de Câmbio', module: 'payment_documents', selected: false },
  ],
};

const CustomReportGenerator: React.FC = () => {
  const { toast } = useToast();
  const [reportFormat, setReportFormat] = useState<ReportFormat>('excel');
  const [reportType, setReportType] = useState<ReportType>('table');
  const [dateRange, setDateRange] = useState<DateRange>('last30days');
  const [selectedModule, setSelectedModule] = useState<ModuleType | 'all'>('all');
  const [selectedFields, setSelectedFields] = useState<ReportField[]>([
    ...fieldGroups.import_full.filter(field => field.selected),
    ...fieldGroups.po_management.filter(field => field.selected),
    ...fieldGroups.payment_documents.filter(field => field.selected),
  ]);

  const handleModuleChange = (value: ModuleType | 'all') => {
    setSelectedModule(value);
    if (value === 'all') {
      // When "All" is selected, include default fields from all modules
      setSelectedFields([
        ...fieldGroups.import_full.filter(field => field.selected),
        ...fieldGroups.po_management.filter(field => field.selected),
        ...fieldGroups.payment_documents.filter(field => field.selected),
      ]);
    } else {
      // When a specific module is selected, only include its fields
      setSelectedFields(fieldGroups[value].filter(field => field.selected));
    }
  };

  const handleFieldToggle = (field: ReportField) => {
    const isSelected = selectedFields.some(f => f.id === field.id);
    if (isSelected) {
      setSelectedFields(selectedFields.filter(f => f.id !== field.id));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const visibleFields = selectedModule === 'all'
    ? Object.values(fieldGroups).flat()
    : fieldGroups[selectedModule] || [];

  const handleGenerateReport = () => {
    toast({
      title: "Gerando relatório",
      description: `Relatório em formato ${reportFormat.toUpperCase()} sendo preparado para download.`,
    });

    // Simular download após um breve delay
    setTimeout(() => {
      toast({
        title: "Relatório pronto",
        description: "Seu relatório personalizado foi gerado com sucesso.",
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Gerador de Relatórios Personalizados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Report Settings */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Módulo</Label>
              <Select 
                value={selectedModule} 
                onValueChange={(value) => handleModuleChange(value as ModuleType | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Módulos</SelectItem>
                  <SelectItem value="import_full">Importação</SelectItem>
                  <SelectItem value="export_full">Exportação</SelectItem>
                  <SelectItem value="po_management">Pedidos de Compra</SelectItem>
                  <SelectItem value="shipment_management">Embarques</SelectItem>
                  <SelectItem value="payment_documents">Documentos de Pagamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Tabela</SelectItem>
                  <SelectItem value="chart">Gráfico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Período</Label>
              <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="lastQuarter">Último trimestre</SelectItem>
                  <SelectItem value="lastYear">Último ano</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Formato de Exportação</Label>
              <Select value={reportFormat} onValueChange={(value) => setReportFormat(value as ReportFormat)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Middle column: Field Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Campos do Relatório
            </h3>
            
            <div className="border rounded-md p-3 max-h-[300px] overflow-y-auto">
              {visibleFields.length > 0 ? (
                <div className="space-y-2">
                  {visibleFields.map(field => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={field.id}
                        checked={selectedFields.some(f => f.id === field.id)}
                        onCheckedChange={() => handleFieldToggle(field)}
                      />
                      <Label htmlFor={field.id} className="text-sm cursor-pointer">
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">
                  Selecione um módulo para ver os campos disponíveis
                </p>
              )}
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                {selectedFields.length} campo(s) selecionado(s)
              </p>
            </div>
          </div>

          {/* Right column: Preview and Generate */}
          <div className="space-y-6">
            <div className="border rounded-md p-4 h-[280px] bg-slate-50 flex flex-col items-center justify-center">
              {reportType === 'table' ? (
                <>
                  <Table className="h-16 w-16 text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-700">Visualização em Tabela</h3>
                  <p className="text-xs text-gray-500 mt-2 max-w-[200px] text-center">
                    Os dados serão apresentados em formato tabular com as colunas selecionadas
                  </p>
                </>
              ) : (
                <>
                  <BarChart2 className="h-16 w-16 text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-700">Visualização em Gráfico</h3>
                  <p className="text-xs text-gray-500 mt-2 max-w-[200px] text-center">
                    Os dados serão apresentados em formato gráfico conforme as seleções
                  </p>
                </>
              )}
            </div>
            
            <Button 
              className="w-full flex items-center justify-center gap-2" 
              onClick={handleGenerateReport}
              disabled={selectedFields.length === 0}
            >
              <FileDown className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomReportGenerator;
