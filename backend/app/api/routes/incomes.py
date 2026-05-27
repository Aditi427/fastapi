import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app import crud, models
from app.api.deps import CurrentUser, SessionDep

router = APIRouter(prefix="/incomes", tags=["incomes"])


@router.post("/", response_model=models.IncomePublic)
def create_income(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    income_in: models.IncomeCreate,
) -> models.IncomePublic:
    """Create a new income record."""
    income = crud.create_income(
        session=session, income_in=income_in, owner_id=current_user.id
    )
    return income


@router.get("/", response_model=models.IncomesPublic)
def read_incomes(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    start_date: datetime | None = Query(None),
    end_date: datetime | None = Query(None),
    skip: int = 0,
    limit: int = 100,
) -> models.IncomesPublic:
    """
    Get all income records for the current user with optional date filtering.
    
    - **start_date**: Filter income from this date onwards (optional)
    - **end_date**: Filter income up to this date (optional)
    """
    incomes, count = crud.get_user_incomes(
        session=session,
        owner_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
        skip=skip,
        limit=limit,
    )
    return models.IncomesPublic(data=incomes, count=count)


@router.get("/{income_id}", response_model=models.IncomePublic)
def read_income(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    income_id: uuid.UUID,
) -> models.IncomePublic:
    """Get a specific income record by ID."""
    income = crud.get_income(
        session=session, income_id=income_id, owner_id=current_user.id
    )
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")
    return income


@router.put("/{income_id}", response_model=models.IncomePublic)
def update_income(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    income_id: uuid.UUID,
    income_in: models.IncomeUpdate,
) -> models.IncomePublic:
    """Update an income record."""
    income = crud.get_income(
        session=session, income_id=income_id, owner_id=current_user.id
    )
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")
    
    income = crud.update_income(session=session, db_income=income, income_in=income_in)
    return income


@router.delete("/{income_id}")
def delete_income(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    income_id: uuid.UUID,
) -> models.Message:
    """Delete an income record."""
    income = crud.get_income(
        session=session, income_id=income_id, owner_id=current_user.id
    )
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")
    crud.delete_income(session=session, db_income=income)
    return models.Message(message="Income record deleted successfully")
