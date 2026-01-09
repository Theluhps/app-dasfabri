
import React from 'react';

export interface StatCardData {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'amber' | 'indigo' | 'emerald';
  href?: string;
}

export interface ModuleDashboardData {
  statCards: StatCardData[];
  showFullDashboard: boolean;
  mainAction: {
    text: string;
    path: string;
  };
}

// Helper function to create icons consistently without JSX
export const createIcon = (IconComponent: React.ComponentType<any>) => 
  React.createElement(IconComponent, { size: 18 });
