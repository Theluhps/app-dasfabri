import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard';
import DashboardAnalytics from './pages/DashboardAnalytics';
import ImportDashboardPage from './pages/ImportDashboard';
import Processes from './pages/import/Processes';
import ProcessesAdvanced from './pages/import/ProcessesAdvanced';
import ProcessDetail from './pages/import/ProcessDetail';
import ImportLicenses from './pages/import/Licenses';
import ImportDocuments from './pages/import/Documents';
import Cargo from './pages/logistics/Cargo';
import Containers from './pages/logistics/Containers';
import Exchange from './pages/financial/Exchange';
import Payments from './pages/financial/Payments';
import FinancialDashboard from './pages/FinancialDashboard';
import ExportDashboard from './pages/ExportDashboard';
import ExportProcesses from './pages/export/Processes';
import ExportDocuments from './pages/export/Documents';
import Notifications from './pages/Notifications';
import NotificationSettings from './pages/NotificationSettings';
import NotificationsCenter from './pages/NotificationsCenter';
import OperationsDashboard from './pages/operations/OperationsDashboard';
import Companies from './pages/params/Companies';
import Users from './pages/params/Users';
import Theme from './pages/params/Theme';
import Audit from './pages/Audit';
import Integrations from './pages/Integrations';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RequestSent from './pages/auth/RequestSent';
import AccessRequests from './pages/admin/AccessRequests';
import UserProfiles from './pages/admin/UserProfiles';
import ModuleSelection from './pages/ModuleSelection';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import TestDashboard from './pages/TestDashboard';
import UserRegistration from './pages/admin/UserRegistration';
import CompanyRegistration from './pages/admin/CompanyRegistration';

// PO Module Pages
import PO from './pages/po';
import POOrders from './pages/po/Orders';
import POSuppliers from './pages/po/Suppliers';
import POReports from './pages/po/Reports';

// Workflow Pages
import ApprovalCenter from './pages/workflow/ApprovalCenter';
import WorkflowProcessDetail from './pages/workflow/ProcessDetail';
import WorkflowBuilder from './pages/workflow/WorkflowBuilder';

// New Feature Pages
import ControlTower from './pages/control-tower/ControlTower';
import Drawback from './pages/drawback/Drawback';
import Products from './pages/products/Products';
import Warehouses from './pages/warehouses/Warehouses';
import Watchlist from './pages/Watchlist';
import Tasks from './pages/Tasks';
import Map from './pages/Map';
import Classification from './pages/Classification';
import Customs from './pages/Customs';

// Context Providers
import { ModuleProvider } from '@/contexts/ModuleContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { WorkflowProvider } from '@/contexts/WorkflowContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <ModuleProvider>
        <NotificationsProvider>
          <WorkflowProvider>
          <>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/request-sent" element={<RequestSent />} />
              
              {/* Rota de teste - COMPLETAMENTE PÚBLICA */}
              <Route path="/test-dashboard" element={<TestDashboard />} />
              
              {/* Rotas protegidas - Admin */}
              <Route path="/admin/access-requests" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AccessRequests />
                </ProtectedRoute>
              } />
              <Route path="/admin/profiles" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserProfiles />
                </ProtectedRoute>
              } />
              <Route path="/admin/user-registration" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserRegistration />
                </ProtectedRoute>
              } />
              <Route path="/admin/company-registration" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CompanyRegistration />
                </ProtectedRoute>
              } />
              
              {/* Rotas protegidas - Todas as áreas internas */}
              {/* MODO DESENVOLVIMENTO: Rotas temporariamente públicas para teste */}
              <Route path="/module-selection" element={
                typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
                  ? <ModuleSelection />
                  : <ProtectedRoute><ModuleSelection /></ProtectedRoute>
              } />
              <Route path="/modules" element={
                typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                  ? <ModuleSelection />
                  : <ProtectedRoute><ModuleSelection /></ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                  ? <DashboardAnalytics />
                  : <ProtectedRoute><DashboardAnalytics /></ProtectedRoute>
              } />
              <Route path="/dashboard-module" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Módulo de Importação */}
              <Route path="/import/dashboard" element={
                <ProtectedRoute>
                  <ImportDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/import/processes" element={
                <ProtectedRoute>
                  <Processes />
                </ProtectedRoute>
              } />
              <Route path="/import/processes-advanced" element={
                <ProtectedRoute>
                  <ProcessesAdvanced />
                </ProtectedRoute>
              } />
              <Route path="/import/process/:id" element={
                <ProtectedRoute>
                  <ProcessDetail />
                </ProtectedRoute>
              } />
              <Route path="/import/licenses" element={
                <ProtectedRoute>
                  <ImportLicenses />
                </ProtectedRoute>
              } />
              <Route path="/import/documents" element={
                <ProtectedRoute>
                  <ImportDocuments />
                </ProtectedRoute>
              } />
              
              {/* Módulo de Logística */}
              <Route path="/logistics/cargo" element={
                <ProtectedRoute>
                  <Cargo />
                </ProtectedRoute>
              } />
              <Route path="/logistics/containers" element={
                <ProtectedRoute>
                  <Containers />
                </ProtectedRoute>
              } />
              
              {/* Módulo Financeiro */}
              <Route path="/financial/exchange" element={
                <ProtectedRoute>
                  <Exchange />
                </ProtectedRoute>
              } />
              <Route path="/financial/payments" element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              } />
              <Route path="/financial/dashboard" element={
                <ProtectedRoute>
                  <FinancialDashboard />
                </ProtectedRoute>
              } />
              
              {/* Módulo de Exportação */}
              <Route path="/export/dashboard" element={
                <ProtectedRoute>
                  <ExportDashboard />
                </ProtectedRoute>
              } />
              <Route path="/export/processes" element={
                <ProtectedRoute>
                  <ExportProcesses />
                </ProtectedRoute>
              } />
              <Route path="/export/documents" element={
                <ProtectedRoute>
                  <ExportDocuments />
                </ProtectedRoute>
              } />
              
              {/* Notificações */}
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/notifications/settings" element={
                <ProtectedRoute>
                  <NotificationSettings />
                </ProtectedRoute>
              } />
              <Route path="/notifications/center" element={
                <ProtectedRoute>
                  <NotificationsCenter />
                </ProtectedRoute>
              } />
              
              {/* Operações */}
              <Route path="/operations" element={
                <ProtectedRoute>
                  <OperationsDashboard />
                </ProtectedRoute>
              } />
              
              {/* Parâmetros */}
              <Route path="/params/companies" element={
                <ProtectedRoute>
                  <Companies />
                </ProtectedRoute>
              } />
              <Route path="/params/users" element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } />
              <Route path="/params/theme" element={
                <ProtectedRoute>
                  <Theme />
                </ProtectedRoute>
              } />
              
              {/* Auditoria */}
              <Route path="/audit" element={
                <ProtectedRoute>
                  <Audit />
                </ProtectedRoute>
              } />
              
              {/* Integrações */}
              <Route path="/integrations" element={
                <ProtectedRoute>
                  <Integrations />
                </ProtectedRoute>
              } />
              
              {/* Módulo de Pedidos de Compra */}
              <Route path="/po" element={
                <ProtectedRoute>
                  <PO />
                </ProtectedRoute>
              } />
              <Route path="/po/orders" element={
                <ProtectedRoute>
                  <POOrders />
                </ProtectedRoute>
              } />
              <Route path="/po/suppliers" element={
                <ProtectedRoute>
                  <POSuppliers />
                </ProtectedRoute>
              } />
              <Route path="/po/reports" element={
                <ProtectedRoute>
                  <POReports />
                </ProtectedRoute>
              } />
              
              {/* Workflow */}
              <Route path="/workflow/approvals" element={
                <ProtectedRoute>
                  <ApprovalCenter />
                </ProtectedRoute>
              } />
              <Route path="/workflow/process/:processId" element={
                <ProtectedRoute>
                  <WorkflowProcessDetail />
                </ProtectedRoute>
              } />
              <Route path="/workflow/builder" element={
                <ProtectedRoute>
                  <WorkflowBuilder />
                </ProtectedRoute>
              } />
              
              {/* Analytics */}
              <Route path="/analytics/advanced" element={
                <ProtectedRoute>
                  <DashboardAnalytics />
                </ProtectedRoute>
              } />
              
              {/* Control Tower */}
              <Route path="/control-tower" element={
                <ProtectedRoute>
                  <ControlTower />
                </ProtectedRoute>
              } />
              
              {/* Drawback */}
              <Route path="/drawback" element={
                <ProtectedRoute>
                  <Drawback />
                </ProtectedRoute>
              } />
              
              {/* Products */}
              <Route path="/products" element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              } />
              
              {/* Warehouses */}
              <Route path="/warehouses" element={
                <ProtectedRoute>
                  <Warehouses />
                </ProtectedRoute>
              } />
              <Route path="/watchlist" element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />
              <Route path="/map" element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              } />
              <Route path="/classification" element={
                <ProtectedRoute>
                  <Classification />
                </ProtectedRoute>
              } />
              <Route path="/customs" element={
                <ProtectedRoute>
                  <Customs />
                </ProtectedRoute>
              } />
              
              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <SonnerToaster />
          </>
          </WorkflowProvider>
        </NotificationsProvider>
      </ModuleProvider>
    </LanguageProvider>
  );
}

export default App;
