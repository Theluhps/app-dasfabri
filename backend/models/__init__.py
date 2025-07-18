from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import existing models
from .company import Company, CompanyStatus
from .user import User, UserRole, UserStatus
from .access_request import AccessRequest, AccessRequestStatus

# Import new models
from .import_process import ImportProcess, ImportStatus, ImportType, ShippingMethod, Incoterm
from .import_document import ImportDocument, DocumentType, DocumentStatus
from .supplier import Supplier, SupplierStatus
from .export_process import ExportProcess, ExportStatus, ExportType
from .client import Client, ClientStatus
from .payment import Payment, PaymentStatus, PaymentType
from .exchange_rate import ExchangeRate
from .container import Container, ContainerStatus, ContainerType
from .purchase_order import PurchaseOrder, POStatus
from .po_item import POItem
from .workflow import Workflow, WorkflowStatus, WorkflowType
from .workflow_step import WorkflowStep, StepType
from .approval import Approval, ApprovalStatus

# Import all enums for easy access
__all__ = [
    'Base',
    # Core models
    'Company', 'CompanyStatus',
    'User', 'UserRole', 'UserStatus',
    'AccessRequest', 'AccessRequestStatus',
    # Import models
    'ImportProcess', 'ImportStatus', 'ImportType', 'ShippingMethod', 'Incoterm',
    'ImportDocument', 'DocumentType', 'DocumentStatus',
    'Supplier', 'SupplierStatus',
    # Export models
    'ExportProcess', 'ExportStatus', 'ExportType',
    'Client', 'ClientStatus',
    # Financial models
    'Payment', 'PaymentStatus', 'PaymentType',
    'ExchangeRate',
    # Logistics models
    'Container', 'ContainerStatus', 'ContainerType',
    # Purchase Order models
    'PurchaseOrder', 'POStatus',
    'POItem',
    # Workflow models
    'Workflow', 'WorkflowStatus', 'WorkflowType',
    'WorkflowStep', 'StepType',
    'Approval', 'ApprovalStatus'
] 