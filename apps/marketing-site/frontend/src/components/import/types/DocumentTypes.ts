
export type DocumentStatus = 'Aprovado' | 'Pendente' | 'Rejeitado' | 'Em análise' | 'Expirado' | 'Arquivado';

export type DocumentType = 
  'invoice' | 
  'packing' | 
  'bl' | 
  'awb' | 
  'certificate' | 
  'license' | 
  'customs' | 
  'insurance' | 
  'payment' | 
  'other';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: Date | string;
  status: DocumentStatus;
  size?: number;
  comments?: string;
  processId: string;
  version?: number;
  expirationDate?: Date | string;
  category?: 'comercial' | 'legal' | 'técnico' | 'financeiro' | 'logístico';
  updatedAt?: Date | string;
  updatedBy?: string;
  approvedBy?: string;
  approvedAt?: Date | string;
  rejectedBy?: string;
  rejectedAt?: Date | string;
  rejectionReason?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  isRequired?: boolean;
  tags?: string[];
}

export interface ProcessDocumentsProps {
  processId: string;
  documents: Document[] | undefined;
  showUploadForm: boolean;
  setShowUploadForm: React.Dispatch<React.SetStateAction<boolean>>;
  onUploadComplete: (document: any) => void;
  onViewDocument: (document: Document) => void;
  onDownloadDocument?: (document: Document) => void;
}
