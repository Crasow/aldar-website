FROM python:3.13

WORKDIR /app

# System dependencies (fonts for PDF Cyrillic rendering)
RUN apt-get update \
    && apt-get install -y --no-install-recommends fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

# Install uv and sync dependencies only (keeps layer cache when only code changes)
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen --no-install-project

COPY . .
RUN uv sync --frozen

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
