
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarFooterProps {
  isSidebarOpen?: boolean;
  isDark?: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ 
  isSidebarOpen = true,
  isDark = false
}) => {
  return (
    <div className={cn(
      "absolute bottom-0 left-0 w-full border-t p-3",
      isDark ? "border-gray-700" : "border-gray-200",
    )}>
      {isSidebarOpen ? (
        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
          <p>v1.5.0 • Dasfabri Enterprise</p>
        </div>
      ) : (
        <div className="text-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
