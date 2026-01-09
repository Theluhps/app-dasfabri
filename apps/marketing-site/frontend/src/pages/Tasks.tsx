import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock, CheckCircle2, AlertCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { tasksService, Task, TaskCreate, TaskUpdate } from '@/services/tasksService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Tasks: React.FC = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all');

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      let data: Task[];
      if (filter === 'pending') {
        data = await tasksService.getPendingTasks(100);
      } else if (filter === 'overdue') {
        data = await tasksService.getOverdueTasks(100);
      } else if (filter === 'completed') {
        data = await tasksService.listTasks({ status: 'completed', limit: 100 });
      } else {
        data = await tasksService.listTasks({ limit: 100 });
      }
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as tarefas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
      await tasksService.deleteTask(id);
      toast({
        title: 'Sucesso',
        description: 'Tarefa excluída com sucesso',
      });
      loadTasks();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a tarefa',
        variant: 'destructive',
      });
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await tasksService.completeTask(id);
      toast({
        title: 'Sucesso',
        description: 'Tarefa marcada como concluída',
      });
      loadTasks();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível completar a tarefa',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const taskData: TaskCreate | TaskUpdate = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      priority: (formData.get('priority') as any) || 'medium',
      task_type: (formData.get('task_type') as any) || 'other',
      due_date: new Date(formData.get('due_date') as string).toISOString(),
      process_id: formData.get('process_id') ? parseInt(formData.get('process_id') as string) : undefined,
      assigned_to: formData.get('assigned_to') ? parseInt(formData.get('assigned_to') as string) : undefined,
      notes: formData.get('notes') as string || undefined,
      is_urgent: formData.get('is_urgent') === 'on',
    };

    try {
      if (editingTask) {
        await tasksService.updateTask(editingTask.id, taskData as TaskUpdate);
        toast({
          title: 'Sucesso',
          description: 'Tarefa atualizada com sucesso',
        });
      } else {
        await tasksService.createTask(taskData as TaskCreate);
        toast({
          title: 'Sucesso',
          description: 'Tarefa criada com sucesso',
        });
      }
      setShowForm(false);
      loadTasks();
    } catch (error) {
      toast({
        title: 'Erro',
        description: editingTask ? 'Não foi possível atualizar a tarefa' : 'Não foi possível criar a tarefa',
        variant: 'destructive',
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <Badge className="bg-red-500">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Média</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-500">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluída</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Atrasada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Tarefas</h1>
            <p className="text-muted-foreground mt-2">
              Organize e acompanhe todas as suas tarefas em um só lugar
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                Todas
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
              >
                Pendentes
              </Button>
              <Button
                variant={filter === 'overdue' ? 'default' : 'outline'}
                onClick={() => setFilter('overdue')}
              >
                Atrasadas
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilter('completed')}
              >
                Concluídas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Tarefas */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Tarefas</CardTitle>
            <CardDescription>
              {tasks.length} {tasks.length === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#7E69AB]" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === 'all' ? 'Crie sua primeira tarefa para começar' : `Nenhuma tarefa ${filter === 'pending' ? 'pendente' : filter === 'overdue' ? 'atrasada' : 'concluída'}`}
                </p>
                {filter === 'all' && (
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Tarefa
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Processo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDate(task.due_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.process_id ? `#${task.process_id}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {task.status !== 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleComplete(task.id)}
                              title="Marcar como concluída"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(task)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(task.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Formulário de Tarefa */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
              </DialogTitle>
              <DialogDescription>
                {editingTask ? 'Atualize os dados da tarefa' : 'Preencha os dados para criar uma nova tarefa'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    defaultValue={editingTask?.title}
                    placeholder="Ex: Verificar documentação do processo"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingTask?.description}
                    placeholder="Descrição detalhada da tarefa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select name="priority" defaultValue={editingTask?.priority || 'medium'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="task_type">Tipo</Label>
                    <Select name="task_type" defaultValue={editingTask?.task_type || 'other'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Documento</SelectItem>
                        <SelectItem value="license">Licença</SelectItem>
                        <SelectItem value="logistics">Logística</SelectItem>
                        <SelectItem value="financial">Financeiro</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="administrative">Administrativo</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="due_date">Data de Vencimento *</Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="datetime-local"
                    required
                    defaultValue={editingTask?.due_date ? new Date(editingTask.due_date).toISOString().slice(0, 16) : ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="process_id">ID do Processo (opcional)</Label>
                    <Input
                      id="process_id"
                      name="process_id"
                      type="number"
                      defaultValue={editingTask?.process_id}
                      placeholder="Ex: 123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assigned_to">Atribuir a (opcional)</Label>
                    <Input
                      id="assigned_to"
                      name="assigned_to"
                      type="number"
                      defaultValue={editingTask?.assigned_to}
                      placeholder="ID do usuário"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    defaultValue={editingTask?.notes}
                    placeholder="Notas adicionais"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_urgent"
                    name="is_urgent"
                    defaultChecked={editingTask?.is_urgent}
                    className="rounded"
                  />
                  <Label htmlFor="is_urgent">Marcar como urgente</Label>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTask ? 'Atualizar' : 'Criar'} Tarefa
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default Tasks;

