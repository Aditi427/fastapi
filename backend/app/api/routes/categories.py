import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import crud, models
from app.api.deps import CurrentUser, SessionDep

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", response_model=models.CategoryPublic)
def create_category(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    category_in: models.CategoryCreate,
) -> models.CategoryPublic:
    """Create a new expense category."""
    category = crud.create_category(
        session=session, category_in=category_in, owner_id=current_user.id
    )
    return category


@router.get("/", response_model=models.CategoriesPublic)
def read_categories(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> models.CategoriesPublic:
    """Get all categories for the current user."""
    categories, count = crud.get_user_categories(
        session=session, owner_id=current_user.id, skip=skip, limit=limit
    )
    return models.CategoriesPublic(data=categories, count=count)


@router.get("/{category_id}", response_model=models.CategoryPublic)
def read_category(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    category_id: uuid.UUID,
) -> models.CategoryPublic:
    """Get a specific category by ID."""
    category = crud.get_category(
        session=session, category_id=category_id, owner_id=current_user.id
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=models.CategoryPublic)
def update_category(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    category_id: uuid.UUID,
    category_in: models.CategoryUpdate,
) -> models.CategoryPublic:
    """Update a category."""
    category = crud.get_category(
        session=session, category_id=category_id, owner_id=current_user.id
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category = crud.update_category(session=session, db_category=category, category_in=category_in)
    return category


@router.delete("/{category_id}")
def delete_category(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    category_id: uuid.UUID,
) -> models.Message:
    """Delete a category."""
    category = crud.get_category(
        session=session, category_id=category_id, owner_id=current_user.id
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    crud.delete_category(session=session, db_category=category)
    return models.Message(message="Category deleted successfully")
