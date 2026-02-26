# ALDAR ZS - Мясокомбинат

Современный веб-сайт для мясокомбината "ALDAR ZS" с функционалом каталога продукции и HR-портала.

## Структура проекта

```
aldar-web/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Модели данных SQLAlchemy
│   │   ├── routers/        # API роутеры
│   │   ├── schemas/        # Pydantic схемы
│   │   └── services/       # Бизнес-логика
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/         # Страницы
│   │   └── services/      # API сервисы
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Docker конфигурация
└── README.md
```

## Функционал

### Продукция
- Каталог с фильтрацией по категориям (Сыры, Курятина, Свинина, Полуфабрикаты)
- Генерация и скачивание PDF прайс-листов
- Адаптивный дизайн для всех устройств

### Вакансии
- Список актуальных вакансий
- Форма отклика с валидацией
- Управление заявками через админ-панель

### Контакты
- Интерактивная карта
- Контактная информация
- Мессенджеры для быстрой связи

## Технологии

- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, Ant Design, Styled Components
- **Deployment**: Docker, Docker Compose

## Запуск проекта

### Через Docker Compose (рекомендуемый способ)

1. Клонировать репозиторий:
```bash
git clone <repository-url>
cd aldar-web
```

2. Запустить проект:
```bash
docker-compose up --build
```

3. Открыть в браузере:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API документация: http://localhost:8000/docs

### Ручной запуск

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## API Эндпоинты

### Categories
- `GET /api/categories` - Получить все категории
- `POST /api/categories` - Создать категорию
- `PUT /api/categories/{id}` - Обновить категорию
- `DELETE /api/categories/{id}` - Удалить категорию

### Products
- `GET /api/products` - Получить все товары (с фильтрацией по категории)
- `POST /api/products` - Создать товар
- `PUT /api/products/{id}` - Обновить товар
- `DELETE /api/products/{id}` - Удалить товар

### Vacancies
- `GET /api/vacancies` - Получить все вакансии
- `POST /api/vacancies` - Создать вакансию
- `PUT /api/vacancies/{id}` - Обновить вакансию
- `DELETE /api/vacancies/{id}` - Удалить вакансию

### Applications
- `GET /api/applications` - Получить все заявки
- `POST /api/applications` - Создать заявку

### Price List
- `GET /api/price-list/download` - Скачать PDF прайс-лист

## Структура данных

### Product
- id, name, weight_packaging, price
- category_id (ForeignKey), is_active
- created_at, updated_at

### Category
- id, name, description, is_active
- created_at

### Vacancy
- id, job_title, description
- requirements, salary, is_active
- created_at, updated_at

### VacancyApplication
- id, vacancy_id, name, phone, email
- resume_link, created_at

## Особенности

- **Украинский интерфейс**: Вся информация и контент представлены на украинском языке
- **PDF експорт**: Автоматична генерація прайс-листів
- **Валідація**: Клієнтська та серверна валідація форм
- **Адаптивність**: Оптимізація для мобільних пристроїв
- **SEO**: Оптимізація для пошукових систем

## Лицензия

© 2026 ALDAR ZS. Все права защищены.