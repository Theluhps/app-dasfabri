import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, Search, CheckCircle2, XCircle, Clock, 
  FileCheck, RefreshCw, Loader2, AlertCircle, Info 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { customsService, CustomsClearanceStatus, CustomsValidation, SiscomexIntegration } from '@/services/customsService';

const Customs: React.FC = () => {
  const { toast } = useToast();
  const [processId, setProcessId] = useState<string>('');
  const [processType, setProcessType] = useState<'import' | 'export'>('import');
  const [status, setStatus] = useState<CustomsClearanceStatus | null>(null);
  const [validation, setValidation] = useState<CustomsValidation | null>(null);
  const [siscomexData, setSiscomexData] = useState<SiscomexIntegration | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [duimpSearch, setDuimpSearch] = useState('');

  const handleGetStatus = async () => {
    if (!processId.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite o ID do processo',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const data = await customsService.getCustomsStatus(parseInt(processId), processType);
      setStatus(data);
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar o status do processo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!processId.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite o ID do processo',
        variant: 'destructive',
      });
      return;
    }

    try {
      setValidating(true);
      const data = await customsService.validateDocuments(parseInt(processId), processType);
      setValidation(data);
      
      if (data.is_valid) {
        toast({
          title: 'Validação bem-sucedida',
          description: 'Todos os documentos estão válidos',
        });
      } else {
        toast({
          title: 'Validação com erros',
          description: `${data.errors.length} erro(s) encontrado(s)`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao validar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível validar os documentos',
        variant: 'destructive',
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!processId.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite o ID do processo',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm('Tem certeza que deseja submeter este processo à alfândega?')) {
      return;
    }

    try {
      setSubmitting(true);
      const result = await customsService.submitToCustoms(parseInt(processId), processType);
      toast({
        title: 'Sucesso',
        description: result.message,
      });
      // Recarregar status
      await handleGetStatus();
    } catch (error) {
      console.error('Erro ao submeter:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível submeter o processo',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchSiscomex = async () => {
    if (!duimpSearch.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite o número DUIMP',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const data = await customsService.getSiscomexStatus(duimpSearch);
      setSiscomexData(data);
    } catch (error) {
      console.error('Erro ao buscar Siscomex:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar informações do Siscomex',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSiscomex = async () => {
    if (!duimpSearch.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite o número DUIMP',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const data = await customsService.syncWithSiscomex(duimpSearch);
      setSiscomexData(data);
      toast({
        title: 'Sincronização concluída',
        description: 'Dados atualizados do Siscomex',
      });
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível sincronizar com o Siscomex',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'in_analysis':
        return <Badge className="bg-yellow-500">Em Análise</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PageLayout
      title="Alfândega Avançada"
      description="Gestão de desembaraço aduaneiro e integração com Siscomex"
      icon={Building2}
    >
      <div className="space-y-6">
        {/* Consulta de Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Consultar Status de Desembaraço
            </CardTitle>
            <CardDescription>
              Verifique o status de desembaraço de um processo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="ID do Processo"
                value={processId}
                onChange={(e) => setProcessId(e.target.value)}
                className="flex-1"
              />
              <Select value={processType} onValueChange={(value: 'import' | 'export') => setProcessType(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">Importação</SelectItem>
                  <SelectItem value="export">Exportação</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleGetStatus} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status do Processo */}
        {status && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Status do Processo #{status.process_id}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(status.status)}</div>
                </div>
                {status.duimp_number && (
                  <div>
                    <Label>Número DUIMP</Label>
                    <p className="font-mono text-sm mt-1">{status.duimp_number}</p>
                  </div>
                )}
                {status.customs_broker && (
                  <div>
                    <Label>Despachante</Label>
                    <p className="text-sm mt-1">{status.customs_broker}</p>
                  </div>
                )}
                <div>
                  <Label>Tipo</Label>
                  <Badge variant="outline" className="mt-1">
                    {status.process_type === 'import' ? 'Importação' : 'Exportação'}
                  </Badge>
                </div>
                {status.submitted_at && (
                  <div>
                    <Label>Submetido em</Label>
                    <p className="text-sm mt-1">{formatDate(status.submitted_at)}</p>
                  </div>
                )}
                {status.cleared_at && (
                  <div>
                    <Label>Desembarado em</Label>
                    <p className="text-sm mt-1">{formatDate(status.cleared_at)}</p>
                  </div>
                )}
              </div>

              {status.issues.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <Label className="mb-2 block">Problemas encontrados:</Label>
                    <ul className="list-disc list-inside space-y-1">
                      {status.issues.map((issue, idx) => (
                        <li key={idx} className="text-sm">{issue}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {status.status === 'pending' && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Este processo está aguardando submissão à alfândega. Valide os documentos antes de submeter.
                  </AlertDescription>
                </Alert>
              )}

              {status.status === 'in_analysis' && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Este processo está em análise pela alfândega. Acompanhe o status regularmente.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleValidate} disabled={validating}>
                  {validating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4 mr-2" />
                      Validar Documentos
                    </>
                  )}
                </Button>
                {status.status === 'pending' && (
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submetendo...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Submeter à Alfândega
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validação de Documentos */}
        {validation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validation.is_valid ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Validação de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={validation.is_valid ? 'default' : 'destructive'}>
                  {validation.is_valid ? 'Válido' : 'Inválido'}
                </Badge>
                {validation.errors.length > 0 && (
                  <span className="text-sm text-red-500">
                    {validation.errors.length} erro(s)
                  </span>
                )}
                {validation.warnings.length > 0 && (
                  <span className="text-sm text-yellow-500">
                    {validation.warnings.length} aviso(s)
                  </span>
                )}
              </div>

              {validation.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <Label className="mb-2 block">Erros:</Label>
                    <ul className="list-disc list-inside space-y-1">
                      {validation.errors.map((error, idx) => (
                        <li key={idx} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {validation.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <Label className="mb-2 block">Avisos:</Label>
                    <ul className="list-disc list-inside space-y-1">
                      {validation.warnings.map((warning, idx) => (
                        <li key={idx} className="text-sm">{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {validation.required_documents.length > 0 && (
                <div>
                  <Label>Documentos Obrigatórios</Label>
                  <div className="mt-2 space-y-1">
                    {validation.required_documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validation.missing_documents.length > 0 && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <Label className="mb-2 block">Documentos Faltando ({validation.missing_documents.length}):</Label>
                    <ul className="list-disc list-inside space-y-1">
                      {validation.missing_documents.map((doc, idx) => (
                        <li key={idx} className="text-sm font-medium">{doc}</li>
                      ))}
                    </ul>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Adicione os documentos faltantes antes de submeter o processo.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {validation.is_valid && validation.errors.length === 0 && validation.missing_documents.length === 0 && (
                <Alert className="border-green-500">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    <p className="font-medium text-green-700 dark:text-green-400">
                      Todos os documentos estão válidos e presentes. O processo pode ser submetido à alfândega.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Integração Siscomex */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Integração com Siscomex
            </CardTitle>
            <CardDescription>
              Consulte e sincronize dados com o sistema Siscomex
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Número DUIMP"
                value={duimpSearch}
                onChange={(e) => setDuimpSearch(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearchSiscomex} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" onClick={handleSyncSiscomex} disabled={loading}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {siscomexData && (
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>DUIMP</Label>
                    <p className="font-mono text-lg font-bold">{siscomexData.duimp_number}</p>
                  </div>
                  <Badge variant={siscomexData.status === 'approved' ? 'default' : siscomexData.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {siscomexData.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Última Atualização</Label>
                    <p className="text-sm font-medium">{formatDate(siscomexData.last_update)}</p>
                  </div>
                  <div>
                    <Label>Status Siscomex</Label>
                    <p className="text-sm font-medium">{siscomexData.status}</p>
                  </div>
                </div>
                {Object.keys(siscomexData.details).length > 0 && (
                  <div>
                    <Label>Detalhes da Integração</Label>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <pre className="text-xs overflow-auto max-h-48">
                        {JSON.stringify(siscomexData.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Customs;

