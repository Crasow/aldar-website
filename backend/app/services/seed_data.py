import os
from typing import List

from sqlalchemy.orm import Session

from app.models.database import Category, Product, Vacancy, SessionLocal


def _is_production() -> bool:
    env = os.getenv("ENVIRONMENT") or os.getenv("ENV") or "development"
    return env.lower() == "production"


def _get_or_create_category(db: Session, name: str, description: str = "") -> Category:
    category = db.query(Category).filter(Category.name == name).first()
    if category is None:
        category = Category(name=name, description=description)
        db.add(category)
        db.commit()
        db.refresh(category)
    return category


def _ensure_products(db: Session, products: List[dict]) -> None:
    for item in products:
        exists = (
            db.query(Product)
            .filter(
                Product.name == item["name"],
                Product.category_id == item["category_id"],
            )
            .first()
        )
        if exists is not None:
            continue

        product = Product(
            name=item["name"],
            weight_packaging=item["weight_packaging"],
            price=item["price"],
            category_id=item["category_id"],
        )
        db.add(product)
    db.commit()


def _ensure_vacancies(db: Session, vacancies: List[dict]) -> None:
    for item in vacancies:
        exists = (
            db.query(Vacancy)
            .filter(
                Vacancy.job_title == item["job_title"],
                Vacancy.salary == item["salary"],
            )
            .first()
        )
        if exists is not None:
            continue

        vacancy = Vacancy(
            job_title=item["job_title"],
            description=item["description"],
            requirements=item["requirements"],
            salary=item["salary"],
        )
        db.add(vacancy)
    db.commit()


def seed_dev_data() -> None:
    """
    Populate database with demo data for local development.

    This function is safe to call multiple times (idempotent) and
    is automatically skipped in production environment.
    """
    if _is_production():
        return

    db = SessionLocal()
    try:
        # Categories
        kovbasy = _get_or_create_category(
            db,
            name="Ковбасні вироби",
            description="Різноманітні варені, копчені та напівкопчені ковбаси.",
        )
        napivfabrykaty = _get_or_create_category(
            db,
            name="Напівфабрикати",
            description="Готові до приготування напівфабрикати з м'яса.",
        )
        misyaso = _get_or_create_category(
            db,
            name="Свіже м'ясо",
            description="Свіже охолоджене м'ясо яловичини та свинини.",
        )

        # Products
        products_payload = [
            {
                "name": "Ковбаса варена «Докторська»",
                "weight_packaging": "0.5 кг",
                "price": 145.0,
                "category_id": kovbasy.id,
            },
            {
                "name": "Ковбаса напівкопчена «Мисливська»",
                "weight_packaging": "0.3 кг",
                "price": 165.0,
                "category_id": kovbasy.id,
            },
            {
                "name": "Фарш свинячий",
                "weight_packaging": "1 кг",
                "price": 190.0,
                "category_id": napivfabrykaty.id,
            },
            {
                "name": "Пельмені «Домашні»",
                "weight_packaging": "0.9 кг",
                "price": 210.0,
                "category_id": napivfabrykaty.id,
            },
            {
                "name": "Свинина ошийок",
                "weight_packaging": "1 кг",
                "price": 220.0,
                "category_id": misyaso.id,
            },
            {
                "name": "Яловичина лопаткова частина",
                "weight_packaging": "1 кг",
                "price": 260.0,
                "category_id": misyaso.id,
            },
        ]
        _ensure_products(db, products_payload)

        # Vacancies
        vacancies_payload = [
            {
                "job_title": "Менеджер з продажу",
                "description": (
                    "Робота з клієнтами, прийом та обробка замовлень, "
                    "підтримка довгострокових відносин з партнерами."
                ),
                "requirements": (
                    "Досвід роботи від 1 року у сфері продажів; "
                    "комунікабельність; бажання розвиватись."
                ),
                "salary": "від 20 000 грн + бонуси",
            },
            {
                "job_title": "Технолог з м'ясного виробництва",
                "description": (
                    "Контроль технологічних процесів, розробка нових видів продукції, "
                    "дотримання стандартів якості."
                ),
                "requirements": (
                    "Профільна освіта; досвід роботи технологом буде перевагою; "
                    "знання стандартів HACCP."
                ),
                "salary": "договірна",
            },
            {
                "job_title": "Оператор виробничої лінії",
                "description": (
                    "Обслуговування та налаштування обладнання на виробничій лінії, "
                    "контроль якості продукції."
                ),
                "requirements": (
                    "Відповідальність, уважність; бажано досвід роботи на виробництві."
                ),
                "salary": "18 000–22 000 грн",
            },
        ]
        _ensure_vacancies(db, vacancies_payload)
    finally:
        db.close()

