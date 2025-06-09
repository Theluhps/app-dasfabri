from sqlalchemy.orm import declarative_base

Base = declarative_base()

from backend.models.company import Company
from backend.models.user import User
from backend.models.access_request import AccessRequest 