import pytest


def test_create_application_public(client, auth_headers):
    """Test POST /applications is public (candidates apply without auth)"""
    # Create a vacancy first
    vacancy_response = client.post(
        "/api/vacancies/",
        json={
            "job_title": "Test Job",
            "description": "Test",
            "requirements": "Test",
            "salary": "50000"
        },
        headers=auth_headers
    )
    vacancy_id = vacancy_response.json()["id"]

    # Apply without token
    response = client.post(
        "/api/applications/",
        json={
            "vacancy_id": vacancy_id,
            "name": "John Doe",
            "phone": "+380991234567",
            "email": "john@example.com",
            "resume_link": "https://example.com/resume"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["phone"] == "+380991234567"
    assert data["email"] == "john@example.com"


def test_get_applications_without_token(client):
    """Test GET /applications requires authentication (admin-only)"""
    response = client.get("/api/applications/")
    assert response.status_code == 401


def test_get_applications_with_token(client, auth_headers, auth_token):
    """Test GET /applications with valid token"""
    response = client.get("/api/applications/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_application_by_id_without_token(client):
    """Test GET /applications/{id} requires authentication"""
    response = client.get("/api/applications/999")
    assert response.status_code == 401


def test_get_application_by_id_with_token(client, auth_headers):
    """Test GET /applications/{id} with valid token"""
    response = client.get("/api/applications/999", headers=auth_headers)
    # 404 is expected (application doesn't exist), not 401 (auth error)
    assert response.status_code == 404
