"""Add drawback, products, warehouse models

Revision ID: add_new_models
Revises: add_tracking_compliance_comments
Create Date: 2025-01-03 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision: str = 'add_new_models'
down_revision: Union[str, None] = 'add_tracking_compliance_comments'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create product_categories table
    op.create_table(
        'product_categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('parent_category_id', sa.Integer(), nullable=True),
        sa.Column('company_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['parent_category_id'], ['product_categories.id'], ),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_index(op.f('ix_product_categories_id'), 'product_categories', ['id'], unique=False)

    # Create products table
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('ncm', sa.String(), nullable=True),
        sa.Column('ncm_confidence', sa.Numeric(5, 2), nullable=True),
        sa.Column('origin_country', sa.String(), nullable=True),
        sa.Column('weight', sa.Numeric(10, 3), nullable=True),
        sa.Column('unit', sa.String(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('unit_price', sa.Numeric(15, 2), nullable=True),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('supplier_id', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('total_imports', sa.Integer(), nullable=True),
        sa.Column('total_exports', sa.Integer(), nullable=True),
        sa.Column('last_import_date', sa.DateTime(), nullable=True),
        sa.Column('last_export_date', sa.DateTime(), nullable=True),
        sa.Column('metadata', sa.Text(), nullable=True),  # JSON stored as Text in SQLite
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_id'), 'products', ['id'], unique=False)
    op.create_index('ix_products_code', 'products', ['code'], unique=False)
    op.create_index('ix_products_ncm', 'products', ['ncm'], unique=False)

    # Add product_id to import_processes
    op.add_column('import_processes', sa.Column('product_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_import_processes_product', 'import_processes', 'products', ['product_id'], ['id'])

    # Add product_id to export_processes
    op.add_column('export_processes', sa.Column('product_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_export_processes_product', 'export_processes', 'products', ['product_id'], ['id'])

    # Create drawback_acts table
    op.create_table(
        'drawback_acts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('act_number', sa.String(), nullable=False),
        sa.Column('act_type', sa.String(), nullable=False),  # Enum stored as String
        sa.Column('status', sa.String(), nullable=True),  # Enum stored as String
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('total_value', sa.Numeric(15, 2), nullable=False),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('import_process_id', sa.Integer(), nullable=True),
        sa.Column('export_process_id', sa.Integer(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(), nullable=True),
        sa.Column('approved_at', sa.DateTime(), nullable=True),
        sa.Column('expiration_date', sa.DateTime(), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('approved_by', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('rejection_reason', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.ForeignKeyConstraint(['import_process_id'], ['import_processes.id'], ),
        sa.ForeignKeyConstraint(['export_process_id'], ['export_processes.id'], ),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['approved_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('act_number')
    )
    op.create_index(op.f('ix_drawback_acts_id'), 'drawback_acts', ['id'], unique=False)
    op.create_index('ix_drawback_acts_act_number', 'drawback_acts', ['act_number'], unique=True)

    # Create drawback_credits table
    op.create_table(
        'drawback_credits',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('credit_number', sa.String(), nullable=False),
        sa.Column('value', sa.Numeric(15, 2), nullable=False),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('used_value', sa.Numeric(15, 2), nullable=True),
        sa.Column('available_value', sa.Numeric(15, 2), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_used', sa.Boolean(), nullable=True),
        sa.Column('act_id', sa.Integer(), nullable=False),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('generated_at', sa.DateTime(), nullable=False),
        sa.Column('used_at', sa.DateTime(), nullable=True),
        sa.Column('expiration_date', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['act_id'], ['drawback_acts.id'], ),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('credit_number')
    )
    op.create_index(op.f('ix_drawback_credits_id'), 'drawback_credits', ['id'], unique=False)
    op.create_index('ix_drawback_credits_credit_number', 'drawback_credits', ['credit_number'], unique=True)

    # Create warehouses table
    op.create_table(
        'warehouses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=True),
        sa.Column('state', sa.String(), nullable=True),
        sa.Column('country', sa.String(), nullable=True),
        sa.Column('postal_code', sa.String(), nullable=True),
        sa.Column('latitude', sa.Numeric(10, 7), nullable=True),
        sa.Column('longitude', sa.Numeric(10, 7), nullable=True),
        sa.Column('total_capacity', sa.Numeric(15, 2), nullable=True),
        sa.Column('used_capacity', sa.Numeric(15, 2), nullable=True),
        sa.Column('status', sa.String(), nullable=True),  # Enum stored as String
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )
    op.create_index(op.f('ix_warehouses_id'), 'warehouses', ['id'], unique=False)
    op.create_index('ix_warehouses_code', 'warehouses', ['code'], unique=True)

    # Create inventory_items table
    op.create_table(
        'inventory_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('warehouse_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=True),
        sa.Column('import_process_id', sa.Integer(), nullable=True),
        sa.Column('export_process_id', sa.Integer(), nullable=True),
        sa.Column('quantity', sa.Numeric(15, 3), nullable=False),
        sa.Column('unit', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('batch_number', sa.String(), nullable=True),
        sa.Column('is_available', sa.Boolean(), nullable=True),
        sa.Column('is_reserved', sa.Boolean(), nullable=True),
        sa.Column('entry_date', sa.DateTime(), nullable=False),
        sa.Column('expiration_date', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['warehouse_id'], ['warehouses.id'], ),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
        sa.ForeignKeyConstraint(['import_process_id'], ['import_processes.id'], ),
        sa.ForeignKeyConstraint(['export_process_id'], ['export_processes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_inventory_items_id'), 'inventory_items', ['id'], unique=False)

    # Create stock_movements table
    op.create_table(
        'stock_movements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('movement_type', sa.String(), nullable=False),  # Enum stored as String
        sa.Column('warehouse_id', sa.Integer(), nullable=False),
        sa.Column('inventory_item_id', sa.Integer(), nullable=True),
        sa.Column('product_id', sa.Integer(), nullable=True),
        sa.Column('import_process_id', sa.Integer(), nullable=True),
        sa.Column('export_process_id', sa.Integer(), nullable=True),
        sa.Column('quantity', sa.Numeric(15, 3), nullable=False),
        sa.Column('unit', sa.String(), nullable=True),
        sa.Column('reference_number', sa.String(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('movement_date', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['warehouse_id'], ['warehouses.id'], ),
        sa.ForeignKeyConstraint(['inventory_item_id'], ['inventory_items.id'], ),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
        sa.ForeignKeyConstraint(['import_process_id'], ['import_processes.id'], ),
        sa.ForeignKeyConstraint(['export_process_id'], ['export_processes.id'], ),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_stock_movements_id'), 'stock_movements', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_stock_movements_id'), table_name='stock_movements')
    op.drop_table('stock_movements')
    op.drop_index(op.f('ix_inventory_items_id'), table_name='inventory_items')
    op.drop_table('inventory_items')
    op.drop_index('ix_warehouses_code', table_name='warehouses')
    op.drop_index(op.f('ix_warehouses_id'), table_name='warehouses')
    op.drop_table('warehouses')
    op.drop_index('ix_drawback_credits_credit_number', table_name='drawback_credits')
    op.drop_index(op.f('ix_drawback_credits_id'), table_name='drawback_credits')
    op.drop_table('drawback_credits')
    op.drop_index('ix_drawback_acts_act_number', table_name='drawback_acts')
    op.drop_index(op.f('ix_drawback_acts_id'), table_name='drawback_acts')
    op.drop_table('drawback_acts')
    op.drop_constraint('fk_export_processes_product', 'export_processes', type_='foreignkey')
    op.drop_column('export_processes', 'product_id')
    op.drop_constraint('fk_import_processes_product', 'import_processes', type_='foreignkey')
    op.drop_column('import_processes', 'product_id')
    op.drop_index('ix_products_ncm', table_name='products')
    op.drop_index('ix_products_code', table_name='products')
    op.drop_index(op.f('ix_products_id'), table_name='products')
    op.drop_table('products')
    op.drop_index(op.f('ix_product_categories_id'), table_name='product_categories')
    op.drop_table('product_categories')

