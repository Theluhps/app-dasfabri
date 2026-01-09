
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useModule } from '@/contexts/ModuleContext';
import { useTheme } from '@/hooks/use-theme';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarFooter from './sidebar/SidebarFooter';
import SidebarModuleSelector from './sidebar/SidebarModuleSelector';
import SidebarItems from './sidebar/SidebarItems';
import SidebarToggle from './sidebar/SidebarToggle';
import SidebarOverlay from './sidebar/SidebarOverlay';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { theme } = useTheme();
  const { currentModule, moduleColor, isAdmin } = useModule();
  const [activeRoute, setActiveRoute] = useState('');
  const isDark = theme === 'dark';

  // Update active route based on window location
  useEffect(() => {
    setActiveRoute(window.location.pathname);
  }, []);

  // Garante que o Sidebar esteja sempre visível, com z-index elevado
  return (
    <>
      {/* Fixed sidebar with transition */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'w-64' : 'w-0 sm:w-20',
          isDark ? 'bg-gray-900 text-white' : 'bg-white border-r'
        )}
      >
        {/* Sidebar Header with Logo */}
        <SidebarHeader setIsSidebarOpen={setIsSidebarOpen} />

        {/* Module Selector */}
        {isSidebarOpen && <SidebarModuleSelector />}

        {/* Sidebar Menu */}
        <div 
          className="h-full px-3 py-3 overflow-y-auto no-scrollbar"
          style={{maxHeight: "calc(100vh - 130px)"}}
        >
          <SidebarItems
            activeRoute={activeRoute}
            isSidebarOpen={isSidebarOpen}
            isDark={isDark}
            moduleColor={moduleColor}
            isAdmin={isAdmin}
          />
        </div>

        {/* Sidebar Footer */}
        <SidebarFooter isSidebarOpen={isSidebarOpen} isDark={isDark} />
      </aside>

      {/* Content overlay to accommodate sidebar on mobile */}
      <SidebarOverlay 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Toggle Button for mobile */}
      <SidebarToggle 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
};

export default Sidebar;
