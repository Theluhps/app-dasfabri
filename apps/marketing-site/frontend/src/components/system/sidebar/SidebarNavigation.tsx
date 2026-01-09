import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useModule } from '@/contexts/ModuleContext';
import { MenuItem } from '@/config/system/menuItems';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarMenuGroup from './SidebarMenuGroup';

interface SidebarNavigationProps {
  menuItems: MenuItem[];
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ menuItems }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const { currentModule, hasAccessToRoute, isAdmin, isManager } = useModule();

  // Use effect to keep the submenu open if we're on a route inside it
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find which menu group contains the current path
    menuItems.forEach(item => {
      if (item.submenu) {
        const hasActivePath = item.submenu.some(subItem => 
          currentPath.startsWith(subItem.path?.split('/').slice(0, 3).join('/') || '')
        );
        
        if (hasActivePath) {
          setOpenSubmenu(item.title);
        }
      }
    });
  }, [location.pathname, menuItems]);

  const handleSubmenuToggle = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Filter menu items based on the current module and user role
  const filteredMenuItems = menuItems.filter(item => {
    // Admin and managers can see all menu items
    if (isAdmin || isManager) return true;

    // For regular users, check if the menu item is applicable to current module
    if (item.modules && !item.modules.includes(currentModule)) {
      return false;
    }
    
    // Also check if they have access to the path
    if (item.path) {
      return hasAccessToRoute(item.path);
    }
    
    // For items with submenus, check if any subitem path is allowed
    if (item.submenu) {
      return item.submenu.some(subItem => 
        (!subItem.modules || subItem.modules.includes(currentModule)) && 
        subItem.path && hasAccessToRoute(subItem.path)
      );
    }
    
    return true;
  });

  // Also filter submenus
  const getFilteredSubmenu = (submenu: MenuItem[]): MenuItem[] => {
    // Admin and managers can see all submenu items
    if (isAdmin || isManager) return submenu;
    
    // For regular users, filter based on module and access
    return submenu.filter(item => 
      (!item.modules || item.modules.includes(currentModule)) && 
      item.path && hasAccessToRoute(item.path)
    );
  };

  return (
    <nav className="p-4 flex flex-col space-y-1">
      {filteredMenuItems.map((item) => (
        item.submenu ? (
          <SidebarMenuGroup
            key={item.title}
            item={item}
            openSubmenu={openSubmenu}
            handleSubmenuToggle={handleSubmenuToggle}
            getFilteredSubmenu={getFilteredSubmenu}
          />
        ) : (
          <SidebarMenuItem 
            key={item.title}
            item={item}
            isActive={isActive}
          />
        )
      ))}
    </nav>
  );
};

export default SidebarNavigation;
