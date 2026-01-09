"""
Modelo para Catálogo de Produtos
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base

class Product(Base):
    """Produto no catálogo"""
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Identificação
    code = Column(String, nullable=False, index=True)  # Código interno do produto
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Classificação
    ncm = Column(String, nullable=True, index=True)  # Nomenclatura Comum do Mercosul
    ncm_confidence = Column(Numeric(5, 2), nullable=True)  # Confiança da classificação (0-100)
    origin_country = Column(String, nullable=True)  # País de origem
    
    # Características
    weight = Column(Numeric(10, 3), nullable=True)  # Peso unitário (kg)
    unit = Column(String, nullable=True)  # Unidade de medida
    category = Column(String, nullable=True)  # Categoria do produto
    
    # Valores
    unit_price = Column(Numeric(15, 2), nullable=True)
    currency = Column(String, default='USD')
    
    # Relacionamentos
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Histórico e estatísticas
    total_imports = Column(Integer, default=0)
    total_exports = Column(Integer, default=0)
    last_import_date = Column(DateTime, nullable=True)
    last_export_date = Column(DateTime, nullable=True)
    
    # Metadados adicionais (JSON para flexibilidade)
    extra_data = Column(JSON, nullable=True)  # Informações adicionais (renomeado de metadata para evitar conflito com SQLAlchemy)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="products")
    supplier = relationship("Supplier", back_populates="products")
    import_history = relationship("ImportProcess", foreign_keys="ImportProcess.product_id", overlaps="product")
    export_history = relationship("ExportProcess", foreign_keys="ExportProcess.product_id", overlaps="product_rel")

class ProductCategory(Base):
    """Categoria de produtos"""
    __tablename__ = 'product_categories'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Identificação
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    
    # Hierarquia
    parent_category_id = Column(Integer, ForeignKey('product_categories.id'), nullable=True)
    
    # Relacionamentos
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=True)  # Null = categoria global
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    parent_category = relationship("ProductCategory", remote_side=[id], back_populates="subcategories")
    subcategories = relationship("ProductCategory", back_populates="parent_category")
    company = relationship("Company", back_populates="product_categories")

