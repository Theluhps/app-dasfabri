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
from .tracking_event import TrackingEvent, TrackingEventStatus
from .compliance_check import ComplianceCheck, ComplianceCategory, ComplianceStatus
from .comment import Comment, CommentAttachment
from .drawback_act import DrawbackAct, DrawbackCredit, DrawbackActStatus, DrawbackActType
from .product import Product, ProductCategory
from .warehouse import Warehouse, InventoryItem, StockMovement, WarehouseStatus, StockMovementType
from .task import Task, TaskStatus, TaskPriority, TaskType
from .dashboard_config import UserDashboardConfig

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
    'Approval', 'ApprovalStatus',
    # Tracking models
    'TrackingEvent', 'TrackingEventStatus',
    # Compliance models
    'ComplianceCheck', 'ComplianceCategory', 'ComplianceStatus',
    # Comment models
    'Comment', 'CommentAttachment',
    # Drawback models
    'DrawbackAct', 'DrawbackCredit', 'DrawbackActStatus', 'DrawbackActType',
    # Product models
    'Product', 'ProductCategory',
    # Warehouse models
    'Warehouse', 'InventoryItem', 'StockMovement', 'WarehouseStatus', 'StockMovementType',
    # Task models
    'Task', 'TaskStatus', 'TaskPriority', 'TaskType',
    # Dashboard config models
    'UserDashboardConfig'
] 