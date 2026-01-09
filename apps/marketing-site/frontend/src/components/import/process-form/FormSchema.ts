
import { z } from 'zod';

// Schema de validação expandido
export const processFormSchema = z.object({
  client: z.string().min(3, { message: 'Cliente é obrigatório' }),
  product: z.string().min(3, { message: 'Produto é obrigatório' }),
  description: z.string().optional(),
  origin: z.string().min(2, { message: 'Origem é obrigatória' }),
  estimatedArrival: z.date().optional(),  // This already expects a Date object
  ncm: z.string().optional(),
  invoiceValue: z.string().optional(),
  currency: z.string().default('USD'),
  importType: z.string().default('regular'),
  shippingMethod: z.string().optional(),
  referenceNumber: z.string().optional(),
  incoterm: z.string().optional(),
  customsBroker: z.string().optional(),
  supplier: z.string().optional(),
  // Novos campos financeiros
  freightValue: z.string().optional(),
  insuranceValue: z.string().optional(),
  customsValue: z.string().optional(),
  taxValue: z.string().optional(),
  // Novos campos logísticos
  quantity: z.number().optional(),
  unitWeight: z.number().optional(),
  totalWeight: z.number().optional(),
  packageType: z.string().optional(),
  containerId: z.string().optional(),
  vesselName: z.string().optional(),
  voyageNumber: z.string().optional(),
  bookingNumber: z.string().optional(),
});

export type ProcessFormValues = z.infer<typeof processFormSchema>;

export interface ProcessFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ProcessFormValues) => void;
  initialValues?: Partial<ProcessFormValues>;
}

// Constant data used across form components
export const importTypes = [
  { value: 'regular', label: 'Importação Regular' },
  { value: 'temporary', label: 'Importação Temporária' },
  { value: 'drawback', label: 'Drawback' },
  { value: 'reimport', label: 'Reimportação' },
  { value: 'express', label: 'Importação Expressa' },
];

export const shippingMethods = [
  { value: 'maritime', label: 'Marítimo' },
  { value: 'air', label: 'Aéreo' },
  { value: 'road', label: 'Rodoviário' },
  { value: 'rail', label: 'Ferroviário' },
  { value: 'multimodal', label: 'Multimodal' },
];

export const incoterms = [
  { value: 'FOB', label: 'FOB - Free On Board' },
  { value: 'CIF', label: 'CIF - Cost, Insurance and Freight' },
  { value: 'EXW', label: 'EXW - Ex Works' },
  { value: 'DAP', label: 'DAP - Delivered At Place' },
  { value: 'FCA', label: 'FCA - Free Carrier' },
  { value: 'CFR', label: 'CFR - Cost and Freight' },
  { value: 'CPT', label: 'CPT - Carriage Paid To' },
  { value: 'CIP', label: 'CIP - Carriage and Insurance Paid To' },
  { value: 'DPU', label: 'DPU - Delivered at Place Unloaded' },
  { value: 'DDP', label: 'DDP - Delivered Duty Paid' },
];

export const currencies = [
  { value: 'USD', label: 'USD - Dólar Americano' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - Libra Esterlina' },
  { value: 'JPY', label: 'JPY - Iene Japonês' },
  { value: 'CNY', label: 'CNY - Yuan Chinês' },
  { value: 'BRL', label: 'BRL - Real Brasileiro' },
];

export const packageTypes = [
  { value: 'box', label: 'Caixas' },
  { value: 'pallet', label: 'Paletes' },
  { value: 'barrel', label: 'Barris' },
  { value: 'bag', label: 'Sacas/Bags' },
  { value: 'bulk', label: 'Granel' },
  { value: 'container', label: 'Contêiner Completo' },
  { value: 'other', label: 'Outro' },
];

export const containerTypes = [
  { value: '20DC', label: '20\' Dry Container' },
  { value: '40DC', label: '40\' Dry Container' },
  { value: '40HC', label: '40\' High Cube' },
  { value: '20RF', label: '20\' Refrigerated' },
  { value: '40RF', label: '40\' Refrigerated' },
  { value: '20OT', label: '20\' Open Top' },
  { value: '40OT', label: '40\' Open Top' },
  { value: '20FR', label: '20\' Flat Rack' },
  { value: '40FR', label: '40\' Flat Rack' },
];
