"""Add tracking_events, compliance_checks, comments, comment_attachments tables

Revision ID: add_tracking_compliance_comments
Revises: 8cba861c7fec
Create Date: 2025-01-03 17:35:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision: str = 'add_tracking_compliance_comments'
down_revision: Union[str, None] = '8cba861c7fec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create tracking_events table
    op.create_table(
        'tracking_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('shipment_id', sa.String(), nullable=False),
        sa.Column('container_number', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=False),  # Enum stored as String in SQLite
        sa.Column('location', sa.String(), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('vessel', sa.String(), nullable=True),
        sa.Column('port', sa.String(), nullable=True),
        sa.Column('port_code', sa.String(), nullable=True),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('import_process_id', sa.Integer(), nullable=True),
        sa.Column('export_process_id', sa.Integer(), nullable=True),
        sa.Column('container_id', sa.Integer(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('external_id', sa.String(), nullable=True),
        sa.Column('raw_data', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.ForeignKeyConstraint(['import_process_id'], ['import_processes.id'], ),
        sa.ForeignKeyConstraint(['export_process_id'], ['export_processes.id'], ),
        sa.ForeignKeyConstraint(['container_id'], ['containers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tracking_events_id'), 'tracking_events', ['id'], unique=False)
    op.create_index('ix_tracking_events_shipment_id', 'tracking_events', ['shipment_id'], unique=False)
    op.create_index('ix_tracking_events_container_number', 'tracking_events', ['container_number'], unique=False)
    op.create_index('ix_tracking_events_timestamp', 'tracking_events', ['timestamp'], unique=False)

    # Create compliance_checks table
    op.create_table(
        'compliance_checks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),  # Enum stored as String
        sa.Column('status', sa.String(), nullable=True),  # Enum stored as String
        sa.Column('required', sa.Boolean(), nullable=True),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('action_required', sa.Text(), nullable=True),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('import_process_id', sa.Integer(), nullable=True),
        sa.Column('export_process_id', sa.Integer(), nullable=True),
        sa.Column('checked_at', sa.DateTime(), nullable=True),
        sa.Column('checked_by', sa.Integer(), nullable=True),
        sa.Column('checked_by_name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('rule_id', sa.String(), nullable=True),
        sa.Column('rule_version', sa.String(), nullable=True),
        sa.Column('source', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.ForeignKeyConstraint(['import_process_id'], ['import_processes.id'], ),
        sa.ForeignKeyConstraint(['export_process_id'], ['export_processes.id'], ),
        sa.ForeignKeyConstraint(['checked_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_compliance_checks_id'), 'compliance_checks', ['id'], unique=False)

    # Create comments table
    op.create_table(
        'comments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('mentions', sa.Text(), nullable=True),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('import_process_id', sa.Integer(), nullable=True),
        sa.Column('export_process_id', sa.Integer(), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('parent_comment_id', sa.Integer(), nullable=True),
        sa.Column('attachments', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('deleted', sa.Boolean(), nullable=True),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('deleted_by', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.ForeignKeyConstraint(['import_process_id'], ['import_processes.id'], ),
        sa.ForeignKeyConstraint(['export_process_id'], ['export_processes.id'], ),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['parent_comment_id'], ['comments.id'], ),
        sa.ForeignKeyConstraint(['deleted_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_comments_id'), 'comments', ['id'], unique=False)
    op.create_index('ix_comments_created_at', 'comments', ['created_at'], unique=False)

    # Create comment_attachments table
    op.create_table(
        'comment_attachments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('file_name', sa.String(), nullable=False),
        sa.Column('file_path', sa.String(), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=True),
        sa.Column('mime_type', sa.String(), nullable=True),
        sa.Column('comment_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['comment_id'], ['comments.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_comment_attachments_id'), 'comment_attachments', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_comment_attachments_id'), table_name='comment_attachments')
    op.drop_table('comment_attachments')
    op.drop_index('ix_comments_created_at', table_name='comments')
    op.drop_index(op.f('ix_comments_id'), table_name='comments')
    op.drop_table('comments')
    op.drop_index(op.f('ix_compliance_checks_id'), table_name='compliance_checks')
    op.drop_table('compliance_checks')
    op.drop_index('ix_tracking_events_timestamp', table_name='tracking_events')
    op.drop_index('ix_tracking_events_container_number', table_name='tracking_events')
    op.drop_index('ix_tracking_events_shipment_id', table_name='tracking_events')
    op.drop_index(op.f('ix_tracking_events_id'), table_name='tracking_events')
    op.drop_table('tracking_events')

