import React from 'react';
import { Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import ModuleBadge from './ModuleBadge';
import { useModule } from '@/contexts/ModuleContext';
import NotificationBell from '../notifications/NotificationBell';
import DasfabriLogo from '../DasfabriLogo';

interface HeaderProps {
  setIsSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const { theme } = useTheme();
  const { user, role } = useModule();
  const navigate = useNavigate();

  const getRoleBadgeColor = () => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'operator': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectModules = () => {
    navigate('/modules');
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b`}>
      <div className="flex items-center lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} h-6 w-6`} />
        </Button>
      </div>
      
      <div className="hidden lg:flex items-center">
        <DasfabriLogo 
          variant={theme === 'dark' ? 'white' : 'default'} 
          className="mr-4" 
          size="md"
        />
      </div>
      
      <div className="flex-1 mx-4 lg:mx-0 max-w-md hidden md:block">
        <div className="relative">
          <Search className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4`} />
          <Input 
            className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-700' : 'border-gray-300'} pl-10 pr-4`} 
            type="search" 
            placeholder="Buscar..." 
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 mr-4">
          <ModuleBadge />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSelectModules}
            className="text-xs hover:bg-gray-100"
          >
            Trocar
          </Button>
        </div>

        <NotificationBell />
        
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-8 w-8 rounded-full"
            >
              <div className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold`}>
                {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'JD'}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className={`${theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-700' : ''} w-56`} 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className={`${theme === 'dark' ? 'text-gray-300' : ''} font-normal`}>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{user?.name || 'João da Silva'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                    {role === 'admin' ? 'Admin' : 
                    role === 'manager' ? 'Gestor' : 
                    role === 'operator' ? 'Operador' : 'Visualizador'}
                  </span>
                </div>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'joao@exemplo.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700' : ''} />
            <DropdownMenuItem onClick={handleSelectModules}>
              Selecionar Módulo
            </DropdownMenuItem>
            <DropdownMenuItem>
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700' : ''} />
            <DropdownMenuItem className="text-red-500" onClick={() => navigate('/auth/login')}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
