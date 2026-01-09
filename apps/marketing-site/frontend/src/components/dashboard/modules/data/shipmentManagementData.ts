
import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Package, 
  AlertCircle 
} from 'lucide-react';
import { ModuleDashboardData, createIcon } from '../types';

export const shipmentManagementData: ModuleDashboardData = {
  statCards: [
    {
      title: "Embarques Ativos",
      value: 15,
      description: "4 em trânsito marítimo",
      icon: createIcon(Truck),
      color: "blue"
    },
    {
      title: "Desembaraços",
      value: 6,
      description: "Em análise aduaneira",
      icon: createIcon(ShieldCheck),
      color: "purple"
    },
    {
      title: "Containers",
      value: 28,
      description: "3 chegando esta semana",
      icon: createIcon(Package),
      color: "green"
    },
    {
      title: "Alertas",
      value: 5,
      description: "1 requer ação imediata",
      icon: createIcon(AlertCircle),
      color: "red"
    }
  ],
  showFullDashboard: false,
  mainAction: {
    text: 'Ver Embarques',
    path: '/logistics/cargo'
  }
};
