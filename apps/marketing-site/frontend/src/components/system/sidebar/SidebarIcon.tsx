
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Ship, 
  DollarSign, 
  FileText, 
  Settings, 
  Bell, 
  History, 
  Boxes, 
  ArrowRightLeft,
  ClipboardList,
  BarChart3
} from 'lucide-react';

// Define the Workflow icon since it's not in lucide-react
export const Workflow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-workflow">
    <rect width="8" height="8" x="3" y="3" rx="2" />
    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
    <rect width="8" height="8" x="13" y="13" rx="2" />
  </svg>
);
