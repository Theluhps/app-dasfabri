import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Search, Info, CheckCircle2, AlertCircle, Loader2, Package, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { classificationService, ClassificationRequest, ClassificationResponse, NCMInfo } from '@/services/classificationService';

const Classification: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClassificationRequest>({
    product_name: '',
    description: '',
    origin_country: '',
    weight: undefined,
    unit: '',
    category: '',
  });
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [ncmInfo, setNcmInfo] = useState<NCMInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchingNCM, setSearchingNCM] = useState(false);
  const [processId, setProcessId] = useState<string>('');
  const [processType, setProcessType] = useState<'import' | 'export'>('import');
  const [classifyingProcess, setClassifyingProcess] = useState(false);

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_name.trim()) {
      toast({
        title: 'Erro',
        description: 'O nome do produto é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setNcmInfo(null);
      
      const classification = await classificationService.classifyProduct(formData);
      setResult(classification);
      
      toast({
        title: 'Classificação concluída',
        description: `NCM sugerido: ${classification.ncm} (${classification.confidence}% de confiança)`,
      });
    } catch (error) {
      console.error('Erro ao classificar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível classificar o produto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchNCM = async (ncmCode: string) => {
    if (!ncmCode.trim()) return;

    try {
      setSearchingNCM(true);
      const info = await classificationService.getNCMInfo(ncmCode);
      setNcmInfo(info);
    } catch (error) {
      console.error('Erro ao buscar NCM:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar informações do NCM',
        variant: 'destructive',
      });
    } finally {
      setSearchingNCM(false);
    }
  };

  const handleClassifyProcess = async () => {
    if (!processId.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite o ID do processo',
        variant: 'destructive',
      });
      return;
    }

    try {
      setClassifyingProcess(true);
      const result = processType === 'import'
        ? await classificationService.classifyImportProcess(parseInt(processId))
        : await classificationService.classifyExportProcess(parseInt(processId));
      
      toast({
        title: 'Classificação concluída',
        description: `NCM: ${result.ncm}${result.confidence ? ` (${result.confidence}% confiança)` : ''}`,
      });
      
      // Buscar informações do NCM
      if (result.ncm) {
        await handleSearchNCM(result.ncm);
      }
    } catch (error) {
      console.error('Erro ao classificar processo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível classificar o processo',
        variant: 'destructive',
      });
    } finally {
      setClassifyingProcess(false);
    }
  };

  return (
    <PageLayout
      title="Classificação NCM"
      description="Classificação automática de produtos e consulta de códigos NCM"
      icon={Sparkles}
    >
      <div className="space-y-6">
        {/* Formulário de Classificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Classificar Produto
            </CardTitle>
            <CardDescription>
              Preencha as informações do produto para obter uma classificação NCM automática
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleClassify} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="product_name">Nome do Produto *</Label>
                  <Input
                    id="product_name"
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    placeholder="Ex: Notebook Dell Inspiron"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição detalhada do produto"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="origin_country">País de Origem</Label>
                  <Input
                    id="origin_country"
                    value={formData.origin_country}
                    onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })}
                    placeholder="Ex: China"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Eletrônicos"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="Ex: 2.5"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Ex: un, kg, m²"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Classificando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Classificar Produto
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resultado da Classificação */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Resultado da Classificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">NCM Sugerido</p>
                  <p className="text-2xl font-bold">{result.ncm}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Confiança</p>
                  <Badge className="text-lg px-3 py-1">
                    {result.confidence.toFixed(1)}%
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Descrição</Label>
                <p className="text-sm mt-1">{result.description}</p>
              </div>

              {result.alternatives && result.alternatives.length > 0 && (
                <div>
                  <Label>Alternativas</Label>
                  <div className="mt-2 space-y-2">
                    {result.alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{alt.ncm}</p>
                          <p className="text-sm text-muted-foreground">{alt.description}</p>
                        </div>
                        <Badge variant="outline">{alt.confidence.toFixed(1)}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSearchNCM(result.ncm)}
                  disabled={searchingNCM}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {searchingNCM ? 'Buscando...' : 'Consultar NCM'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      product_name: '',
                      description: '',
                      origin_country: '',
                      weight: undefined,
                      unit: '',
                      category: '',
                    });
                    setResult(null);
                    setNcmInfo(null);
                  }}
                >
                  Nova Classificação
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações do NCM */}
        {ncmInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Informações do NCM {ncmInfo.ncm}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Descrição</Label>
                <p className="text-sm mt-1">{ncmInfo.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Alíquota de Imposto</Label>
                  <p className="text-2xl font-bold text-red-500">{ncmInfo.tax_rate}%</p>
                </div>
                <div>
                  <Label>Requer Licença</Label>
                  <Badge variant={ncmInfo.requires_license ? 'destructive' : 'default'} className="mt-2">
                    {ncmInfo.requires_license ? 'Sim' : 'Não'}
                  </Badge>
                </div>
              </div>

              {ncmInfo.restrictions.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <Label className="mb-2 block">Restrições:</Label>
                    <ul className="list-disc list-inside space-y-1">
                      {ncmInfo.restrictions.map((restriction, idx) => (
                        <li key={idx} className="text-sm">{restriction}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Classificar Processo Existente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Classificar Processo Existente
            </CardTitle>
            <CardDescription>
              Classifique um processo de importação ou exportação existente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                <Button onClick={handleClassifyProcess} disabled={classifyingProcess}>
                  {classifyingProcess ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Classificando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Classificar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consulta Rápida de NCM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Consulta Rápida de NCM
            </CardTitle>
            <CardDescription>
              Digite um código NCM para obter informações detalhadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: 8471.30.12"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    handleSearchNCM(input.value);
                  }
                }}
              />
              <Button
                onClick={(e) => {
                  const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                  if (input) {
                    handleSearchNCM(input.value);
                  }
                }}
                disabled={searchingNCM}
              >
                {searchingNCM ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Classification;

