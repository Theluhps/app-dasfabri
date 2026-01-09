
import React from 'react';
import { 
  Package, 
  ShieldCheck, 
  Truck, 
  AlertCircle 
} from 'lucide-react';
import { ModuleDashboardData, createIcon } from '../types';

export const poManagementData: ModuleDashboardData = {
  statCards: [
    {
      title: "Pedidos Ativos",
      value: 18,
      description: "+3 novos pedidos esta semana",
      icon: createIcon(Package),
      color: "blue"
    },
    {
      title: "Pedidos em Aprovação",
      value: 5,
      description: "Aguardando aprovação",
      icon: createIcon(ShieldCheck),
      color: "purple"
    },
    {
      title: "Pedidos Embarcados",
      value: 9,
      description: "2 chegando esta semana",
      icon: createIcon(Truck),
      color: "green"
    },
    {
      title: "Alertas",
      value: 4,
      description: "2 requerem ação imediata",
      icon: createIcon(AlertCircle),
      color: "red"
    }
  ],
  showFullDashboard: false,
  mainAction: {
    text: 'Gerenciar Pedidos',
    path: '/po/orders'
  }
};
