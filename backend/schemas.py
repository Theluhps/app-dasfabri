from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    operator = "operator"
    viewer = "viewer"

class UserStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"

class CompanyStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"

class AccessRequestStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

# Company Schemas
class CompanyBase(BaseModel):
    name: str
    cnpj: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: str = "Brasil"
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    type: Optional[str] = None
    segment: Optional[str] = None
    status: CompanyStatus = CompanyStatus.active

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    department: Optional[str] = None
    role: UserRole = UserRole.viewer
    status: UserStatus = UserStatus.active

class UserCreate(UserBase):
    password: str
    company_id: int

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    company_id: int
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Access Request Schemas
class AccessRequestBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    position: Optional[str] = None

class AccessRequestCreate(AccessRequestBase):
    pass

class AccessRequest(AccessRequestBase):
    id: int
    company_id: int
    status: AccessRequestStatus
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    rejection_reason: Optional[str] = None
    
    class Config:
        from_attributes = True

# Import Process Schemas
class ImportStatus(str, Enum):
    draft = "draft"
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class ImportType(str, Enum):
    direct = "direct"
    indirect = "indirect"
    temporary = "temporary"

class ShippingMethod(str, Enum):
    sea = "sea"
    air = "air"
    land = "land"

class Incoterm(str, Enum):
    EXW = "EXW"
    FCA = "FCA"
    CPT = "CPT"
    CIP = "CIP"
    DAP = "DAP"
    DPU = "DPU"
    DDP = "DDP"
    FAS = "FAS"
    FOB = "FOB"
    CFR = "CFR"
    CIF = "CIF"

class ImportProcessBase(BaseModel):
    reference_number: str
    client: str
    product: str
    description: Optional[str] = None
    origin: str
    destination: str
    supplier: str
    supplier_country: Optional[str] = None
    ncm: Optional[str] = None
    invoice_value: Optional[float] = None
    currency: str = "USD"
    import_type: ImportType = ImportType.direct
    shipping_method: ShippingMethod = ShippingMethod.sea
    incoterm: Incoterm = Incoterm.FOB
    customs_broker: Optional[str] = None
    freight_forwarder: Optional[str] = None
    estimated_arrival: Optional[datetime] = None

class ImportProcessCreate(ImportProcessBase):
    pass

class ImportProcessUpdate(BaseModel):
    reference_number: Optional[str] = None
    client: Optional[str] = None
    product: Optional[str] = None
    description: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    supplier: Optional[str] = None
    supplier_country: Optional[str] = None
    ncm: Optional[str] = None
    invoice_value: Optional[float] = None
    currency: Optional[str] = None
    import_type: Optional[ImportType] = None
    shipping_method: Optional[ShippingMethod] = None
    incoterm: Optional[Incoterm] = None
    customs_broker: Optional[str] = None
    freight_forwarder: Optional[str] = None
    estimated_arrival: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    customs_clearance_date: Optional[datetime] = None
    status: Optional[ImportStatus] = None
    current_step: Optional[str] = None

class ImportProcess(ImportProcessBase):
    id: int
    company_id: int
    created_by: int
    actual_arrival: Optional[datetime] = None
    customs_clearance_date: Optional[datetime] = None
    status: ImportStatus = ImportStatus.draft
    current_step: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Supplier Schemas
class SupplierStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"

class SupplierBase(BaseModel):
    name: str
    code: str
    tax_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: str
    postal_code: Optional[str] = None
    business_type: Optional[str] = None
    industry: Optional[str] = None
    products: Optional[str] = None
    payment_terms: Optional[str] = None
    credit_limit: Optional[str] = None
    currency: str = "USD"
    status: SupplierStatus = SupplierStatus.active
    notes: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class Supplier(SupplierBase):
    id: int
    company_id: int
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Payment Schemas
class PaymentStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    paid = "paid"
    overdue = "overdue"
    cancelled = "cancelled"

class PaymentType(str, Enum):
    import_payment = "import_payment"
    export_payment = "export_payment"
    customs_duty = "customs_duty"
    freight = "freight"
    insurance = "insurance"
    storage = "storage"
    other = "other"

class PaymentBase(BaseModel):
    payment_number: str
    description: str
    amount: float
    currency: str = "USD"
    payment_type: PaymentType
    due_date: datetime
    payment_date: Optional[datetime] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    notes: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: int
    company_id: int
    created_by: int
    status: PaymentStatus = PaymentStatus.pending
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Container Schemas
class ContainerStatus(str, Enum):
    booked = "booked"
    loaded = "loaded"
    in_transit = "in_transit"
    arrived = "arrived"
    delivered = "delivered"
    returned = "returned"

class ContainerType(str, Enum):
    twenty_dc = "20DC"
    forty_dc = "40DC"
    forty_hc = "40HC"
    forty_rf = "40RF"
    forty_ot = "40OT"

class ContainerBase(BaseModel):
    container_number: str
    container_type: ContainerType
    size: Optional[str] = None
    booking_number: Optional[str] = None
    vessel: Optional[str] = None
    voyage: Optional[str] = None
    origin_port: str
    destination_port: str
    origin_country: str
    destination_country: str
    booking_date: Optional[datetime] = None
    loading_date: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    estimated_arrival: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    current_location: Optional[str] = None
    notes: Optional[str] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None

class ContainerCreate(ContainerBase):
    pass

class Container(ContainerBase):
    id: int
    company_id: int
    created_by: int
    status: ContainerStatus = ContainerStatus.booked
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Purchase Order Schemas
class POStatus(str, Enum):
    draft = "draft"
    pending = "pending"
    approved = "approved"
    ordered = "ordered"
    received = "received"
    cancelled = "cancelled"

class PurchaseOrderBase(BaseModel):
    po_number: str
    title: str
    description: Optional[str] = None
    supplier_id: int
    total_amount: Optional[float] = None
    currency: str = "USD"
    payment_terms: Optional[str] = None
    order_date: Optional[datetime] = None
    expected_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    notes: Optional[str] = None

class PurchaseOrderCreate(PurchaseOrderBase):
    pass

class PurchaseOrder(PurchaseOrderBase):
    id: int
    company_id: int
    created_by: int
    approved_by: Optional[int] = None
    status: POStatus = POStatus.draft
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# PO Item Schemas
class POItemBase(BaseModel):
    product_code: str
    product_name: str
    description: Optional[str] = None
    quantity: float
    unit: str
    unit_price: float
    total_price: float
    specifications: Optional[str] = None
    ncm: Optional[str] = None
    expected_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None

class POItemCreate(POItemBase):
    pass

class POItem(POItemBase):
    id: int
    purchase_order_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Workflow Schemas
class WorkflowStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    draft = "draft"

class WorkflowType(str, Enum):
    import_approval = "import_approval"
    export_approval = "export_approval"
    payment_approval = "payment_approval"
    po_approval = "po_approval"
    custom = "custom"

class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    workflow_type: WorkflowType
    is_active: WorkflowStatus = WorkflowStatus.active
    auto_approve: str = "false"

class WorkflowCreate(WorkflowBase):
    pass

class Workflow(WorkflowBase):
    id: int
    company_id: int
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Approval Schemas
class ApprovalStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    cancelled = "cancelled"
    expired = "expired"

class ApprovalBase(BaseModel):
    title: str
    description: Optional[str] = None
    entity_type: str
    entity_id: int
    workflow_id: int
    workflow_step_id: int
    requested_by: int
    approved_by: Optional[int] = None
    rejected_by: Optional[int] = None
    approved_at: Optional[datetime] = None
    rejected_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    approval_comment: Optional[str] = None
    rejection_reason: Optional[str] = None

class ApprovalCreate(ApprovalBase):
    pass

class Approval(ApprovalBase):
    id: int
    company_id: int
    status: ApprovalStatus = ApprovalStatus.pending
    requested_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Response Schemas
class MessageResponse(BaseModel):
    message: str

class HealthResponse(BaseModel):
    status: str
    timestamp: str 

# Document Schemas para Importação
class DocumentType(str, Enum):
    commercial_invoice = "commercial_invoice"
    packing_list = "packing_list"
    bill_of_lading = "bill_of_lading"
    certificate_of_origin = "certificate_of_origin"
    phytosanitary_certificate = "phytosanitary_certificate"
    sanitary_certificate = "sanitary_certificate"
    insurance_certificate = "insurance_certificate"
    import_license = "import_license"
    customs_declaration = "customs_declaration"
    other = "other"

class DocumentStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    expired = "expired"

class ImportDocumentBase(BaseModel):
    document_type: DocumentType
    document_number: Optional[str] = None
    document_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    status: DocumentStatus = DocumentStatus.pending
    notes: Optional[str] = None
    import_process_id: int
    company_id: int
    uploaded_by: int

class ImportDocumentCreate(ImportDocumentBase):
    pass

class ImportDocument(ImportDocumentBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 

# Schemas para Processos de Exportação
class ExportStatus(str, Enum):
    draft = "draft"
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class ExportType(str, Enum):
    direct = "direct"
    indirect = "indirect"
    temporary = "temporary"

class ExportProcessBase(BaseModel):
    reference_number: str
    client: str
    product: str
    description: Optional[str] = None
    destination: str
    origin: str
    supplier: str
    supplier_country: Optional[str] = None
    ncm: Optional[str] = None
    invoice_value: Optional[float] = None
    currency: str = "USD"
    export_type: ExportType = ExportType.direct
    shipping_method: Optional[str] = None
    incoterm: Optional[str] = None
    customs_broker: Optional[str] = None
    freight_forwarder: Optional[str] = None
    estimated_departure: Optional[datetime] = None

class ExportProcessCreate(ExportProcessBase):
    pass

class ExportProcess(ExportProcessBase):
    id: int
    company_id: int
    created_by: int
    actual_departure: Optional[datetime] = None
    customs_clearance_date: Optional[datetime] = None
    status: ExportStatus = ExportStatus.draft
    current_step: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 

class ExportProcessUpdate(BaseModel):
    reference_number: Optional[str] = None
    client: Optional[str] = None
    product: Optional[str] = None
    description: Optional[str] = None
    destination: Optional[str] = None
    origin: Optional[str] = None
    supplier: Optional[str] = None
    supplier_country: Optional[str] = None
    ncm: Optional[str] = None
    invoice_value: Optional[float] = None
    currency: Optional[str] = None
    export_type: Optional[ExportType] = None
    shipping_method: Optional[str] = None
    incoterm: Optional[str] = None
    customs_broker: Optional[str] = None
    freight_forwarder: Optional[str] = None
    estimated_departure: Optional[datetime] = None
    actual_departure: Optional[datetime] = None
    customs_clearance_date: Optional[datetime] = None
    status: Optional[ExportStatus] = None
    current_step: Optional[str] = None 

class ClientStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"

class ClientBase(BaseModel):
    name: str
    code: str
    tax_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: str
    postal_code: Optional[str] = None
    business_type: Optional[str] = None
    industry: Optional[str] = None
    products: Optional[str] = None
    payment_terms: Optional[str] = None
    credit_limit: Optional[str] = None
    currency: str = "USD"
    status: ClientStatus = ClientStatus.active
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    company_id: int
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 

class PaymentUpdate(BaseModel):
    payment_number: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    payment_type: Optional[PaymentType] = None
    due_date: Optional[datetime] = None
    payment_date: Optional[datetime] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[PaymentStatus] = None 

class ExchangeRateBase(BaseModel):
    currency_from: str
    currency_to: str
    rate: float
    date: datetime
    notes: Optional[str] = None

class ExchangeRateCreate(ExchangeRateBase):
    pass

class ExchangeRate(ExchangeRateBase):
    id: int
    company_id: int
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 

class ContainerUpdate(BaseModel):
    container_number: Optional[str] = None
    container_type: Optional[ContainerType] = None
    size: Optional[str] = None
    booking_number: Optional[str] = None
    vessel: Optional[str] = None
    voyage: Optional[str] = None
    origin_port: Optional[str] = None
    destination_port: Optional[str] = None
    origin_country: Optional[str] = None
    destination_country: Optional[str] = None
    booking_date: Optional[datetime] = None
    loading_date: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    estimated_arrival: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    current_location: Optional[str] = None
    notes: Optional[str] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    status: Optional[ContainerStatus] = None 

class ContainerTrackingUpdate(BaseModel):
    current_location: Optional[str] = None
    status: Optional[ContainerStatus] = None
    updated_at: Optional[datetime] = None
    notes: Optional[str] = None 

class PurchaseOrderUpdate(BaseModel):
    po_number: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    supplier_id: Optional[int] = None
    total_amount: Optional[float] = None
    currency: Optional[str] = None
    payment_terms: Optional[str] = None
    order_date: Optional[datetime] = None
    expected_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    notes: Optional[str] = None
    approved_by: Optional[int] = None
    status: Optional[POStatus] = None
    approved_at: Optional[datetime] = None 

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    workflow_type: Optional[WorkflowType] = None
    is_active: Optional[WorkflowStatus] = None
    auto_approve: Optional[str] = None 

class StepType(str, Enum):
    approval = "approval"
    review = "review"
    notification = "notification"
    custom = "custom"

class WorkflowStepBase(BaseModel):
    name: str
    description: Optional[str] = None
    step_type: StepType = StepType.approval
    order: int
    is_mandatory: bool = True
    workflow_id: int

class WorkflowStepCreate(WorkflowStepBase):
    pass

class WorkflowStep(WorkflowStepBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 

class WorkflowStepUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    step_type: Optional[StepType] = None
    order: Optional[int] = None
    is_mandatory: Optional[bool] = None
    workflow_id: Optional[int] = None 

class ApprovalType(str, Enum):
    manual = "manual"
    automatic = "automatic"
    hybrid = "hybrid" 

class ApprovalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    workflow_id: Optional[int] = None
    workflow_step_id: Optional[int] = None
    requested_by: Optional[int] = None
    approved_by: Optional[int] = None
    rejected_by: Optional[int] = None
    approved_at: Optional[datetime] = None
    rejected_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    approval_comment: Optional[str] = None
    rejection_reason: Optional[str] = None
    status: Optional[ApprovalStatus] = None 