from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm import Session
from typing import List
from app.models.database import get_db, Category, User
from app.schemas.schemas import (
    Category as CategorySchema,
    CategoryCreate,
    CategoryUpdate,
)
from app.services.auth_service import get_current_user

router = APIRouter()


@router.get("/", response_model=List[CategorySchema])
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active).all()
    return categories


@router.post("/", response_model=CategorySchema)
async def create_category(
    category: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    db_category = Category(**category.model_dump())
    db.add(db_category)
    try:
        db.commit()
        db.refresh(db_category)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Category with this name already exists",
        )
    except OperationalError as e:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Database write failed; check permissions or lock",
        ) from e
    return db_category


@router.get("/{category_id}", response_model=CategorySchema)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=CategorySchema)
async def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    for key, value in category.model_dump().items():
        setattr(db_category, key, value)

    try:
        db.commit()
        db.refresh(db_category)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Category with this name already exists",
        )
    except OperationalError as e:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Database write failed; check permissions or lock",
        ) from e
    return db_category


@router.delete("/{category_id}")
async def delete_category(
    category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    db_category.is_active = False
    try:
        db.commit()
    except (IntegrityError, OperationalError) as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail="Failed to update category"
        ) from e
    return {"message": "Category deleted successfully"}
