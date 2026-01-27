# AGENTS.md
This document provides guidelines for AI agents working on this codebase.
## Backend (Python - FastAPI)
### Commands
- **Run development server:**
  ```bash
  cd backend/
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```
- **Install/update dependencies:**
  The project uses `uv`. Dependencies are listed in `pyproject.toml`.
  ```bash
  cd backend/
  uv pip sync pyproject.toml
  ```
- **Run tests:**
  The project appears to use pytest.
  ```bash
  cd backend/
  # Run all tests
  pytest
  # Run a single test file
  pytest tests/test_main.py
  # Run a specific test function
  pytest tests/test_main.py::test_read_root
  ```
- **Linting & Formatting:**
  No specific linting or formatting tools are configured. Adhere strictly to the existing code style. We can assume `black` for formatting and `ruff` for linting.
### Code Style
- **Formatting:** Follows `black` conventions.
- **Imports:**
  - Standard library imports first.
  - Third-party library imports next.
  - Application-specific imports last.
  - Example:
    ```python
    from datetime import datetime
    from fastapi import FastAPI
    from sqlalchemy.orm import Session
    from app.models.database import get_db
    ```
- **Naming Conventions:**
  - **Variables/Functions:** `snake_case` (e.g., `user_name`, `get_all_users`).
  - **Classes:** `PascalCase` (e.g., `Product`, `Category`).
  - **Constants:** `UPPER_SNAKE_CASE` (e.g., `DATABASE_URL`).
- **Typing:**
  - Use Python type hints extensively for function arguments, return values, and variables.
  - Pydantic models are used for API request/response schemas (`app/schemas/schemas.py`).
  - SQLAlchemy models define the database structure (`app/models/database.py`).
- **Error Handling:**
  - Use `fastapi.HTTPException` for standard HTTP errors.
- **Database:**
  - Database sessions are managed via FastAPI's dependency injection system (`Depends(get_db)`).
  - All database models inherit from a declarative `Base` in `app/models/database.py`.
---
## Frontend (JavaScript - React)
### Commands
- **Run development server:**
  ```bash
  cd frontend/
  npm start
  ```
- **Install/update dependencies:**
  ```bash
  cd frontend/
  npm install
  ```
- **Run tests:**
  ```bash
  cd frontend/
  # Run all tests in watch mode
  npm run test
  # Run tests for a single file
  npm run test -- src/App.test.js
  ```
  Note: You may need to press `a` to run all tests if it starts in watch mode.
- **Build for production:**
  ```bash
  cd frontend/
  npm run build
  ```
- **Linting:**
  The project uses the default Create React App ESLint configuration.
  ```bash
  cd frontend/
  npm run lint
  ```
  (Note: a `lint` script may need to be added to `package.json` if not present: `"lint": "eslint src"`).
### Code Style
- **Formatting:** Use standard Prettier formatting.
- **Component Structure:**
  - Components are organized into `pages` and `components`.
  - Functional components with hooks are preferred over class components.
- **Imports:**
  - React and library imports first.
  - Component/page imports next.
  - CSS and other asset imports last.
  ```javascript
  import React from 'react';
  import { Layout } from 'antd';
  import Navbar from './components/Navbar';
  import './App.css';
  ```
- **Naming Conventions:**
  - **Components:** `PascalCase` (e.g., `ProductList`).
  - **Functions/Variables:** `camelCase` (e.g., `fetchProducts`).
  - **CSS Classes:** `kebab-case` (e.g., `product-card`).
- **State Management:**
  - For simple component-level state, use `useState` and `useEffect`.
  - For cross-component or global state, `react-query` is used for server state.
- **Styling:**
  - `antd` is the primary UI component library.
  - Global styles are in `App.css`.
  - `styled-components` is available for component-specific styling.
- **API Calls:**
  - Use `axios` for making HTTP requests to the backend.
  - API calls should be managed within `react-query` hooks (`useQuery`, `useMutation`) for caching, refetching, and error handling. The proxy is set to `http://localhost:8000` in `package.json`.
- **Error Handling:**
  - Use `react-query`'s error state to handle API errors.
  - Use standard JavaScript `try...catch` blocks for synchronous code.