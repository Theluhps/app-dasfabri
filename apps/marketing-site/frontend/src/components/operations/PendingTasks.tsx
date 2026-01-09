import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Clock, FileCheck, FileText, AlertCircle, Truck, DollarSign, Loader2 } from 'lucide-react';
import { tasksService, Task } from '@/services/tasksService';

const PendingTasks = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksService.getPendingTasks(10);
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id: number, title: string) => {
    try {
      await tasksService.completeTask(id);
      setCompletedTasks(prev => [...prev, id]);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Tarefa completada",
        description: `A tarefa "${title}" foi marcada como concluída.`,
        variant: "default",
      });
      loadTasks(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível completar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    if (task.process_id) {
      navigate(`/import/process/${task.process_id}`);
    } else {
      switch (task.task_type) {
        case 'document':
          navigate('/import/documents');
          break;
        case 'license':
          navigate('/import/licenses');
          break;
        case 'logistics':
          navigate('/logistics/containers');
          break;
        case 'financial':
          navigate('/financial/payments');
          break;
        default:
          navigate('/operations');
      }
    }
  };

  const handleViewAll = () => {
    navigate('/tasks');
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) {
      return `Atrasado ${Math.abs(days)} ${Math.abs(days) === 1 ? 'dia' : 'dias'}`;
    } else if (days === 0) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Amanhã, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'license':
        return <FileCheck className="h-4 w-4 text-purple-500" />;
      case 'logistics':
        return <Truck className="h-4 w-4 text-amber-500" />;
      case 'financial':
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const activeTasks = tasks.filter(task => !completedTasks.includes(task.id));

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={isDark ? 'text-gray-100' : ''}>
              Tarefas Pendentes
            </CardTitle>
            <CardDescription className={isDark ? 'text-gray-400' : ''}>
              {loading ? 'Carregando...' : `Você tem ${activeTasks.length} tarefas pendentes`}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={handleViewAll}
          >
            <CheckCircle2 className="h-4 w-4" /> Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#7E69AB]" />
          </div>
        ) : activeTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">Nenhuma tarefa pendente</p>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {activeTasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => handleTaskClick(task)}
                  className={`px-6 py-3 ${task.is_urgent || task.status === 'overdue' ? (isDark ? 'bg-red-900/10' : 'bg-red-50') : ''} flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">
                      {getTypeIcon(task.task_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDueDate(task.due_date)}
                        </div>
                        {task.process_id && (
                          <div className="text-xs text-muted-foreground">
                            Processo: {task.process_id}
                          </div>
                        )}
                        <div>
                          {getPriorityBadge(task.priority)}
                        </div>
                        {task.status === 'overdue' && (
                          <Badge variant="destructive" className="text-xs">
                            Atrasado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteTask(task.id, task.title);
                    }}
                  >
                    Concluir
                  </Button>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 text-center">
              <Button variant="link" className="text-sm" onClick={handleViewAll}>
                Ver todas as tarefas
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTasks;
