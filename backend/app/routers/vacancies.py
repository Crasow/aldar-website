from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.database import get_db, Vacancy, User
from app.schemas.schemas import Vacancy as VacancySchema, VacancyCreate, VacancyUpdate
from app.services.auth_service import get_current_user

router = APIRouter()


@router.get("/", response_model=List[VacancySchema])
async def get_vacancies(db: Session = Depends(get_db)):
    vacancies = db.query(Vacancy).filter(Vacancy.is_active).all()
    return vacancies


@router.post("/", response_model=VacancySchema)
async def create_vacancy(
    vacancy: VacancyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    db_vacancy = Vacancy(**vacancy.model_dump())
    db.add(db_vacancy)
    db.commit()
    db.refresh(db_vacancy)
    return db_vacancy


@router.get("/{vacancy_id}", response_model=VacancySchema)
async def get_vacancy(vacancy_id: int, db: Session = Depends(get_db)):
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return vacancy


@router.put("/{vacancy_id}", response_model=VacancySchema)
async def update_vacancy(
    vacancy_id: int,
    vacancy: VacancyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not db_vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    for key, value in vacancy.model_dump().items():
        setattr(db_vacancy, key, value)

    db.commit()
    db.refresh(db_vacancy)
    return db_vacancy


@router.delete("/{vacancy_id}")
async def delete_vacancy(
    vacancy_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    db_vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not db_vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    db_vacancy.is_active = False
    db.commit()
    return {"message": "Vacancy deleted successfully"}
