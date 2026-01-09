
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem } from '@/config/system/menuItems';
import { cn } from '@/lib/utils';
import { CollapsibleContent } from '@/components/ui/collapsible';

interface SidebarSubmenuProps {
  submenu: MenuItem[];
  getFilteredSubmenu: (submenu: MenuItem[]) => MenuItem[];
}

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({ 
  submenu,
  getFilteredSubmenu 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <CollapsibleContent>
      <div className="ml-4 mt-1 flex flex-col pl-2 border-l border-gray-200">
        {getFilteredSubmenu(submenu).map((subItem) => (
          <button 
            key={subItem.title}
            onClick={() => navigate(subItem.path || '/')}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100",
              isActive(subItem.path || '') 
                ? "bg-gray-100 text-dasfabri-blue font-medium" 
                : "text-gray-600"
            )}
          >
            <subItem.icon className="mr-2 h-4 w-4" />
            <span>{subItem.title}</span>
          </button>
        ))}
      </div>
    </CollapsibleContent>
  );
};

export default SidebarSubmenu;
