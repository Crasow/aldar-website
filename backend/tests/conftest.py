import os
import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from fastapi.testclient import TestClient
from app.models.database import Base, User
from app.services.auth_service import hash_password, create_access_token


# Set test environment to disable seed data
os.environ["ENVIRONMENT"] = "testing"


# In-memory SQLite for testing with proper thread handling
@pytest.fixture(scope="function")
def db_session():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )

    # Enable foreign keys for SQLite
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    yield db
    db.close()


@pytest.fixture(scope="function")
def client(db_session):
    """FastAPI test client with overridden DB dependency"""
    def override_get_db():
        yield db_session

    from app.models.database import get_db

    # Import app AFTER setting up the test environment
    from main import app

    app.dependency_overrides[get_db] = override_get_db

    test_client = TestClient(app)
    yield test_client

    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def admin_user(db_session):
    """Create a test admin user"""
    user = User(
        username="testadmin",
        hashed_password=hash_password("testpass123")
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def auth_token(admin_user):
    """Generate a valid JWT token for the test admin"""
    token = create_access_token(data={"sub": admin_user.username})
    return token


@pytest.fixture(scope="function")
def auth_headers(auth_token):
    """Authorization headers with Bearer token"""
    return {"Authorization": f"Bearer {auth_token}"}
