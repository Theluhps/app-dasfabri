
import React from 'react';
import { useModule } from '@/contexts/ModuleContext';
import { MODULES } from '@/types/modules';
import { getDashboardData } from './modules/dashboardData';
import { 
  ImportFullDashboard, 
  POManagementDashboard,
  ShipmentManagementDashboard,
  PaymentDocumentsDashboard,
  ExportFullDashboard
} from './modules';
import DashboardApprovalWidget from '../workflow/DashboardApprovalWidget';

const ModuleDashboard = () => {
  const { currentModule, isAdmin, isManager, moduleColor } = useModule();
  const moduleData = MODULES[currentModule];
  
  // Get module specific data
  const dashboardData = getDashboardData(currentModule, moduleColor);
  
  // For admins and managers, always show the full dashboard
  const showFullDashboard = isAdmin || isManager || dashboardData.showFullDashboard;
  
  const renderDashboard = () => {
    if (showFullDashboard) {
      if (currentModule === 'export_full') {
        return <ExportFullDashboard dashboardData={dashboardData} />;
      }
      return <ImportFullDashboard dashboardData={dashboardData} />;
    }
    
    switch (currentModule) {
      case 'po_management':
        return <POManagementDashboard dashboardData={dashboardData} />;
      case 'shipment_management':
        return <ShipmentManagementDashboard dashboardData={dashboardData} />;
      case 'payment_documents':
        return <PaymentDocumentsDashboard dashboardData={dashboardData} />;
      case 'export_full':
        return <ExportFullDashboard dashboardData={dashboardData} />;
      default:
        return <ImportFullDashboard dashboardData={dashboardData} />;
    }
  };

  return (
    <div className="w-full">
      {/* Display the workflow approval widget for admin and managers */}
      {(isAdmin || isManager) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <DashboardApprovalWidget />
          <div className="md:col-span-2"></div>
        </div>
      )}
      
      <div className="w-full">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default ModuleDashboard;
