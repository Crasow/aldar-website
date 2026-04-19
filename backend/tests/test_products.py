import pytest


def test_get_products_public(client):
    """Test GET /products is public (no auth required)"""
    response = client.get("/api/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_product_without_token(client):
    """Test POST /products requires authentication"""
    response = client.post(
        "/api/products/",
        json={
            "name": "Test Product",
            "weight_packaging": "1kg",
            "price": 100.0,
            "category_id": 1
        }
    )
    assert response.status_code == 401


def test_create_product_with_token(client, auth_headers):
    """Test successful product creation with token"""
    # First create a category
    cat_response = client.post(
        "/api/categories/",
        json={"name": "Test Cat", "description": "Test"},
        headers=auth_headers
    )
    category_id = cat_response.json()["id"]

    # Create product
    response = client.post(
        "/api/products/",
        json={
            "name": "Test Product",
            "weight_packaging": "1kg",
            "price": 150.5,
            "category_id": category_id
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["weight_packaging"] == "1kg"
    assert data["price"] == 150.5


def test_get_products_filter_by_category(client, auth_headers):
    """Test GET /products with category_id filter"""
    # Create two categories
    cat1_response = client.post(
        "/api/categories/",
        json={"name": "Cat1", "description": ""},
        headers=auth_headers
    )
    cat1_id = cat1_response.json()["id"]

    cat2_response = client.post(
        "/api/categories/",
        json={"name": "Cat2", "description": ""},
        headers=auth_headers
    )
    cat2_id = cat2_response.json()["id"]

    # Create products in different categories
    client.post(
        "/api/products/",
        json={"name": "Prod1", "weight_packaging": "1kg", "price": 100, "category_id": cat1_id},
        headers=auth_headers
    )
    client.post(
        "/api/products/",
        json={"name": "Prod2", "weight_packaging": "2kg", "price": 200, "category_id": cat2_id},
        headers=auth_headers
    )

    # Filter by cat1
    response = client.get(f"/api/products/?category_id={cat1_id}")
    assert response.status_code == 200
    products = response.json()
    assert len(products) == 1
    assert products[0]["name"] == "Prod1"
    assert products[0]["category_id"] == cat1_id


def test_update_product_without_token(client):
    """Test PUT /products/{id} requires authentication"""
    response = client.put(
        "/api/products/999",
        json={"name": "Updated", "weight_packaging": "1kg", "price": 100, "category_id": 1}
    )
    assert response.status_code == 401


def test_delete_product_without_token(client):
    """Test DELETE /products/{id} requires authentication"""
    response = client.delete("/api/products/999")
    assert response.status_code == 401
