import pytest


def test_get_vacancies_public(client):
    """Test GET /vacancies is public (no auth required)"""
    response = client.get("/api/vacancies/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_vacancy_without_token(client):
    """Test POST /vacancies requires authentication"""
    response = client.post(
        "/api/vacancies/",
        json={
            "job_title": "Test Job",
            "description": "Test description",
            "requirements": "Test requirements",
            "salary": "50000"
        }
    )
    assert response.status_code == 401


def test_create_vacancy_with_token(client, auth_headers):
    """Test successful vacancy creation with token"""
    response = client.post(
        "/api/vacancies/",
        json={
            "job_title": "Senior Developer",
            "description": "We are looking for a senior developer",
            "requirements": "5+ years experience",
            "salary": "100000 - 120000"
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["job_title"] == "Senior Developer"
    assert data["description"] == "We are looking for a senior developer"
    assert data["is_active"] is True


def test_update_vacancy_without_token(client):
    """Test PUT /vacancies/{id} requires authentication"""
    response = client.put(
        "/api/vacancies/999",
        json={
            "job_title": "Updated",
            "description": "Updated",
            "requirements": "Updated",
            "salary": "Updated"
        }
    )
    assert response.status_code == 401


def test_delete_vacancy_without_token(client):
    """Test DELETE /vacancies/{id} requires authentication"""
    response = client.delete("/api/vacancies/999")
    assert response.status_code == 401


def test_delete_vacancy_soft_delete(client, auth_headers):
    """Test that DELETE performs soft delete"""
    # Create vacancy
    create_response = client.post(
        "/api/vacancies/",
        json={
            "job_title": "Temporary Job",
            "description": "Will be deleted",
            "requirements": "None",
            "salary": "50000"
        },
        headers=auth_headers
    )
    vacancy_id = create_response.json()["id"]

    # Delete it
    delete_response = client.delete(
        f"/api/vacancies/{vacancy_id}",
        headers=auth_headers
    )
    assert delete_response.status_code == 200

    # Verify it's not in GET anymore
    get_response = client.get("/api/vacancies/")
    job_titles = [v["job_title"] for v in get_response.json()]
    assert "Temporary Job" not in job_titles
