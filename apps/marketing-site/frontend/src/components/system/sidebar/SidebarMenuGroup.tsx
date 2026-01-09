
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/config/system/menuItems';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import SidebarSubmenu from './SidebarSubmenu';

interface MenuGroupProps {
  item: MenuItem;
  openSubmenu: string | null;
  handleSubmenuToggle: (title: string) => void;
  getFilteredSubmenu: (submenu: MenuItem[]) => MenuItem[];
}

const SidebarMenuGroup: React.FC<MenuGroupProps> = ({ 
  item, 
  openSubmenu, 
  handleSubmenuToggle, 
  getFilteredSubmenu 
}) => {
  const location = useLocation();

  const isActiveGroup = (submenu: MenuItem[] | undefined) => {
    if (!submenu) return false;
    return submenu.some(item => location.pathname.startsWith(item.path?.split('/').slice(0, 2).join('/') || ''));
  };

  return (
    <Collapsible 
      key={item.title}
      open={openSubmenu === item.title || isActiveGroup(item.submenu)}
      onOpenChange={() => handleSubmenuToggle(item.title)}
    >
      <CollapsibleTrigger asChild>
        <button 
          className={cn(
            "flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-gray-100",
            (openSubmenu === item.title || isActiveGroup(item.submenu)) ? "text-dasfabri-blue" : "text-gray-700"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
          <span className="ml-auto">
            {openSubmenu === item.title || isActiveGroup(item.submenu) ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
        </button>
      </CollapsibleTrigger>
      
      {item.submenu && (
        <SidebarSubmenu 
          submenu={item.submenu} 
          getFilteredSubmenu={getFilteredSubmenu} 
        />
      )}
    </Collapsible>
  );
};

export default SidebarMenuGroup;
