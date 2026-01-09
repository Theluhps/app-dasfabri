
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { menuItems } from '@/config/system/menuItems';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useModule } from '@/contexts/ModuleContext';

interface SidebarItemsProps {
  activeRoute: string;
  isSidebarOpen: boolean;
  isDark: boolean;
  moduleColor: string;
  isAdmin: boolean;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ 
  activeRoute,
  isSidebarOpen,
  isDark,
  moduleColor,
  isAdmin
}) => {
  // Track open/closed state for each submenu
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { currentModule } = useModule();

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  // Filtra itens do menu baseado no módulo atual e permissões
  const getFilteredMenuItems = () => {
    // Filtro básico para itens do menu principal
    const filteredItems = menuItems.filter(item => {
      // Verifica se o item tem restrição de módulo
      if (item.modules && !item.modules.includes(currentModule)) {
        return false;
      }
      return true;
    });
    
    return filteredItems;
  };

  // Renderiza um item de menu (link direto ou submenu)
  const renderMenuItem = (item: any, index: number) => {
    if (item.path && !item.submenu) {
      return (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) => cn(
            "flex items-center rounded-md px-3 py-2 transition-colors",
            isSidebarOpen ? "justify-start" : "justify-center",
            isActive ? 
              `bg-${moduleColor}/10 font-medium text-${moduleColor}` : 
              isDark ? "text-gray-300 hover:text-white hover:bg-gray-800" : 
                      "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
          )}
          title={!isSidebarOpen ? item.title : undefined}
        >
          <item.icon className={cn(
            "shrink-0", 
            isSidebarOpen ? "mr-2 h-5 w-5" : "h-6 w-6"
          )} />
          {isSidebarOpen && <span>{item.title}</span>}
        </NavLink>
      );
    } else if (item.submenu) {
      return (
        <div key={index} className="space-y-1">
          <button 
            className={cn(
              "flex items-center w-full rounded-md px-3 py-2",
              isSidebarOpen ? "justify-between" : "justify-center",
              isDark ? "text-gray-300 hover:text-white hover:bg-gray-800" : 
                     "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            )}
            onClick={() => isSidebarOpen && toggleSubmenu(item.title)}
          >
            <div className="flex items-center">
              <item.icon className={cn(
                "shrink-0", 
                isSidebarOpen ? "mr-2 h-5 w-5" : "h-6 w-6"
              )} />
              {isSidebarOpen && <span>{item.title}</span>}
            </div>
            {isSidebarOpen && (
              openSubmenus[item.title] ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {isSidebarOpen && (openSubmenus[item.title] || false) && (
            <ul className="pl-8 space-y-1">
              {item.submenu.map((subItem: any, subIndex: number) => (
                <li key={subIndex}>
                  <NavLink
                    to={subItem.path}
                    className={({ isActive }) => cn(
                      "block rounded-md px-2 py-1.5 text-sm transition-colors",
                      isActive ? 
                        `bg-${moduleColor}/10 font-medium text-${moduleColor}` : 
                        isDark ? "text-gray-300 hover:text-white hover:bg-gray-800" : 
                                "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    {subItem.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    return null;
  };

  const filteredMenuItems = getFilteredMenuItems();
  
  // Separar itens administrativos
  const adminItems = isAdmin ? filteredMenuItems.filter(item => 
    item.title === 'Parâmetros' || 
    item.title === 'Auditoria' || 
    item.title === 'Integrações' ||
    item.title === 'Notificações'
  ) : [];
  
  // Itens regulares (não administrativos)
  const regularItems = filteredMenuItems.filter(item => 
    !adminItems.includes(item)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <ul className="space-y-1">
          {regularItems.map((item, index) => (
            <li key={index}>
              {renderMenuItem(item, index)}
            </li>
          ))}
        </ul>
      </div>
      
      {isAdmin && adminItems.length > 0 && (
        <div className="space-y-2">
          {isSidebarOpen && (
            <h3 className={cn(
              "px-3 text-xs uppercase font-medium",
              isDark ? "text-gray-400" : "text-gray-500"
            )}>
              Administração
            </h3>
          )}
          
          <ul className="space-y-1">
            {adminItems.map((item, index) => (
              <li key={index}>
                {renderMenuItem(item, index)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SidebarItems;
