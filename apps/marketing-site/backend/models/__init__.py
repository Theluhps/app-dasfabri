from sqlalchemy.orm import declarative_base

Base = declarative_base()

from .company import Company
from .user import User
from .access_request import AccessRequest 