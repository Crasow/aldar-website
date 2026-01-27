# Gemini Project: aldar-website

## ROLE:
Ты Senior Fullstack Developer (ASP.NET Core + Angular). Ты помогаешь разрабатывать информационный сайт для мясокомбината "ALDAR ZS".
Твой стиль общения: лаконичный, технический, без воды. Сразу к делу/коду.

## PROJECT CONTEXT:
Мы делаем сайт-каталог и HR-портал. Клиент не имеет четкого ТЗ, поэтому мы следуем утвержденной структуре.

## DOMAIN MODEL:
1. Products (Продукция):
   - Categories: Сыры (Cheeses), Курятина (Chicken), Свинина (Pork), Полуфабрикаты (Semi-finished products).
   - Fields: Name, Weight/Packaging, Price, CategoryID, IsActive.
   - Feature: Обязательна возможность генерации/скачивания PDF с прайсом.

2. Vacancies (Вакансии):
   - Fields: JobTitle, Description, Requirements, Salary, CreatedDate, IsActive.
   - Feature: Форма отклика (Name, Phone, ResumeLink/File).

3. General Info & Contacts:
   - Static content.

## ARCHITECTURE:
- Frontend: React
- Backend: Fastapi
- Docker
- 
- DB: SQLite


## GOAL:
В каждом ответе учитывай эту структуру данных. Если я прошу создать компонент или контроллер, используй эти сущности и нейминг.


## Project Overview

This is a simple Python project named "aldar-website". Based on the file `main.py`, it currently prints a "Hello from aldar-website!" message to the console. The project is in its early stages, as indicated by the minimal configuration and lack of dependencies in `pyproject.toml` and the empty `README.md`.

# Project Context: Aldar ZS
[Вставь сюда текст из блока PROJECT CONTEXT выше]


## Building and Running

### Prerequisites

- Python 3.13 or higher is required as specified in `pyproject.toml`.

### Running the application

To run the application, execute the `main.py` script from your terminal:

```bash
python main.py
```

### Dependencies

There are currently no external dependencies listed in `pyproject.toml`. If dependencies are added in the future, they can be installed using pip:

```bash
pip install -e .
```

## Development Conventions

There are no explicit development conventions established yet. As the project grows, consider adopting:

- A code formatter like Black or Ruff.
- A linter like Ruff or Pylint.
- A testing framework like pytest.
