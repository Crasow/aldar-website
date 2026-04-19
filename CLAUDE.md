# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ALDAR ZS — a product catalog and HR portal website for a meat processing company. Monorepo with a **Python FastAPI backend** and a **React (CRA) frontend**, connected via REST API. The application targets a single Ukrainian-language audience and uses standard single-language model fields (`name`, etc.). **All mutating endpoints (POST/PUT/DELETE) are protected by JWT authentication.**

## Commands

### Backend (in `backend/`)

```bash
# Install dependencies (uses uv package manager)
cd backend && uv pip sync pyproject.toml

# Run dev server
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Lint
cd backend && ruff check .

# Format
cd backend && ruff format .

# Run tests
cd backend && pytest -v
```

### Frontend (in `frontend/`)

```bash
# Install dependencies
cd frontend && npm install

# Run dev server (port 3000, proxies /api to localhost:8000)
cd frontend && npm start

# Build for production
cd frontend && npm run build

# Run tests (Jest via CRA)
cd frontend && npm test
# Single file: npm test -- src/App.test.js
```

### Docker (full stack)

```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Swagger docs: http://localhost:8000/docs
# Dev admin: username=admin, password=admin
```

## Architecture

### Backend (`backend/`)

- **FastAPI** with **SQLAlchemy** ORM and **SQLite** database (`aldar.db`)
- Python 3.13, dependencies managed with `uv` (`pyproject.toml` + `uv.lock`)
- Entry point: `main.py` — mounts routers under `/api/` prefix, configures CORS (allows `localhost:3000`)

**Key directories:**
- `app/models/database.py` — All SQLAlchemy models (Category, Product, Vacancy, VacancyApplication, User) + DB engine/session setup
- `app/routers/` — CRUD endpoints for each entity + auth router
  - `auth.py` — Login (`/api/auth/login?username=X&password=Y`) and register endpoints
- `app/schemas/schemas.py` — All Pydantic v2 schemas (Base/Create/Update/Response per entity) + Token/TokenData
- `app/services/pdf_service.py` — ReportLab-based PDF price list generation
- `app/services/auth_service.py` — JWT token creation/verification, password hashing (argon2), OAuth2 dependency

**Patterns:**
- All routers use `Depends(get_db)` for session injection
- **Protected endpoints** (POST/PUT/DELETE) use `Depends(get_current_user)` — requires valid JWT in `Authorization: Bearer <token>`
- **Public endpoints** (GET for categories, products, vacancies) — no auth required
- **Admin-only endpoints** (GET /applications) — require JWT
- DELETE endpoints perform **soft deletes** (`is_active = False`), GET endpoints filter by `is_active == True`
- Tables are auto-created at startup via `Base.metadata.create_all()` (no migrations)

**Authentication:**
- `SECRET_KEY` from env (default: `dev-secret-key-change-in-production`)
- Algorithm: HS256 (HMAC with SHA256)
- Token expiry: 60 minutes (configurable)
- Dev admin auto-seeded: username=`admin`, password=`admin`

### Frontend (`frontend/`)

- **React 18** (Create React App, JavaScript — no TypeScript)
- **Ant Design** (`antd`) as primary UI library
- **React Router v6** for client-side routing across 4 pages
- API client: **axios** (consistent across all services)

**Key directories:**
- `src/pages/` — Home, Catalog, Vacancies, Contacts
- `src/components/` — Navbar, Footer
- `src/services/` — catalogService.js, vacancyService.js (axios-based API clients)

**Patterns:**
- `package.json` has `"proxy": "http://localhost:8000"` for dev API proxying
- All API calls via axios (see catalogService.js and vacancyService.js)
- State is managed with `useState`/`useEffect` (react-query removed as unused)
- Most styling is in `App.css` and Ant Design theming

### Environment Variables

| Variable | Service | Default | Notes |
|----------|---------|---------|-------|
| `DATABASE_URL` | backend | `sqlite:///./aldar.db` | SQLite for local dev, can be PostgreSQL in prod |
| `SECRET_KEY` | backend | `dev-secret-key-change-in-production` | JWT signing key — change in production! |
| `ENVIRONMENT` / `ENV` | backend | `development` | Skip seed data when set to `production` |
| `REACT_APP_API_URL` | frontend | `http://localhost:8000` | Override in production builds |

## Code Style

### Backend
- `snake_case` for functions/variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants
- Use Python type hints; Pydantic models for request/response schemas
- Import order: stdlib → third-party → application
- Use `fastapi.HTTPException` for error responses
- Async/await for route handlers

### Frontend
- `PascalCase` for components, `camelCase` for functions/variables, `kebab-case` for CSS classes
- Functional components with hooks (no class components)
- Import order: React/libraries → components/pages → CSS/assets
- Use `axios` for all API calls (consistent via service layer)

## Auth Usage

### Developer / Testing

```bash
# Get token (dev admin)
curl -X POST "http://localhost:8000/api/auth/login?username=admin&password=admin"
# Response: {"access_token": "eyJ...", "token_type": "bearer"}

# Use token in requests
curl -X POST http://localhost:8000/api/categories/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Category"}'

# Register new admin (requires existing JWT)
curl -X POST "http://localhost:8000/api/auth/register?username=newadmin&password=pass123" \
  -H "Authorization: Bearer <token>"
```

### Production Deployment

1. Set `SECRET_KEY` env var to a strong random string
2. Set `ENVIRONMENT=production` to disable seed data
3. Create first admin via database insert or dedicated CLI (not yet implemented)
