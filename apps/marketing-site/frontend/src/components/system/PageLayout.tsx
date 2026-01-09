
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '@/hooks/use-theme';
import { useModule } from '@/contexts/ModuleContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import ModuleBadge from './ModuleBadge';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children,
  title,
  description,
  icon: Icon,
  actions
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { theme } = useTheme();
  const { hasAccessToRoute, currentModule, isAdmin, isManager, moduleColor } = useModule();
  const currentPath = window.location.pathname;

  const hasAccess = hasAccessToRoute(currentPath);

  return (
    <div className={`flex min-h-screen w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main content with proper padding */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'sm:ml-64' : 'sm:ml-20'}`}
      >
        {/* Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Page content - sem centralização dupla */}
        <main className="flex-1 p-4 lg:p-6 w-full">
          {!hasAccess && !isAdmin && !isManager ? (
            <Alert variant="destructive" className="mb-6">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Acesso Restrito</AlertTitle>
              <AlertDescription>
                Você não tem acesso a esta página com o módulo atual.
                Por favor, contate o administrador ou selecione outro módulo.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {title && (
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-5 w-1 rounded-full" 
                        style={{ backgroundColor: moduleColor }}
                      ></div>
                      {Icon && <Icon className="h-5 w-5" />}
                      <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {title}
                      </h1>
                    </div>
                    <div className="flex items-center gap-2">
                      {actions}
                      <ModuleBadge />
                    </div>
                  </div>
                  {description && (
                    <p className={`mt-1 ml-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {description}
                    </p>
                  )}
                </div>
              )}
              <div className="w-full">
                {children}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
