#!/usr/bin/env python3
"""Script to populate database with test data."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.models.database import SessionLocal, engine, Base
from app.models.database import Category, Product, Vacancy, VacancyApplication, User
from app.services.auth_service import hash_password

def populate_categories(db: Session):
    """Create test categories."""
    categories = [
        Category(name="Свіжатина"),
        Category(name="Копченые изделия"),
        Category(name="Колбасные изделия"),
        Category(name="Субпродукты"),
        Category(name="Мясные полуфабрикаты"),
    ]
    for cat in categories:
        existing = db.query(Category).filter_by(name=cat.name).first()
        if not existing:
            db.add(cat)
    db.commit()
    print("✓ Categories created")
    return db.query(Category).all()

def populate_products(db: Session, categories):
    """Create test products."""
    products = [
        Product(
            name="Свиная вырезка",
            weight_packaging="0.5 кг",
            price=450.0,
            category_id=categories[0].id,
            is_active=True,
        ),
        Product(
            name="Говяжье филе",
            weight_packaging="0.7 кг",
            price=580.0,
            category_id=categories[0].id,
            is_active=True,
        ),
        Product(
            name="Копченая грудинка",
            weight_packaging="0.4 кг",
            price=320.0,
            category_id=categories[1].id,
            is_active=True,
        ),
        Product(
            name="Любительская колбаса",
            weight_packaging="0.3 кг",
            price=280.0,
            category_id=categories[2].id,
            is_active=True,
        ),
        Product(
            name="Печень куриная",
            weight_packaging="0.2 кг",
            price=120.0,
            category_id=categories[3].id,
            is_active=True,
        ),
        Product(
            name="Котлеты мясные",
            weight_packaging="0.25 кг",
            price=200.0,
            category_id=categories[4].id,
            is_active=True,
        ),
    ]
    for prod in products:
        existing = db.query(Product).filter_by(name=prod.name).first()
        if not existing:
            db.add(prod)
    db.commit()
    print("✓ Products created")

def populate_vacancies(db: Session):
    """Create test vacancies."""
    vacancies = [
        Vacancy(
            job_title="Мясник",
            description="Требуется опытный мясник для работы на производстве",
            requirements="Опыт работы не менее 3 лет, знание техники безопасности",
            salary="500-700 грн",
            is_active=True,
        ),
        Vacancy(
            job_title="Технолог-мясник",
            description="Технолог для разработки новых рецептов и контроля качества",
            requirements="Диплом по специальности, опыт в пищевой промышленности",
            salary="800-1200 грн",
            is_active=True,
        ),
        Vacancy(
            job_title="Водитель",
            description="Водитель для доставки продукции клиентам",
            requirements="Водительское удостоверение категории C, опыт вождения",
            salary="400-600 грн",
            is_active=True,
        ),
        Vacancy(
            job_title="Менеджер по продажам",
            description="Поиск и развитие новых клиентов",
            requirements="Опыт в B2B продажах, коммуникативность",
            salary="600-1000 грн + бонусы",
            is_active=True,
        ),
        Vacancy(
            job_title="Упаковщик",
            description="Упаковка готовой продукции",
            requirements="Аккуратность, внимание к деталям",
            salary="350-450 грн",
            is_active=True,
        ),
    ]
    for vacancy in vacancies:
        existing = db.query(Vacancy).filter_by(job_title=vacancy.job_title).first()
        if not existing:
            db.add(vacancy)
    db.commit()
    print("✓ Vacancies created")
    return db.query(Vacancy).all()

def populate_applications(db: Session, vacancies):
    """Create test vacancy applications."""
    applications = [
        VacancyApplication(
            vacancy_id=vacancies[0].id,
            name="Иван Петренко",
            email="ivan.petrenko@email.com",
            phone="+380501234567",
            resume_link="https://example.com/ivan-resume.pdf",
        ),
        VacancyApplication(
            vacancy_id=vacancies[0].id,
            name="Сергей Коваленко",
            email="sergey.kovalenko@email.com",
            phone="+380502345678",
            resume_link="https://example.com/sergey-resume.pdf",
        ),
        VacancyApplication(
            vacancy_id=vacancies[1].id,
            name="Александр Климов",
            email="alex.klimov@email.com",
            phone="+380503456789",
            resume_link="https://example.com/alex-resume.pdf",
        ),
        VacancyApplication(
            vacancy_id=vacancies[2].id,
            name="Виктор Шевченко",
            email="viktor.shevchenko@email.com",
            phone="+380504567890",
            resume_link="https://example.com/viktor-resume.pdf",
        ),
        VacancyApplication(
            vacancy_id=vacancies[3].id,
            name="Оксана Лисак",
            email="oksana.lisak@email.com",
            phone="+380505678901",
            resume_link="https://example.com/oksana-resume.pdf",
        ),
    ]
    for app in applications:
        existing = db.query(VacancyApplication).filter_by(
            email=app.email, vacancy_id=app.vacancy_id
        ).first()
        if not existing:
            db.add(app)
    db.commit()
    print("✓ Vacancy applications created")

def populate_users(db: Session):
    """Create test admin users."""
    users = [
        User(
            username="admin",
            hashed_password=hash_password("admin"),
        ),
        User(
            username="manager",
            hashed_password=hash_password("manager123"),
        ),
        User(
            username="technologist",
            hashed_password=hash_password("tech123"),
        ),
    ]
    for user in users:
        existing = db.query(User).filter_by(username=user.username).first()
        if not existing:
            db.add(user)
    db.commit()
    print("✓ Users created")

def main():
    """Populate database with test data."""
    print("Populating database with test data...")

    db = SessionLocal()
    try:
        categories = populate_categories(db)
        populate_products(db, categories)
        vacancies = populate_vacancies(db)
        populate_applications(db, vacancies)
        populate_users(db)
        print("\n✓ Database populated successfully!")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
