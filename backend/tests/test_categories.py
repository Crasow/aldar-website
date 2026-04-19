import pytest


def test_get_categories_public(client):
    """Test GET /categories is public (no auth required)"""
    response = client.get("/api/categories/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_category_without_token(client):
    """Test POST /categories requires authentication"""
    response = client.post(
        "/api/categories/",
        json={"name": "New Category", "description": "Test"}
    )
    assert response.status_code == 401


def test_create_category_with_token(client, auth_headers):
    """Test successful category creation with token"""
    response = client.post(
        "/api/categories/",
        json={"name": "Test Category", "description": "A test category"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Category"
    assert data["description"] == "A test category"
    assert data["is_active"] is True


def test_update_category_without_token(client, db_session):
    """Test PUT /categories/{id} requires authentication"""
    response = client.put(
        "/api/categories/999",
        json={"name": "Updated", "description": "Test"}
    )
    assert response.status_code == 401


def test_update_category_with_token(client, auth_headers, db_session):
    """Test successful category update with token"""
    # Create category first
    create_response = client.post(
        "/api/categories/",
        json={"name": "Original", "description": "Original desc"},
        headers=auth_headers
    )
    category_id = create_response.json()["id"]

    # Update it
    update_response = client.put(
        f"/api/categories/{category_id}",
        json={"name": "Updated", "description": "Updated desc"},
        headers=auth_headers
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["name"] == "Updated"
    assert data["description"] == "Updated desc"


def test_delete_category_without_token(client):
    """Test DELETE /categories/{id} requires authentication"""
    response = client.delete("/api/categories/999")
    assert response.status_code == 401


def test_delete_category_soft_delete(client, auth_headers):
    """Test that DELETE performs soft delete (is_active = False)"""
    # Create category
    create_response = client.post(
        "/api/categories/",
        json={"name": "To Delete", "description": "Test"},
        headers=auth_headers
    )
    category_id = create_response.json()["id"]

    # Delete it
    delete_response = client.delete(
        f"/api/categories/{category_id}",
        headers=auth_headers
    )
    assert delete_response.status_code == 200

    # Verify it's not in GET anymore
    get_response = client.get("/api/categories/")
    category_names = [c["name"] for c in get_response.json()]
    assert "To Delete" not in category_names
