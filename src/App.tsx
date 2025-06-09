import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import './App.css';
import PrivateRoute from './components/auth/PrivateRoute';

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

// Context Providers
import { ModuleProvider } from '@/contexts/ModuleContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { WorkflowProvider } from '@/contexts/WorkflowContext';

function App() {
  return (
    <ModuleProvider>
      <NotificationsProvider>
        <WorkflowProvider>
          <>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/request-sent" element={<RequestSent />} />
<<<<<<< HEAD:Dasfabri-Platform/src/App.tsx
              <Route path="/admin/access-requests" element={<AccessRequests />} />
              <Route path="/admin/profiles" element={<UserProfiles />} />
              <Route path="/admin/user-registration" element={<UserRegistration />} />
              <Route path="/admin/company-registration" element={<CompanyRegistration />} />
              <Route path="/module-selection" element={<ModuleSelection />} />
              <Route path="/modules" element={<ModuleSelection />} />
              <Route path="/dashboard" element={<DashboardAnalytics />} />
              <Route path="/dashboard-module" element={<Dashboard />} />
              <Route path="/import/dashboard" element={<ImportDashboardPage />} />
              <Route path="/import/processes" element={<Processes />} />
              <Route path="/import/processes-advanced" element={<ProcessesAdvanced />} />
              <Route path="/import/process/:id" element={<ProcessDetail />} />
              <Route path="/import/licenses" element={<ImportLicenses />} />
              <Route path="/import/documents" element={<ImportDocuments />} />
              <Route path="/logistics/cargo" element={<Cargo />} />
              <Route path="/logistics/containers" element={<Containers />} />
              <Route path="/financial/exchange" element={<Exchange />} />
              <Route path="/financial/payments" element={<Payments />} />
              <Route path="/financial/dashboard" element={<FinancialDashboard />} />
              <Route path="/export/dashboard" element={<ExportDashboard />} />
              <Route path="/export/processes" element={<ExportProcesses />} />
              <Route path="/export/documents" element={<ExportDocuments />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/notifications/settings" element={<NotificationSettings />} />
              <Route path="/notifications/center" element={<NotificationsCenter />} />
              <Route path="/operations" element={<OperationsDashboard />} />
              <Route path="/params/companies" element={<Companies />} />
              <Route path="/params/users" element={<Users />} />
              <Route path="/params/theme" element={<Theme />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/po" element={<PO />} />
              <Route path="/po/orders" element={<POOrders />} />
              <Route path="/po/suppliers" element={<POSuppliers />} />
              <Route path="/po/reports" element={<POReports />} />
              <Route path="/workflow/approvals" element={<ApprovalCenter />} />
              <Route path="/workflow/process/:processId" element={<WorkflowProcessDetail />} />
              <Route path="/workflow/builder" element={<WorkflowBuilder />} />
              <Route path="/analytics/advanced" element={<DashboardAnalytics />} />
=======
              <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                <Route path="/admin/access-requests" element={<AccessRequests />} />
                <Route path="/admin/profiles" element={<UserProfiles />} />
                <Route path="/admin/user-registration" element={<UserRegistration />} />
                <Route path="/admin/company-registration" element={<CompanyRegistration />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/module-selection" element={<ModuleSelection />} />
                <Route path="/modules" element={<ModuleSelection />} />
                <Route path="/dashboard" element={<DashboardAnalytics />} />
                <Route path="/dashboard-module" element={<Dashboard />} />
                <Route path="/import/dashboard" element={<ImportDashboardPage />} />
                <Route path="/import/processes" element={<Processes />} />
                <Route path="/import/processes-advanced" element={<ProcessesAdvanced />} />
                <Route path="/import/process/:id" element={<ProcessDetail />} />
                <Route path="/import/licenses" element={<ImportLicenses />} />
                <Route path="/import/documents" element={<ImportDocuments />} />
                <Route path="/logistics/cargo" element={<Cargo />} />
                <Route path="/logistics/containers" element={<Containers />} />
                <Route path="/financial/exchange" element={<Exchange />} />
                <Route path="/financial/payments" element={<Payments />} />
                <Route path="/financial/dashboard" element={<FinancialDashboard />} />
                <Route path="/export/dashboard" element={<ExportDashboard />} />
                <Route path="/export/processes" element={<ExportProcesses />} />
                <Route path="/export/documents" element={<ExportDocuments />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/notifications/settings" element={<NotificationSettings />} />
                <Route path="/notifications/center" element={<NotificationsCenter />} />
                <Route path="/operations" element={<OperationsDashboard />} />
                <Route path="/params/companies" element={<Companies />} />
                <Route path="/params/users" element={<Users />} />
                <Route path="/params/theme" element={<Theme />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/po" element={<PO />} />
                <Route path="/po/orders" element={<POOrders />} />
                <Route path="/po/suppliers" element={<POSuppliers />} />
                <Route path="/po/reports" element={<POReports />} />
                <Route path="/workflow/approvals" element={<ApprovalCenter />} />
                <Route path="/workflow/process/:processId" element={<WorkflowProcessDetail />} />
                <Route path="/workflow/builder" element={<WorkflowBuilder />} />
                <Route path="/analytics/advanced" element={<DashboardAnalytics />} />
              </Route>
>>>>>>> 9fb5db3e95b2bba31938642a5bdaf0c7f8dbfe58:src/App.tsx
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </>
        </WorkflowProvider>
      </NotificationsProvider>
    </ModuleProvider>
  );
}

export default App;
