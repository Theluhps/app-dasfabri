
import { ModuleDashboardData } from './types';
import { importFullData } from './data/importFullData';
import { poManagementData } from './data/poManagementData';
import { shipmentManagementData } from './data/shipmentManagementData';
import { paymentDocumentsData } from './data/paymentDocumentsData';
import { exportFullData } from './data/exportFullData';

// Re-export interfaces
export type { StatCardData, ModuleDashboardData } from './types';

export const getDashboardData = (currentModule: string, moduleColor: string): ModuleDashboardData => {
  const dashboards: Record<string, ModuleDashboardData> = {
    import_full: importFullData,
    po_management: poManagementData,
    shipment_management: shipmentManagementData,
    payment_documents: paymentDocumentsData,
    export_full: exportFullData
  };

  return dashboards[currentModule] || dashboards.import_full;
};
