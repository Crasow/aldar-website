import pytest
from app.models.database import User
from app.services.auth_service import verify_password


def test_login_success(client, admin_user):
    """Test successful login with correct credentials"""
    response = client.post(
        "/api/auth/login",
        params={"username": "testadmin", "password": "testpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, admin_user):
    """Test login fails with incorrect password"""
    response = client.post(
        "/api/auth/login",
        params={"username": "testadmin", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "detail" in response.json()


def test_login_nonexistent_user(client):
    """Test login fails for non-existent user"""
    response = client.post(
        "/api/auth/login",
        params={"username": "nonexistent", "password": "password"}
    )
    assert response.status_code == 401


def test_register_without_token(client):
    """Test register endpoint requires authentication"""
    response = client.post(
        "/api/auth/register",
        params={"username": "newadmin", "password": "newpass123"}
    )
    assert response.status_code == 401


def test_register_with_token(client, admin_user, auth_token, db_session):
    """Test successful registration with valid token"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post(
        "/api/auth/register",
        json={"username": "newadmin", "password": "newpass123"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Verify new user can login
    login_response = client.post(
        "/api/auth/login",
        params={"username": "newadmin", "password": "newpass123"}
    )
    assert login_response.status_code == 200


def test_register_duplicate_username(client, admin_user, auth_token):
    """Test register fails with duplicate username"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post(
        "/api/auth/register",
        json={"username": "testadmin", "password": "newpass"},
        headers=headers
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]
