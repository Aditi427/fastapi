from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from datetime import datetime
from app.api.deps import CurrentUser, SessionDep
from app.models import Expense, User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_dashboard_stats(
    *,
    session: SessionDep,
    current_user: CurrentUser,
):
    """Get dashboard statistics for the current user"""
    
    # Get total expenses
    total_expenses = session.exec(
        select(func.sum(Expense.amount)).where(Expense.owner_id == current_user.id)
    ).one() or 0.00
    
    # Get user's monthly income (from User model)
    user = session.get(User, current_user.id)
    total_income = user.monthly_income if user else 0.00
    
    # Calculate savings
    savings = total_income - total_expenses
    
    # Get recent expenses (last 5)
    recent_expenses = session.exec(
        select(Expense)
        .where(Expense.owner_id == current_user.id)
        .order_by(Expense.expense_date.desc())
        .limit(5)
    ).all()
    
    # Simple category breakdown
    category_breakdown = {}
    expenses_by_category = session.exec(
        select(Expense.category_id, func.sum(Expense.amount))
        .where(Expense.owner_id == current_user.id)
        .group_by(Expense.category_id)
    ).all()
    
    for category_id, total in expenses_by_category:
        category_breakdown[str(category_id)] = float(total) if total else 0.00
    
    return {
        "total_income": float(total_income),
        "total_expenses": float(total_expenses),
        "savings": float(savings),
        "recent_expenses": recent_expenses,
        "category_breakdown": category_breakdown,
    }