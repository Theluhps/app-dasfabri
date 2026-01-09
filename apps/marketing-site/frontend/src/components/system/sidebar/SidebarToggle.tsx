
import React from 'react';
import { ArrowLeftCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ 
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  return (
    <button
      className={cn(
        "sm:hidden fixed bottom-4 right-4 bg-[#7E69AB] text-white rounded-full p-3 shadow-lg z-50",
        isSidebarOpen && 'translate-x-0 rotate-180'
      )}
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <ArrowLeftCircle className="h-6 w-6" />
    </button>
  );
};

export default SidebarToggle;
