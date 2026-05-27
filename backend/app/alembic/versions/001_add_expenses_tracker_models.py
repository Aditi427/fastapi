"""Add expenses tracker models (Category, Expense, Budget, Income)

Revision ID: 001_add_expenses
Revises: 1a31ce608336
Create Date: 2026-05-26 21:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
import uuid


# revision identifiers, used by Alembic.
revision = '001_add_expenses'
down_revision = '1a31ce608336'
branch_labels = None
depends_on = None


def upgrade():
    # Create category table
    op.create_table(
        'category',
        sa.Column('id', sa.UUID(), nullable=False, default=uuid.uuid4),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_category_name'), 'category', ['name'], unique=False)
    op.create_index(op.f('ix_category_owner_id'), 'category', ['owner_id'], unique=False)

    # Create expense table
    op.create_table(
        'expense',
        sa.Column('id', sa.UUID(), nullable=False, default=uuid.uuid4),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('expense_date', sa.DateTime(), nullable=False),
        sa.Column('category_id', sa.UUID(), nullable=False),
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['category.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_expense_category_id'), 'expense', ['category_id'], unique=False)
    op.create_index(op.f('ix_expense_owner_id'), 'expense', ['owner_id'], unique=False)
    op.create_index(op.f('ix_expense_expense_date'), 'expense', ['expense_date'], unique=False)

    # Create budget table
    op.create_table(
        'budget',
        sa.Column('id', sa.UUID(), nullable=False, default=uuid.uuid4),
        sa.Column('limit_amount', sa.Float(), nullable=False),
        sa.Column('period', sa.String(), nullable=False),
        sa.Column('category_id', sa.UUID(), nullable=False),
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['category.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_budget_category_id'), 'budget', ['category_id'], unique=False)
    op.create_index(op.f('ix_budget_owner_id'), 'budget', ['owner_id'], unique=False)

    # Create income table
    op.create_table(
        'income',
        sa.Column('id', sa.UUID(), nullable=False, default=uuid.uuid4),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('income_date', sa.DateTime(), nullable=False),
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_income_owner_id'), 'income', ['owner_id'], unique=False)
    op.create_index(op.f('ix_income_income_date'), 'income', ['income_date'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_income_income_date'), table_name='income')
    op.drop_index(op.f('ix_income_owner_id'), table_name='income')
    op.drop_table('income')
    op.drop_index(op.f('ix_budget_owner_id'), table_name='budget')
    op.drop_index(op.f('ix_budget_category_id'), table_name='budget')
    op.drop_table('budget')
    op.drop_index(op.f('ix_expense_expense_date'), table_name='expense')
    op.drop_index(op.f('ix_expense_owner_id'), table_name='expense')
    op.drop_index(op.f('ix_expense_category_id'), table_name='expense')
    op.drop_table('expense')
    op.drop_index(op.f('ix_category_owner_id'), table_name='category')
    op.drop_index(op.f('ix_category_name'), table_name='category')
    op.drop_table('category')