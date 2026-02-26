# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ALDAR ZS — a product catalog and HR portal website for a meat processing company. Monorepo with a **Python FastAPI backend** and a **React (CRA) frontend**, connected via REST API. The application now targets a single Ukrainian-language audience and uses standard single-language model fields (`name`, etc.).

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
```

## Architecture

### Backend (`backend/`)

- **FastAPI** with **SQLAlchemy** ORM and **SQLite** database (`aldar.db`)
- Python 3.13, dependencies managed with `uv` (`pyproject.toml` + `uv.lock`)
- Entry point: `main.py` — mounts routers under `/api/` prefix, configures CORS (allows `localhost:3000`)

**Key directories:**
- `app/models/database.py` — All SQLAlchemy models (Category, Product, Vacancy, VacancyApplication) + DB engine/session setup
- `app/routers/` — CRUD endpoints for each entity (categories, products, vacancies, applications)
- `app/schemas/schemas.py` — All Pydantic v2 schemas (Base/Create/Update/Response per entity)
- `app/services/pdf_service.py` — ReportLab-based PDF price list generation

**Patterns:**
- All routers use `Depends(get_db)` for session injection
- DELETE endpoints perform **soft deletes** (`is_active = False`), GET endpoints filter by `is_active == True`
- Tables are auto-created at startup via `Base.metadata.create_all()` (no migrations)
- Auth dependencies (`python-jose`, `passlib`) are installed but **not implemented** — all endpoints are unprotected

### Frontend (`frontend/`)

- **React 18** (Create React App, JavaScript — no TypeScript)
- **Ant Design** (`antd`) as primary UI library
- **React Router v6** for client-side routing across 4 pages

**Key directories:**
- `src/pages/` — Home, Catalog, Vacancies, Contacts
- `src/components/` — Navbar, Footer
- `src/services/vacancyService.js` — Axios client for vacancy/application API calls

**Patterns:**
- `package.json` has `"proxy": "http://localhost:8000"` for dev API proxying
- Catalog page uses `fetch` directly; Vacancies page uses `axios` via service layer (inconsistent — prefer `axios`)
- `react-query` is installed but unused; state is managed with `useState`/`useEffect`
- `styled-components` is available but most styling is in `App.css` and Ant Design

### Environment Variables

| Variable | Service | Default |
|----------|---------|---------|
| `DATABASE_URL` | backend | `sqlite:///./aldar.db` |
| `REACT_APP_API_URL` | frontend | `http://localhost:8000` |

## Code Style

### Backend
- `snake_case` for functions/variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants
- Use Python type hints; Pydantic models for request/response schemas
- Import order: stdlib → third-party → application
- Use `fastapi.HTTPException` for error responses

### Frontend
- `PascalCase` for components, `camelCase` for functions/variables, `kebab-case` for CSS classes
- Functional components with hooks (no class components)
- Import order: React/libraries → components/pages → CSS/assets
- Use `axios` for API calls (not `fetch`)
