import uuid
from typing import Any
from datetime import datetime

from sqlmodel import Session, select, func

from app.core.security import get_password_hash, verify_password
from app import models
from app.models import (
    User,
    UserCreate,
    UserUpdate,
    Item,
    ItemCreate,
    Category,
    CategoryCreate,
    CategoryUpdate,
    Expense,
    ExpenseCreate,
    ExpenseUpdate,
    Budget,
    BudgetCreate,
    BudgetUpdate,
    Income,
    IncomeCreate,
    IncomeUpdate,
)


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


# ============================================================================
# Category CRUD Operations
# ============================================================================
def create_category(
    *, session: Session, category_in: CategoryCreate, owner_id: uuid.UUID
) -> Category:
    db_category = Category.model_validate(
        category_in, update={"owner_id": owner_id, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()}
    )
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category


def get_category(*, session: Session, category_id: uuid.UUID, owner_id: uuid.UUID) -> Category | None:
    statement = select(Category).where(
        Category.id == category_id, Category.owner_id == owner_id
    )
    return session.exec(statement).first()


def get_user_categories(*, session: Session, owner_id: uuid.UUID, skip: int = 0, limit: int = 100) -> tuple[list[Category], int]:
    statement = select(Category).where(Category.owner_id == owner_id).offset(skip).limit(limit)
    categories = session.exec(statement).all()
    count_statement = select(Category).where(Category.owner_id == owner_id)
    count = len(session.exec(count_statement).all())
    return categories, count


def update_category(
    *, session: Session, db_category: Category, category_in: CategoryUpdate
) -> Category:
    update_data = category_in.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    db_category.sqlmodel_update(update_data)
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category


def delete_category(*, session: Session, db_category: Category) -> None:
    session.delete(db_category)
    session.commit()


# ============================================================================
# Expense CRUD Operations
# ============================================================================
def create_expense(
    *, session: Session, expense_in: ExpenseCreate, owner_id: uuid.UUID
) -> Expense:
    db_expense = Expense.model_validate(
        expense_in, update={"owner_id": owner_id, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()}
    )
    session.add(db_expense)
    session.commit()
    session.refresh(db_expense)
    return db_expense


def get_expense(*, session: Session, expense_id: uuid.UUID, owner_id: uuid.UUID) -> Expense | None:
    statement = select(Expense).where(
        Expense.id == expense_id, Expense.owner_id == owner_id
    )
    return session.exec(statement).first()


def get_user_expenses(
    *,
    session: Session,
    owner_id: uuid.UUID,
    category_id: uuid.UUID | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    skip: int = 0,
    limit: int = 100,
) -> tuple[list[Expense], int]:
    # Build query
    statement = select(Expense).where(Expense.owner_id == owner_id)
    
    if category_id:
        statement = statement.where(Expense.category_id == category_id)
    if start_date:
        statement = statement.where(Expense.expense_date >= start_date)
    if end_date:
        statement = statement.where(Expense.expense_date <= end_date)
    
    statement = statement.order_by(Expense.expense_date.desc()).offset(skip).limit(limit)
    expenses = session.exec(statement).all()
    
    # Load categories for each expense
    for expense in expenses:
        if expense.category_id:
            category = session.get(Category, expense.category_id)
            if category:
                expense.category = category
    
    # Count total
    count_statement = select(func.count()).select_from(Expense).where(Expense.owner_id == owner_id)
    if category_id:
        count_statement = count_statement.where(Expense.category_id == category_id)
    if start_date:
        count_statement = count_statement.where(Expense.expense_date >= start_date)
    if end_date:
        count_statement = count_statement.where(Expense.expense_date <= end_date)
    
    count = session.exec(count_statement).one()
    
    return expenses, count


def update_expense(
    *, session: Session, db_expense: Expense, expense_in: ExpenseUpdate
) -> Expense:
    update_data = expense_in.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    db_expense.sqlmodel_update(update_data)
    session.add(db_expense)
    session.commit()
    session.refresh(db_expense)
    return db_expense


def delete_expense(*, session: Session, db_expense: Expense) -> None:
    session.delete(db_expense)
    session.commit()


# ============================================================================
# Budget CRUD Operations
# ============================================================================
def create_budget(
    *, session: Session, budget_in: BudgetCreate, owner_id: uuid.UUID
) -> Budget:
    db_budget = Budget.model_validate(
        budget_in, update={"owner_id": owner_id, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()}
    )
    session.add(db_budget)
    session.commit()
    session.refresh(db_budget)
    return db_budget


def get_budget(*, session: Session, budget_id: uuid.UUID, owner_id: uuid.UUID) -> Budget | None:
    statement = select(Budget).where(
        Budget.id == budget_id, Budget.owner_id == owner_id
    )
    return session.exec(statement).first()


def get_user_budgets(*, session: Session, owner_id: uuid.UUID, skip: int = 0, limit: int = 100) -> tuple[list[Budget], int]:
    statement = select(Budget).where(Budget.owner_id == owner_id).offset(skip).limit(limit)
    budgets = session.exec(statement).all()
    count_statement = select(Budget).where(Budget.owner_id == owner_id)
    count = len(session.exec(count_statement).all())
    return budgets, count


def get_budget_by_category(*, session: Session, category_id: uuid.UUID, owner_id: uuid.UUID) -> Budget | None:
    statement = select(Budget).where(
        Budget.category_id == category_id, Budget.owner_id == owner_id
    )
    return session.exec(statement).first()


def update_budget(
    *, session: Session, db_budget: Budget, budget_in: BudgetUpdate
) -> Budget:
    update_data = budget_in.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    db_budget.sqlmodel_update(update_data)
    session.add(db_budget)
    session.commit()
    session.refresh(db_budget)
    return db_budget


def delete_budget(*, session: Session, db_budget: Budget) -> None:
    session.delete(db_budget)
    session.commit()


# ============================================================================
# Income CRUD Operations
# ============================================================================
def create_income(
    *, session: Session, income_in: IncomeCreate, owner_id: uuid.UUID
) -> Income:
    db_income = Income.model_validate(
        income_in, update={"owner_id": owner_id, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()}
    )
    session.add(db_income)
    session.commit()
    session.refresh(db_income)
    return db_income


def get_income(*, session: Session, income_id: uuid.UUID, owner_id: uuid.UUID) -> Income | None:
    statement = select(Income).where(
        Income.id == income_id, Income.owner_id == owner_id
    )
    return session.exec(statement).first()


def get_user_incomes(
    *,
    session: Session,
    owner_id: uuid.UUID,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    skip: int = 0,
    limit: int = 100,
) -> tuple[list[Income], int]:
    statement = select(Income).where(Income.owner_id == owner_id)
    if start_date:
        statement = statement.where(Income.income_date >= start_date)
    if end_date:
        statement = statement.where(Income.income_date <= end_date)
    statement = statement.order_by(Income.income_date.desc()).offset(skip).limit(limit)
    incomes = session.exec(statement).all()
    
    count_statement = select(Income).where(Income.owner_id == owner_id)
    if start_date:
        count_statement = count_statement.where(Income.income_date >= start_date)
    if end_date:
        count_statement = count_statement.where(Income.income_date <= end_date)
    count = len(session.exec(count_statement).all())
    return incomes, count


def update_income(
    *, session: Session, db_income: Income, income_in: IncomeUpdate
) -> Income:
    update_data = income_in.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    db_income.sqlmodel_update(update_data)
    session.add(db_income)
    session.commit()
    session.refresh(db_income)
    return db_income


def delete_income(*, session: Session, db_income: Income) -> None:
    session.delete(db_income)
    session.commit()