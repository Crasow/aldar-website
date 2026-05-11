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
            description="Премиум свежая свиная вырезка",
            price=450.0,
            category_id=categories[0].id,
            is_active=True,
        ),
        Product(
            name="Говяжье филе",
            description="Высокосортное говяжье филе",
            price=580.0,
            category_id=categories[0].id,
            is_active=True,
        ),
        Product(
            name="Копченая грудинка",
            description="Традиционно копченая свиная грудинка",
            price=320.0,
            category_id=categories[1].id,
            is_active=True,
        ),
        Product(
            name="Любительская колбаса",
            description="Домашняя колбаса по традиционному рецепту",
            price=280.0,
            category_id=categories[2].id,
            is_active=True,
        ),
        Product(
            name="Печень куриная",
            description="Свежая куриная печень",
            price=120.0,
            category_id=categories[3].id,
            is_active=True,
        ),
        Product(
            name="Котлеты мясные",
            description="Готовые мясные котлеты для быстрого приготовления",
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
            title="Мясник",
            description="Требуется опытный мясник для работы на производстве",
            requirements="Опыт работы не менее 3 лет, знание техники безопасности",
            salary="500-700 грн",
            is_active=True,
        ),
        Vacancy(
            title="Технолог-мясник",
            description="Технолог для разработки новых рецептов и контроля качества",
            requirements="Диплом по специальности, опыт в пищевой промышленности",
            salary="800-1200 грн",
            is_active=True,
        ),
        Vacancy(
            title="Водитель",
            description="Водитель для доставки продукции клиентам",
            requirements="Водительское удостоверение категории C, опыт вождения",
            salary="400-600 грн",
            is_active=True,
        ),
        Vacancy(
            title="Менеджер по продажам",
            description="Поиск и развитие новых клиентов",
            requirements="Опыт в B2B продажах, коммуникативность",
            salary="600-1000 грн + бонусы",
            is_active=True,
        ),
        Vacancy(
            title="Упаковщик",
            description="Упаковка готовой продукции",
            requirements="Аккуратность, внимание к деталям",
            salary="350-450 грн",
            is_active=True,
        ),
    ]
    for vacancy in vacancies:
        existing = db.query(Vacancy).filter_by(title=vacancy.title).first()
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
            full_name="Иван Петренко",
            email="ivan.petrenko@email.com",
            phone="+380501234567",
            message="Я имею 5 лет опыта работы мясником. Готов к сотрудничеству.",
            is_active=True,
        ),
        VacancyApplication(
            vacancy_id=vacancies[0].id,
            full_name="Сергей Коваленко",
            email="sergey.kovalenko@email.com",
            phone="+380502345678",
            message="Интересует должность мясника. Готов пройти собеседование.",
            is_active=True,
        ),
        VacancyApplication(
            vacancy_id=vacancies[1].id,
            full_name="Александр Климов",
            email="alex.klimov@email.com",
            phone="+380503456789",
            message="Технолог с 7 годами опыта в мясной промышленности.",
            is_active=True,
        ),
        VacancyApplication(
            vacancy_id=vacancies[2].id,
            full_name="Виктор Шевченко",
            email="viktor.shevchenko@email.com",
            phone="+380504567890",
            message="Водитель с опытом доставки. Знаю город.",
            is_active=True,
        ),
        VacancyApplication(
            vacancy_id=vacancies[3].id,
            full_name="Оксана Лисак",
            email="oksana.lisak@email.com",
            phone="+380505678901",
            message="Менеджер по продажам. Ищу работу на постоянной основе.",
            is_active=True,
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
