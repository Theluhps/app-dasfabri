
import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import DasfabriLogo from '@/components/DasfabriLogo';
import { useTheme } from '@/hooks/use-theme';

interface SidebarHeaderProps {
  setIsSidebarOpen?: (open: boolean) => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ setIsSidebarOpen }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-between h-16 px-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <DasfabriLogo 
          variant={theme === 'dark' ? 'white' : 'default'} 
          className="h-8" 
          size="md"
        />
      </div>
      
      {setIsSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="sm:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SidebarHeader;
