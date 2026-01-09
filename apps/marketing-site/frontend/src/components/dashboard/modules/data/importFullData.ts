
import React from 'react';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
import { ModuleDashboardData, createIcon } from '../types';

export const importFullData: ModuleDashboardData = {
  statCards: [
    {
      title: "Total de Processos",
      value: 156,
      description: "+12% em relação ao mês passado",
      icon: createIcon(Package),
      color: "blue",
      href: "/import/processes"
    },
    {
      title: "Processos Liberados",
      value: 89,
      description: "+5% em relação ao mês passado",
      icon: createIcon(TrendingUp),
      color: "green",
      href: "/import/processes?status=liberado"
    },
    {
      title: "Em Trânsito",
      value: 32,
      description: "12 chegando esta semana",
      icon: createIcon(TrendingUp),
      color: "purple",
      href: "/import/processes?status=em_transito"
    },
    {
      title: "Pendências",
      value: 14,
      description: "3 críticas requerem atenção",
      icon: createIcon(AlertCircle),
      color: "red",
      href: "/import/processes?status=pendencias"
    }
  ],
  showFullDashboard: true,
  mainAction: {
    text: 'Ver Processos de Importação',
    path: '/import/processes'
  }
};
