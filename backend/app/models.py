import uuid
from datetime import datetime

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)
    monthly_income: float = Field(default=0.0, ge=0)  # ADD THIS
    budget: float = Field(default=0.0, ge=0)  # ADD THIS

class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)
    monthly_income: float = Field(default=0.0, ge=0)  # ADD THIS LINE
    budget: float = Field(default=0.0, ge=0)  # ADD THIS LINE

# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    monthly_income: float = Field(default=0.0, ge=0)  # ← ADD THIS LINE
    budget: float = Field(default=0.0, ge=0)  # ← ADD THIS LINE
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    categories: list["Category"] = Relationship(back_populates="owner", cascade_delete=True)
    expenses: list["Expense"] = Relationship(back_populates="owner", cascade_delete=True)
    budgets: list["Budget"] = Relationship(back_populates="owner", cascade_delete=True)
    incomes: list["Income"] = Relationship(back_populates="owner", cascade_delete=True)

# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# ============================================================================
# Category Models
# ============================================================================
class CategoryBase(SQLModel):
    name: str = Field(min_length=1, max_length=100, index=True)
    description: str | None = Field(default=None, max_length=255)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    name: str | None = Field(default=None, min_length=1, max_length=100)  # type: ignore


class Category(CategoryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    owner: User | None = Relationship(back_populates="categories")
    expenses: list["Expense"] = Relationship(back_populates="category", cascade_delete=True)
    budgets: list["Budget"] = Relationship(back_populates="category", cascade_delete=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CategoryPublic(CategoryBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class CategoriesPublic(SQLModel):
    data: list[CategoryPublic]
    count: int


# ============================================================================
# Expense Models
# ============================================================================
class ExpenseBase(SQLModel):
    amount: float = Field(gt=0)
    description: str | None = Field(default=None, max_length=255)
    expense_date: datetime


class ExpenseCreate(ExpenseBase):
    category_id: uuid.UUID


class ExpenseUpdate(ExpenseBase):
    category_id: uuid.UUID | None = None
    amount: float | None = Field(default=None, gt=0)  # type: ignore
    expense_date: datetime | None = None  # type: ignore


class Expense(ExpenseBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    category_id: uuid.UUID = Field(foreign_key="category.id", nullable=False, ondelete="CASCADE")
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    category: Category | None = Relationship(back_populates="expenses")
    owner: User | None = Relationship(back_populates="expenses")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ExpensePublic(ExpenseBase):
    id: uuid.UUID
    category_id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    category: CategoryPublic | None = None


class ExpensesPublic(SQLModel):
    data: list[ExpensePublic]
    count: int


# ============================================================================
# Budget Models
# ============================================================================
class BudgetBase(SQLModel):
    limit_amount: float = Field(gt=0)
    period: str = Field(regex="^(daily|weekly|monthly|yearly)$")


class BudgetCreate(BudgetBase):
    category_id: uuid.UUID


class BudgetUpdate(BudgetBase):
    category_id: uuid.UUID | None = None
    limit_amount: float | None = Field(default=None, gt=0)  # type: ignore
    period: str | None = Field(default=None, regex="^(daily|weekly|monthly|yearly)$")  # type: ignore


class Budget(BudgetBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    category_id: uuid.UUID = Field(foreign_key="category.id", nullable=False, ondelete="CASCADE")
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    category: Category | None = Relationship(back_populates="budgets")
    owner: User | None = Relationship(back_populates="budgets")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class BudgetPublic(BudgetBase):
    id: uuid.UUID
    category_id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class BudgetsPublic(SQLModel):
    data: list[BudgetPublic]
    count: int


# ============================================================================
# Income Models
# ============================================================================
class IncomeBase(SQLModel):
    amount: float = Field(gt=0)
    description: str | None = Field(default=None, max_length=255)
    income_date: datetime


class IncomeCreate(IncomeBase):
    pass


class IncomeUpdate(IncomeBase):
    amount: float | None = Field(default=None, gt=0)  # type: ignore
    income_date: datetime | None = None  # type: ignore


class Income(IncomeBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    owner: User | None = Relationship(back_populates="incomes")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class IncomePublic(IncomeBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class IncomesPublic(SQLModel):
    data: list[IncomePublic]
    count: int
