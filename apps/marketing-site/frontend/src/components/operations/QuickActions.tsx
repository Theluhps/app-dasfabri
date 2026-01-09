import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { 
  FileUp, 
  FileCheck, 
  Package, 
  Clipboard, 
  Truck, 
  DollarSign, 
  FileText, 
  Calendar, 
  AlertCircle, 
  Search 
} from 'lucide-react';

interface ActionProps {
  icon: React.ReactElement;
  label: string;
  onClick: () => void;
  color: string;
  href?: string;
}

const QuickActions = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const handleAction = (actionName: string, href?: string) => {
    if (href) {
      navigate(href);
    } else {
      toast({
        title: "Ação iniciada",
        description: `A ação "${actionName}" foi iniciada com sucesso.`,
      });
    }
  };

  const actions: ActionProps[] = [
    {
      icon: <Package />,
      label: "Novo Processo",
      onClick: () => handleAction("Novo Processo", "/import/processes-advanced"),
      href: "/import/processes-advanced",
      color: "bg-[#7E69AB]/10 text-[#7E69AB]"
    },
    {
      icon: <FileUp />,
      label: "Upload de Docs",
      onClick: () => handleAction("Upload de Documentos", "/import/documents"),
      href: "/import/documents",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: <FileCheck />,
      label: "Verificar Docs",
      onClick: () => handleAction("Verificação de Documentos", "/import/documents"),
      href: "/import/documents",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: <Clipboard />,
      label: "Licenças",
      onClick: () => handleAction("Licenças", "/import/licenses"),
      href: "/import/licenses",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: <Truck />,
      label: "Logística",
      onClick: () => handleAction("Logística", "/logistics/containers"),
      href: "/logistics/containers",
      color: "bg-amber-100 text-amber-700"
    },
    {
      icon: <DollarSign />,
      label: "Financeiro",
      onClick: () => handleAction("Financeiro", "/financial/dashboard"),
      href: "/financial/dashboard",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      icon: <FileText />,
      label: "Relatórios",
      onClick: () => handleAction("Relatórios", "/analytics/advanced"),
      href: "/analytics/advanced",
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      icon: <Calendar />,
      label: "Agendamentos",
      onClick: () => handleAction("Agendamentos", "/dashboard/calendar"),
      href: "/dashboard/calendar",
      color: "bg-rose-100 text-rose-700"
    },
    {
      icon: <AlertCircle />,
      label: "Pendências",
      onClick: () => handleAction("Pendências", "/import/processes?status=pendencias"),
      href: "/import/processes?status=pendencias",
      color: "bg-orange-100 text-orange-700"
    },
    {
      icon: <Search />,
      label: "Rastreamento",
      onClick: () => handleAction("Rastreamento", "/logistics/cargo"),
      href: "/logistics/cargo",
      color: "bg-cyan-100 text-cyan-700"
    },
  ];

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <CardTitle className={isDark ? 'text-gray-100' : ''}>
          Ações Operacionais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto py-3 px-2 flex flex-col items-center justify-center gap-2 ${isDark ? 'border-gray-700 hover:bg-gray-700' : ''} cursor-pointer`}
              onClick={action.onClick}
            >
              <div className={`rounded-full p-2 ${action.color}`}>
                {React.cloneElement(action.icon, { className: "h-5 w-5" })}
              </div>
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
