import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CheckCircle2, Clock, XCircle, FileText, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface DrawbackAct {
  id: number;
  act_number: string;
  act_type: string;
  status: string;
  description: string;
  total_value: number;
  currency: string;
  created_at: string;
}

interface DrawbackCredit {
  id: number;
  credit_number: string;
  value: number;
  used_value: number;
  available_value: number;
  is_active: boolean;
  generated_at: string;
}

const DrawbackManagement: React.FC = () => {
  const [acts, setActs] = useState<DrawbackAct[]>([]);
  const [credits, setCredits] = useState<DrawbackCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActForm, setShowActForm] = useState(false);
  const { toast } = useToast();

  const fetchActs = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/v1/drawback/acts', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActs(data);
      } else {
        console.warn('Erro ao buscar atos:', response.status);
      }
    } catch (error: any) {
      console.warn('Erro ao buscar atos (backend pode não estar disponível):', error.message);
      // Não bloquear a interface, apenas logar o erro
    }
  };

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/v1/drawback/credits', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data);
      } else {
        console.warn('Erro ao buscar créditos:', response.status);
      }
    } catch (error: any) {
      console.warn('Erro ao buscar créditos (backend pode não estar disponível):', error.message);
      // Não bloquear a interface, apenas logar o erro
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchActs(), fetchCredits()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: 'outline',
      submitted: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      cancelled: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Drawback</h2>
          <p className="text-muted-foreground">
            Gerencie atos de drawback e créditos
          </p>
        </div>
        <Dialog open={showActForm} onOpenChange={setShowActForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Ato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Ato de Drawback</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo ato de drawback
              </DialogDescription>
            </DialogHeader>
            <DrawbackActForm onSuccess={() => {
              fetchActs();
              setShowActForm(false);
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="acts" className="w-full">
        <TabsList>
          <TabsTrigger value="acts">Atos de Drawback</TabsTrigger>
          <TabsTrigger value="credits">Créditos</TabsTrigger>
        </TabsList>

        <TabsContent value="acts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atos de Drawback</CardTitle>
              <CardDescription>
                Lista de todos os atos de drawback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acts.map((act) => (
                    <TableRow key={act.id}>
                      <TableCell className="font-medium">{act.act_number}</TableCell>
                      <TableCell>{act.act_type}</TableCell>
                      <TableCell>{getStatusBadge(act.status)}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: act.currency
                        }).format(act.total_value)}
                      </TableCell>
                      <TableCell>
                        {new Date(act.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Ver Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Créditos de Drawback</CardTitle>
              <CardDescription>
                Créditos gerados a partir de atos aprovados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Usado</TableHead>
                    <TableHead>Disponível</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credits.map((credit) => (
                    <TableRow key={credit.id}>
                      <TableCell className="font-medium">{credit.credit_number}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(credit.value)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(credit.used_value)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(credit.available_value)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={credit.is_active ? 'default' : 'secondary'}>
                          {credit.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(credit.generated_at).toLocaleDateString('pt-BR')}
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
  );
};

const DrawbackActForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    act_type: 'exemption',
    description: '',
    total_value: '',
    currency: 'BRL'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/drawback/acts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          total_value: parseFloat(formData.total_value)
        })
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Ato de drawback criado com sucesso'
        });
        onSuccess();
      } else {
        throw new Error('Erro ao criar ato');
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o ato de drawback',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Tipo de Ato</Label>
        <Select value={formData.act_type} onValueChange={(value) => setFormData({ ...formData, act_type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="suspension">Suspensão</SelectItem>
            <SelectItem value="exemption">Isenção</SelectItem>
            <SelectItem value="refund">Restituição</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Valor Total</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.total_value}
            onChange={(e) => setFormData({ ...formData, total_value: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Moeda</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">BRL</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full">Criar Ato</Button>
    </form>
  );
};

export default DrawbackManagement;

