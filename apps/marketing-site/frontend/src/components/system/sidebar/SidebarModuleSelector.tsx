
import React from 'react';
import { useModule } from '@/contexts/ModuleContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MODULES } from '@/types/modules';

const SidebarModuleSelector: React.FC = () => {
  const { currentModule, moduleColor } = useModule();
  const navigate = useNavigate();
  
  // Get the module name from the MODULES object using currentModule
  const moduleName = MODULES[currentModule]?.name || 'Select Module';

  const handleSelectModules = () => {
    navigate('/modules');
  };

  return (
    <div className="px-3 pt-3 pb-1">
      <Button
        variant="outline" 
        className={cn(
          "w-full justify-start text-left font-normal border border-gray-200 dark:border-gray-700",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
        )}
        onClick={handleSelectModules}
      >
        <div 
          className="mr-2 h-2.5 w-2.5 rounded-full" 
          style={{ backgroundColor: moduleColor }}
        ></div>
        <span className="truncate">{moduleName}</span>
      </Button>
    </div>
  );
};

export default SidebarModuleSelector;
