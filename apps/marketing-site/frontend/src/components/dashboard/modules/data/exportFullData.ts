
import React from 'react';
import { 
  Package, 
  TrendingUp, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { ModuleDashboardData, createIcon } from '../types';

export const exportFullData: ModuleDashboardData = {
  statCards: [
    {
      title: "Exportações Ativas",
      value: 12,
      description: "+1 novo processo esta semana",
      icon: createIcon(Package),
      color: "blue"
    },
    {
      title: "Valor em Trânsito",
      value: "$950k",
      description: "+8% em relação ao mês anterior",
      icon: createIcon(TrendingUp),
      color: "green"
    },
    {
      title: "Documentos Pendentes",
      value: 15,
      description: "4 requerem ação imediata",
      icon: createIcon(FileText),
      color: "indigo"
    },
    {
      title: "Alertas",
      value: 6,
      description: "2 requerem ação imediata",
      icon: createIcon(AlertCircle),
      color: "red"
    }
  ],
  showFullDashboard: false,
  mainAction: {
    text: 'Ver Processos de Exportação',
    path: '/export/processes'
  }
};
