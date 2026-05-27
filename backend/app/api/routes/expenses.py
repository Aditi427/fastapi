import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app import crud, models
from app.api.deps import CurrentUser, SessionDep

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("/", response_model=models.ExpensePublic)
def create_expense(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    expense_in: models.ExpenseCreate,
) -> models.ExpensePublic:
    """Create a new expense."""
    # Verify category belongs to user
    category = crud.get_category(
        session=session, category_id=expense_in.category_id, owner_id=current_user.id
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    expense = crud.create_expense(
        session=session, expense_in=expense_in, owner_id=current_user.id
    )
    return expense


@router.get("/", response_model=models.ExpensesPublic)
def read_expenses(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    category_id: uuid.UUID | None = Query(None),
    start_date: datetime | None = Query(None),
    end_date: datetime | None = Query(None),
    skip: int = 0,
    limit: int = 100,
) -> models.ExpensesPublic:
    """
    Get all expenses for the current user with optional filtering.
    
    - **category_id**: Filter by category (optional)
    - **start_date**: Filter expenses from this date onwards (optional)
    - **end_date**: Filter expenses up to this date (optional)
    """
    expenses, count = crud.get_user_expenses(
        session=session,
        owner_id=current_user.id,
        category_id=category_id,
        start_date=start_date,
        end_date=end_date,
        skip=skip,
        limit=limit,
    )
    return models.ExpensesPublic(data=expenses, count=count)


@router.get("/", response_model=models.ExpensesPublic)
def read_expenses(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    category_id: uuid.UUID | None = Query(None),
    start_date: datetime | None = Query(None),
    end_date: datetime | None = Query(None),
    skip: int = 0,
    limit: int = 100,
) -> models.ExpensesPublic:
    """
    Get all expenses for the current user with optional filtering.
    """
    from sqlmodel import select, func
    
    # Build query - this will automatically load relationships
    statement = select(models.Expense).where(models.Expense.owner_id == current_user.id)
    
    if category_id:
        statement = statement.where(models.Expense.category_id == category_id)
    if start_date:
        statement = statement.where(models.Expense.expense_date >= start_date)
    if end_date:
        statement = statement.where(models.Expense.expense_date <= end_date)
    
    statement = statement.order_by(models.Expense.expense_date.desc()).offset(skip).limit(limit)
    results = session.exec(statement)
    expenses = results.unique().all()  # Use .unique() to handle relationship joins
    
    # Count total
    count_statement = select(func.count()).select_from(models.Expense).where(models.Expense.owner_id == current_user.id)
    if category_id:
        count_statement = count_statement.where(models.Expense.category_id == category_id)
    if start_date:
        count_statement = count_statement.where(models.Expense.expense_date >= start_date)
    if end_date:
        count_statement = count_statement.where(models.Expense.expense_date <= end_date)
    count = session.exec(count_statement).one()
    
    return models.ExpensesPublic(data=expenses, count=count)


@router.put("/{expense_id}", response_model=models.ExpensePublic)
def update_expense(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    expense_id: uuid.UUID,
    expense_in: models.ExpenseUpdate,
) -> models.ExpensePublic:
    """Update an expense."""
    expense = crud.get_expense(
        session=session, expense_id=expense_id, owner_id=current_user.id
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # If category is being updated, verify it belongs to user
    if expense_in.category_id:
        category = crud.get_category(
            session=session, category_id=expense_in.category_id, owner_id=current_user.id
        )
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    expense = crud.update_expense(session=session, db_expense=expense, expense_in=expense_in)
    return expense


@router.delete("/{expense_id}")
def delete_expense(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    expense_id: uuid.UUID,
) -> models.Message:
    """Delete an expense."""
    expense = crud.get_expense(
        session=session, expense_id=expense_id, owner_id=current_user.id
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    crud.delete_expense(session=session, db_expense=expense)
    return models.Message(message="Expense deleted successfully")
