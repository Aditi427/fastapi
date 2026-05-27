import uuid
from datetime import datetime, timedelta
from enum import Enum

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, SQLModel

from app import crud, models
from app.api.deps import CurrentUser, SessionDep

router = APIRouter(prefix="/analytics", tags=["analytics"])


class PeriodType(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"


class ExpenseSummaryByCategory(SQLModel):
    category_id: uuid.UUID
    category_name: str
    total_amount: float
    count: int
    budget_limit: float | None = None
    remaining_budget: float | None = None


class DailySummary(SQLModel):
    date: datetime
    total_expenses: float
    total_income: float
    count_expenses: int


class AnalyticsSummary(SQLModel):
    period: str
    start_date: datetime
    end_date: datetime
    total_expenses: float
    total_income: float
    net_amount: float
    by_category: list[ExpenseSummaryByCategory]


class DashboardData(SQLModel):
    total_expenses_this_month: float
    total_income_this_month: float
    balance_this_month: float
    total_categories: int
    recent_expenses: list[models.ExpensePublic]
    recent_income: list[models.IncomePublic]
    categories_summary: list[ExpenseSummaryByCategory]


def get_period_dates(period: PeriodType, reference_date: datetime | None = None) -> tuple[datetime, datetime]:
    """Get start and end dates for a given period."""
    if reference_date is None:
        reference_date = datetime.utcnow()
    
    if period == PeriodType.daily:
        start = reference_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=1) - timedelta(microseconds=1)
    elif period == PeriodType.weekly:
        start = reference_date - timedelta(days=reference_date.weekday())
        start = start.replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=7) - timedelta(microseconds=1)
    elif period == PeriodType.monthly:
        start = reference_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if reference_date.month == 12:
            end = start.replace(year=start.year + 1, month=1) - timedelta(microseconds=1)
        else:
            end = start.replace(month=start.month + 1) - timedelta(microseconds=1)
    elif period == PeriodType.yearly:
        start = reference_date.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        end = start.replace(year=start.year + 1) - timedelta(microseconds=1)
    else:
        start = reference_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=1) - timedelta(microseconds=1)
    
    return start, end


@router.get("/summary", response_model=AnalyticsSummary)
def get_summary(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    period: PeriodType = Query(PeriodType.monthly),
    date: datetime | None = Query(None),
) -> AnalyticsSummary:
    """
    Get expense summary by category for a given period.
    
    - **period**: daily, weekly, monthly, or yearly
    - **date**: Reference date for the period (defaults to today)
    """
    start_date, end_date = get_period_dates(period, date)
    
    # Get expenses for the period
    expenses, _ = crud.get_user_expenses(
        session=session,
        owner_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
    )
    
    # Get income for the period
    incomes, _ = crud.get_user_incomes(
        session=session,
        owner_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
    )
    
    # Calculate totals
    total_expenses = sum(e.amount for e in expenses)
    total_income = sum(i.amount for i in incomes)
    
    # Group expenses by category
    category_summary: dict[uuid.UUID, dict] = {}
    for expense in expenses:
        if expense.category_id not in category_summary:
            category_summary[expense.category_id] = {
                "category_id": expense.category_id,
                "category_name": expense.category.name if expense.category else "Unknown",
                "total_amount": 0,
                "count": 0,
            }
        category_summary[expense.category_id]["total_amount"] += expense.amount
        category_summary[expense.category_id]["count"] += 1
    
    # Add budget information to categories
    by_category: list[ExpenseSummaryByCategory] = []
    for cat_id, cat_data in category_summary.items():
        budget = crud.get_budget_by_category(
            session=session, category_id=cat_id, owner_id=current_user.id
        )
        budget_limit = budget.limit_amount if budget else None
        remaining = budget_limit - cat_data["total_amount"] if budget_limit else None
        
        by_category.append(
            ExpenseSummaryByCategory(
                category_id=cat_data["category_id"],
                category_name=cat_data["category_name"],
                total_amount=cat_data["total_amount"],
                count=cat_data["count"],
                budget_limit=budget_limit,
                remaining_budget=remaining,
            )
        )
    
    return AnalyticsSummary(
        period=period.value,
        start_date=start_date,
        end_date=end_date,
        total_expenses=total_expenses,
        total_income=total_income,
        net_amount=total_income - total_expenses,
        by_category=by_category,
    )


@router.get("/daily-breakdown", response_model=list[DailySummary])
def get_daily_breakdown(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    start_date: datetime,
    end_date: datetime,
) -> list[DailySummary]:
    """
    Get daily summary of expenses and income for a date range.
    
    - **start_date**: Start date for the range
    - **end_date**: End date for the range
    """
    # Get expenses and income for the date range
    expenses, _ = crud.get_user_expenses(
        session=session,
        owner_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
    )
    
    incomes, _ = crud.get_user_incomes(
        session=session,
        owner_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
    )
    
    # Group by date
    daily_data: dict[str, dict] = {}
    
    for expense in expenses:
        date_key = expense.expense_date.date().isoformat()
        if date_key not in daily_data:
            daily_data[date_key] = {
                "date": expense.expense_date.date(),
                "total_expenses": 0,
                "total_income": 0,
                "count_expenses": 0,
            }
        daily_data[date_key]["total_expenses"] += expense.amount
        daily_data[date_key]["count_expenses"] += 1
    
    for income in incomes:
        date_key = income.income_date.date().isoformat()
        if date_key not in daily_data:
            daily_data[date_key] = {
                "date": income.income_date.date(),
                "total_expenses": 0,
                "total_income": 0,
                "count_expenses": 0,
            }
        daily_data[date_key]["total_income"] += income.amount
    
    # Convert to sorted list
    result = [
        DailySummary(
            date=datetime.combine(v["date"], datetime.min.time()),
            total_expenses=v["total_expenses"],
            total_income=v["total_income"],
            count_expenses=v["count_expenses"],
        )
        for v in sorted(daily_data.values(), key=lambda x: x["date"])
    ]
    
    return result


@router.get("/dashboard", response_model=DashboardData)
def get_dashboard(
    *,
    session: SessionDep,
    current_user: CurrentUser,
) -> DashboardData:
    """Get dashboard data with current month summary and recent records."""
    # Get current month dates
    now = datetime.utcnow()
    start_date, end_date = get_period_dates(PeriodType.monthly, now)
    
    # Get expenses and income for this month
    expenses, _ = crud.get_user_expenses(
        session=session,
        owner_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
        limit=1000,
    )
    
    incomes, _ = crud.get_user_incomes(
        session=session,
        owner_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
        limit=1000,
    )
    
    # Get recent records (last 5)
    recent_expenses, _ = crud.get_user_expenses(
        session=session, owner_id=current_user.id, limit=5
    )
    
    recent_incomes, _ = crud.get_user_incomes(
        session=session, owner_id=current_user.id, limit=5
    )
    
    # Get total categories
    categories, total_categories = crud.get_user_categories(
        session=session, owner_id=current_user.id, limit=1000
    )
    
    # Calculate totals
    total_expenses = sum(e.amount for e in expenses)
    total_income = sum(i.amount for i in incomes)
    
    # Group expenses by category
    category_summary: dict[uuid.UUID, dict] = {}
    for expense in expenses:
        if expense.category_id not in category_summary:
            category_summary[expense.category_id] = {
                "category_id": expense.category_id,
                "category_name": expense.category.name if expense.category else "Unknown",
                "total_amount": 0,
                "count": 0,
            }
        category_summary[expense.category_id]["total_amount"] += expense.amount
        category_summary[expense.category_id]["count"] += 1
    
    # Add budget information to categories
    by_category: list[ExpenseSummaryByCategory] = []
    for cat_id, cat_data in category_summary.items():
        budget = crud.get_budget_by_category(
            session=session, category_id=cat_id, owner_id=current_user.id
        )
        budget_limit = budget.limit_amount if budget else None
        remaining = budget_limit - cat_data["total_amount"] if budget_limit else None
        
        by_category.append(
            ExpenseSummaryByCategory(
                category_id=cat_data["category_id"],
                category_name=cat_data["category_name"],
                total_amount=cat_data["total_amount"],
                count=cat_data["count"],
                budget_limit=budget_limit,
                remaining_budget=remaining,
            )
        )
    
    return DashboardData(
        total_expenses_this_month=total_expenses,
        total_income_this_month=total_income,
        balance_this_month=total_income - total_expenses,
        total_categories=total_categories,
        recent_expenses=recent_expenses,
        recent_income=recent_incomes,
        categories_summary=by_category,
    )
