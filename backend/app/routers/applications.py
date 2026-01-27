from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.database import get_db, VacancyApplication
from app.schemas.schemas import (
    VacancyApplication as VacancyApplicationSchema,
    VacancyApplicationCreate,
)

router = APIRouter()


@router.get("/", response_model=List[VacancyApplicationSchema])
async def get_applications(db: Session = Depends(get_db)):
    applications = db.query(VacancyApplication).all()
    return applications


@router.post("/", response_model=VacancyApplicationSchema)
async def create_application(
    application: VacancyApplicationCreate, db: Session = Depends(get_db)
):
    db_application = VacancyApplication(**application.model_dump())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


@router.get("/{application_id}", response_model=VacancyApplicationSchema)
async def get_application(application_id: int, db: Session = Depends(get_db)):
    application = (
        db.query(VacancyApplication)
        .filter(VacancyApplication.id == application_id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application
