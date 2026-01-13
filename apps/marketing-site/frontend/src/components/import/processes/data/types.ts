
import { ProcessFormValues } from '../../process-form/FormSchema';

export interface Process {
  id: string;
  client: string;
  product: string;
  origin: string;
  status: string;
  date: string;
  estimatedArrival?: string;  // Changed to only accept string
  invoiceValue?: string;
  ncm?: string;
  currency?: string;
  importType?: string;
  supplier?: string;
  description?: string;
  shippingMethod?: string;
  incoterm?: string;
  referenceNumber?: string;
  customsBroker?: string;
  is_favorite?: boolean;  // Watchlist/Favorites feature
  documents?: any[];
  timeline?: any[];
}

export type ProcessesHookReturn = {
  processes: Process[];
  filteredProcesses: Process[];
  currentItems: Process[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  handleSearch: (searchTerm: string, filters: any[]) => void | Promise<void>;
  handleResetSearch: () => void;
  handleNewProcess: () => void;
  handleEditProcess: (process: Process) => void;
  handleProcessSubmit: (formData: ProcessFormValues) => void | Promise<void>;
  handleExportData: () => void;
  showProcessForm: boolean;
  setShowProcessForm: (show: boolean) => void;
  editingProcess: Process | null;
  isLoading?: boolean;
}
