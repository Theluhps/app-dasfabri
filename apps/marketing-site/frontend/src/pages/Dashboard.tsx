
import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import ModuleDashboard from '@/components/dashboard/ModuleDashboard';
import WidgetSelector from '@/components/dashboard/WidgetSelector';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useModule } from '@/contexts/ModuleContext';
import { MODULES } from '@/types/modules';

const Dashboard = () => {
  const { currentModule } = useModule();
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  
  // Get module specific data directly from the MODULES object
  const module = MODULES[currentModule];
  
  return (
    <PageLayout 
      title={`Dashboard${module.name !== 'Import Full' ? ` de ${module.name}` : ''}`}
      description={module.description}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowWidgetSelector(true)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Configurar Widgets
        </Button>
      }
    >
      <ModuleDashboard />
      
      <WidgetSelector
        open={showWidgetSelector}
        onOpenChange={setShowWidgetSelector}
        onConfigUpdated={() => {
          // Recarregar página para aplicar mudanças
          window.location.reload();
        }}
      />
    </PageLayout>
  );
};

export default Dashboard;
