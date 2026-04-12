import os

from fastapi import FastAPI, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.models.database import get_db, create_tables
from app.routers import categories, products, vacancies, applications, auth
from app.services.pdf_service import generate_price_list
from app.services.seed_data import seed_dev_data

create_tables()

if (os.getenv("ENVIRONMENT") or os.getenv("ENV") or "development").lower() != "production":
    seed_dev_data()

app = FastAPI(
    title="ALDAR ZS API", description="API для мясокомбината ALDAR ZS", version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(vacancies.router, prefix="/api/vacancies", tags=["vacancies"])
app.include_router(
    applications.router, prefix="/api/applications", tags=["applications"]
)


@app.get("/")
async def root():
    return {"message": "ALDAR ZS API"}


@app.get("/api/price-list/download")
async def download_price_list(category_id: int = None, db: Session = Depends(get_db)):
    pdf_data = generate_price_list(db, category_id)
    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=price_list.pdf"},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
