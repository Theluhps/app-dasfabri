
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/config/system/menuItems';

interface MenuItemProps {
  item: MenuItem;
  isActive: (path: string) => boolean;
}

const SidebarMenuItem: React.FC<MenuItemProps> = ({ item, isActive }) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(item.path || '/')}
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-gray-100",
        isActive(item.path || '') 
          ? "bg-gray-100 text-dasfabri-blue" 
          : "text-gray-700"
      )}
    >
      <item.icon className="mr-2 h-4 w-4" />
      <span>{item.title}</span>
    </button>
  );
};

export default SidebarMenuItem;
