
import React from 'react';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { ModuleDashboardData, createIcon } from '../types';

export const paymentDocumentsData: ModuleDashboardData = {
  statCards: [
    {
      title: "Notas Fiscais",
      value: 32,
      description: "12 emitidas esta semana",
      icon: createIcon(FileText),
      color: "blue"
    },
    {
      title: "Pagamentos Pendentes",
      value: "$280k",
      description: "6 faturas para aprovar",
      icon: createIcon(DollarSign),
      color: "amber"
    },
    {
      title: "Câmbio Realizado",
      value: "$850k",
      description: "+5% em relação ao mês anterior",
      icon: createIcon(TrendingUp),
      color: "green"
    },
    {
      title: "Alertas",
      value: 3,
      description: "2 requerem ação imediata",
      icon: createIcon(AlertCircle),
      color: "red"
    }
  ],
  showFullDashboard: false,
  mainAction: {
    text: 'Gerenciar Documentos Financeiros',
    path: '/financial/payments'
  }
};
