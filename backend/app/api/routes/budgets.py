import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import crud, models
from app.api.deps import CurrentUser, SessionDep

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.post("/", response_model=models.BudgetPublic)
def create_budget(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    budget_in: models.BudgetCreate,
) -> models.BudgetPublic:
    """Create a new budget for a category."""
    # Verify category belongs to user
    category = crud.get_category(
        session=session, category_id=budget_in.category_id, owner_id=current_user.id
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if budget already exists for this category
    existing_budget = crud.get_budget_by_category(
        session=session, category_id=budget_in.category_id, owner_id=current_user.id
    )
    if existing_budget:
        raise HTTPException(
            status_code=400,
            detail="Budget already exists for this category. Update it instead.",
        )
    
    budget = crud.create_budget(
        session=session, budget_in=budget_in, owner_id=current_user.id
    )
    return budget


@router.get("/", response_model=models.BudgetsPublic)
def read_budgets(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> models.BudgetsPublic:
    """Get all budgets for the current user."""
    budgets, count = crud.get_user_budgets(
        session=session, owner_id=current_user.id, skip=skip, limit=limit
    )
    return models.BudgetsPublic(data=budgets, count=count)


@router.get("/{budget_id}", response_model=models.BudgetPublic)
def read_budget(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    budget_id: uuid.UUID,
) -> models.BudgetPublic:
    """Get a specific budget by ID."""
    budget = crud.get_budget(
        session=session, budget_id=budget_id, owner_id=current_user.id
    )
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@router.put("/{budget_id}", response_model=models.BudgetPublic)
def update_budget(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    budget_id: uuid.UUID,
    budget_in: models.BudgetUpdate,
) -> models.BudgetPublic:
    """Update a budget."""
    budget = crud.get_budget(
        session=session, budget_id=budget_id, owner_id=current_user.id
    )
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    # If category is being updated, verify it belongs to user and no budget exists
    if budget_in.category_id and budget_in.category_id != budget.category_id:
        category = crud.get_category(
            session=session, category_id=budget_in.category_id, owner_id=current_user.id
        )
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        existing_budget = crud.get_budget_by_category(
            session=session, category_id=budget_in.category_id, owner_id=current_user.id
        )
        if existing_budget:
            raise HTTPException(
                status_code=400,
                detail="Budget already exists for this category.",
            )
    
    budget = crud.update_budget(session=session, db_budget=budget, budget_in=budget_in)
    return budget


@router.delete("/{budget_id}")
def delete_budget(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    budget_id: uuid.UUID,
) -> models.Message:
    """Delete a budget."""
    budget = crud.get_budget(
        session=session, budget_id=budget_id, owner_id=current_user.id
    )
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    crud.delete_budget(session=session, db_budget=budget)
    return models.Message(message="Budget deleted successfully")
