"""
Products API - Catálogo de Produtos
"""
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models import (
    User, Company, Supplier, Product, ProductCategory
)
from app.core.exceptions import BusinessLogicError
from app.core.logging_config import logger
from pydantic import BaseModel
from decimal import Decimal
import csv
import io

router = APIRouter()

# Schemas
class ProductCreate(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    ncm: Optional[str] = None
    origin_country: Optional[str] = None
    weight: Optional[Decimal] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    unit_price: Optional[Decimal] = None
    currency: str = "USD"
    supplier_id: Optional[int] = None
    metadata: Optional[dict] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    ncm: Optional[str] = None
    ncm_confidence: Optional[Decimal] = None
    origin_country: Optional[str] = None
    weight: Optional[Decimal] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    unit_price: Optional[Decimal] = None
    currency: Optional[str] = None
    supplier_id: Optional[int] = None
    is_active: Optional[bool] = None
    metadata: Optional[dict] = None

class ProductResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    ncm: Optional[str] = None
    ncm_confidence: Optional[Decimal] = None
    origin_country: Optional[str] = None
    weight: Optional[Decimal] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    unit_price: Optional[Decimal] = None
    currency: str
    supplier_id: Optional[int] = None
    is_active: bool
    total_imports: int = 0
    total_exports: int = 0
    last_import_date: Optional[datetime] = None
    last_export_date: Optional[datetime] = None
    extra_data: Optional[dict] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        # Ignorar campos extras que não estão no schema
        extra = "ignore"

class ProductCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    parent_category_id: Optional[int] = None

class ProductCategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    parent_category_id: Optional[int]
    created_at: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

@router.get("/", response_model=List[ProductResponse])
async def list_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    search: Optional[str] = None,
    category: Optional[str] = None,
    supplier_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    limit: int = Query(50, le=100),
    offset: int = 0
):
    """Listar produtos do catálogo"""
    company_id = current_user.company_id
    
    query = db.query(Product).filter(
        Product.company_id == company_id
    )
    
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.code.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%")
            )
        )
    
    if category:
        query = query.filter(Product.category == category)
    
    if supplier_id:
        query = query.filter(Product.supplier_id == supplier_id)
    
    if is_active is not None:
        query = query.filter(Product.is_active == is_active)
    
    products = query.order_by(Product.created_at.desc()).offset(offset).limit(limit).all()
    return products

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar novo produto no catálogo"""
    company_id = current_user.company_id
    
    # Verificar se código já existe
    existing = db.query(Product).filter(
        and_(
            Product.code == product_data.code,
            Product.company_id == company_id
        )
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Código de produto já existe")
    
    # Validar fornecedor se fornecido
    if product_data.supplier_id:
        supplier = db.query(Supplier).filter(
            and_(
                Supplier.id == product_data.supplier_id,
                Supplier.company_id == company_id
            )
        ).first()
        if not supplier:
            raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    # Criar produto
    new_product = Product(
        code=product_data.code,
        name=product_data.name,
        description=product_data.description,
        ncm=product_data.ncm,
        origin_country=product_data.origin_country,
        weight=product_data.weight,
        unit=product_data.unit,
        category=product_data.category,
        unit_price=product_data.unit_price,
        currency=product_data.currency or "USD",
        company_id=company_id,
        supplier_id=product_data.supplier_id,
        is_active=True,
        total_imports=0,
        total_exports=0,
        extra_data=product_data.metadata
    )
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return ProductResponse.from_orm(new_product)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um produto"""
    company_id = current_user.company_id
    
    product = db.query(Product).filter(
        and_(
            Product.id == product_id,
            Product.company_id == company_id
        )
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    return ProductResponse.from_orm(product)

@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar produto"""
    company_id = current_user.company_id
    
    product = db.query(Product).filter(
        and_(
            Product.id == product_id,
            Product.company_id == company_id
        )
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Atualizar campos
    if product_data.name is not None:
        product.name = product_data.name
    if product_data.description is not None:
        product.description = product_data.description
    if product_data.ncm is not None:
        product.ncm = product_data.ncm
    if product_data.ncm_confidence is not None:
        product.ncm_confidence = product_data.ncm_confidence
    if product_data.origin_country is not None:
        product.origin_country = product_data.origin_country
    if product_data.weight is not None:
        product.weight = product_data.weight
    if product_data.unit is not None:
        product.unit = product_data.unit
    if product_data.category is not None:
        product.category = product_data.category
    if product_data.unit_price is not None:
        product.unit_price = product_data.unit_price
    if product_data.currency is not None:
        product.currency = product_data.currency
    if product_data.supplier_id is not None:
        product.supplier_id = product_data.supplier_id
    if product_data.is_active is not None:
        product.is_active = product_data.is_active
    if product_data.metadata is not None:
        product.extra_data = product_data.metadata
    
    db.commit()
    db.refresh(product)
    
    return ProductResponse.from_orm(product)

@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Desativar produto (soft delete)"""
    company_id = current_user.company_id
    
    product = db.query(Product).filter(
        and_(
            Product.id == product_id,
            Product.company_id == company_id
        )
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    product.is_active = False
    db.commit()
    
    return {"message": "Produto desativado com sucesso"}

@router.post("/{product_id}/classify")
async def classify_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Classificar produto automaticamente (NCM)"""
    company_id = current_user.company_id
    
    product = db.query(Product).filter(
        and_(
            Product.id == product_id,
            Product.company_id == company_id
        )
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Mock de classificação automática
    # Em produção, usar ML/IA para classificação
    suggested_ncm = "9999.99.99"  # Mock
    confidence = Decimal("85.5")  # Mock
    
    product.ncm = suggested_ncm
    product.ncm_confidence = confidence
    
    db.commit()
    db.refresh(product)
    
    return {
        "message": "Produto classificado com sucesso",
        "ncm": suggested_ncm,
        "confidence": float(confidence)
    }

@router.get("/categories/", response_model=List[ProductCategoryResponse])
async def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar categorias de produtos"""
    # Categorias globais (company_id = None) e da empresa
    categories = db.query(ProductCategory).filter(
        or_(
            ProductCategory.company_id == current_user.company_id,
            ProductCategory.company_id.is_(None)
        )
    ).all()
    
    return categories

@router.post("/categories/", response_model=ProductCategoryResponse)
async def create_category(
    category_data: ProductCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar nova categoria de produtos"""
    company_id = current_user.company_id
    
    # Verificar se nome já existe
    existing = db.query(ProductCategory).filter(
        ProductCategory.name == category_data.name
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Categoria já existe")
    
    new_category = ProductCategory(
        name=category_data.name,
        description=category_data.description,
        parent_category_id=category_data.parent_category_id,
        company_id=company_id
    )
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    
    return ProductCategoryResponse.from_orm(new_category)

@router.post("/import-csv")
async def import_products_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Importar produtos via CSV
    Formato esperado: code, name, description, ncm, origin_country, weight, unit, category, unit_price, currency, supplier_id
    """
    logger.info(f"Importação CSV de produtos iniciada pelo usuário {current_user.id}")
    
    # Validar tipo de arquivo
    if not file.filename.endswith('.csv'):
        raise BusinessLogicError(detail="Arquivo deve ser CSV (.csv)")
    
    # Ler conteúdo do arquivo
    content = await file.read()
    content_str = content.decode('utf-8-sig')  # utf-8-sig para lidar com BOM
    
    # Processar CSV
    csv_reader = csv.DictReader(io.StringIO(content_str))
    
    # Headers obrigatórios
    required_headers = ['code', 'name']
    optional_headers = ['description', 'ncm', 'origin_country', 'weight', 'unit', 'category', 'unit_price', 'currency', 'supplier_id']
    
    # Validar headers
    if not csv_reader.fieldnames:
        raise BusinessLogicError(detail="CSV vazio ou sem headers")
    
    missing_headers = [h for h in required_headers if h not in csv_reader.fieldnames]
    if missing_headers:
        raise BusinessLogicError(
            detail=f"Headers obrigatórios faltando: {', '.join(missing_headers)}"
        )
    
    # Processar linhas
    imported = []
    errors = []
    skipped = []
    
    for row_num, row in enumerate(csv_reader, start=2):  # start=2 porque linha 1 é header
        try:
            # Validar campos obrigatórios
            if not row.get('code') or not row.get('name'):
                skipped.append({
                    "row": row_num,
                    "code": row.get('code', 'N/A'),
                    "reason": "Campos obrigatórios (code, name) faltando"
                })
                continue
            
            # Verificar se produto já existe
            existing = db.query(Product).filter(
                Product.code == row['code'],
                Product.company_id == current_user.company_id
            ).first()
            
            if existing:
                skipped.append({
                    "row": row_num,
                    "code": row['code'],
                    "reason": "Produto já existe"
                })
                continue
            
            # Converter valores
            product_data = {
                'code': row['code'].strip(),
                'name': row['name'].strip(),
                'description': row.get('description', '').strip() or None,
                'ncm': row.get('ncm', '').strip() or None,
                'origin_country': row.get('origin_country', '').strip() or None,
                'weight': Decimal(row['weight']) if row.get('weight') else None,
                'unit': row.get('unit', '').strip() or None,
                'category': row.get('category', '').strip() or None,
                'unit_price': Decimal(row['unit_price']) if row.get('unit_price') else None,
                'currency': row.get('currency', 'USD').strip(),
                'supplier_id': int(row['supplier_id']) if row.get('supplier_id') else None,
                'company_id': current_user.company_id,
                'is_active': True
            }
            
            # Validar supplier_id se fornecido
            if product_data['supplier_id']:
                supplier = db.query(Supplier).filter(
                    Supplier.id == product_data['supplier_id'],
                    Supplier.company_id == current_user.company_id
                ).first()
                if not supplier:
                    errors.append({
                        "row": row_num,
                        "code": row['code'],
                        "error": f"Supplier ID {product_data['supplier_id']} não encontrado"
                    })
                    continue
            
            # Criar produto
            new_product = Product(**product_data)
            db.add(new_product)
            db.flush()  # Para obter o ID sem commit
            
            imported.append({
                "row": row_num,
                "id": new_product.id,
                "code": new_product.code,
                "name": new_product.name
            })
            
        except ValueError as e:
            errors.append({
                "row": row_num,
                "code": row.get('code', 'N/A'),
                "error": f"Erro de conversão: {str(e)}"
            })
        except Exception as e:
            errors.append({
                "row": row_num,
                "code": row.get('code', 'N/A'),
                "error": str(e)
            })
    
    # Commit todas as importações
    try:
        db.commit()
        logger.info(f"Importação CSV concluída: {len(imported)} importados, {len(errors)} erros, {len(skipped)} ignorados")
    except Exception as e:
        db.rollback()
        raise BusinessLogicError(detail=f"Erro ao salvar produtos: {str(e)}")
    
    return {
        "total_rows": len(imported) + len(errors) + len(skipped),
        "imported": len(imported),
        "errors": len(errors),
        "skipped": len(skipped),
        "imported_items": imported,
        "errors_details": errors,
        "skipped_details": skipped
    }

