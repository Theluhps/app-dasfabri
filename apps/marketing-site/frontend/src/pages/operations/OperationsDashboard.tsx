
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import { useTheme } from '@/hooks/use-theme';
import QuickActions from '@/components/operations/QuickActions';
import PendingTasks from '@/components/operations/PendingTasks';
import CriticalProcesses from '@/components/operations/CriticalProcesses';
import DocumentsOverview from '@/components/operations/DocumentsOverview';
import LogisticsOverview from '@/components/operations/LogisticsOverview';
import FinancialOperations from '@/components/operations/FinancialOperations';
import LicensesManagement from '@/components/operations/LicensesManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Users, Truck, FileText, DollarSign } from 'lucide-react';

const OperationsDashboard = () => {
  const { theme } = useTheme();

  return (
    <PageLayout 
      title="Operações" 
      description="Dashboard operacional com todas as ações e processos em andamento"
    >
      <div className="space-y-6">
        <QuickActions />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PendingTasks />
          <CriticalProcesses />
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Tudo</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Logística</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="licenses" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Licenças</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <DocumentsOverview />
            <LogisticsOverview />
            <FinancialOperations />
            <LicensesManagement />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsOverview />
          </TabsContent>
          
          <TabsContent value="logistics">
            <LogisticsOverview />
          </TabsContent>
          
          <TabsContent value="financial">
            <FinancialOperations />
          </TabsContent>
          
          <TabsContent value="licenses">
            <LicensesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default OperationsDashboard;
