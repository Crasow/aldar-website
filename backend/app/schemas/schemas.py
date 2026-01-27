from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    name_kz: str
    description: Optional[str] = None
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class Category(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class ProductBase(BaseModel):
    name: str
    name_kz: str
    weight_packaging: str
    price: float
    category_id: int
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class Product(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    category: Category


class VacancyBase(BaseModel):
    job_title: str
    job_title_kz: str
    description: str
    description_kz: str
    requirements: str
    requirements_kz: str
    salary: str
    is_active: bool = True


class VacancyCreate(VacancyBase):
    pass


class VacancyUpdate(VacancyBase):
    pass


class Vacancy(VacancyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class VacancyApplicationBase(BaseModel):
    vacancy_id: int
    name: str
    phone: str
    email: str
    resume_link: Optional[str] = None


class VacancyApplicationCreate(VacancyApplicationBase):
    pass


class VacancyApplication(VacancyApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
