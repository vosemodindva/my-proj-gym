import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
def test_register_api_returns_tokens():
    client = APIClient()
    data = {
        "username": "apitest",
        "email": "api@test.com",
        "password": "verysecure"
    }
    response = client.post("/api/register/", data)
    assert response.status_code == 201
    assert "access" in response.data
    assert "refresh" in response.data


@pytest.mark.django_db
def test_login_api_returns_tokens():
    client = APIClient()
    data = {
        "username": "loginuser",
        "password": "testpass123"
    }
    response = client.post("/api/token/", data)
    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data


@pytest.mark.django_db
def test_profile_api_requires_authentication():
    client = APIClient()
    response = client.get("/api/profile/")
    assert response.status_code == 401  # Unauthorized


@pytest.mark.django_db
def test_profile_api_authenticated_access():
    client = APIClient()
    login = client.post("/api/token/", {"username": "withtoken",
                                        "password": "test123"})
    access_token = login.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    response = client.get("/api/profile/")
    assert response.status_code == 200
    assert response.data["username"] == "withtoken"
    assert response.data["email"] == "e@mail.com"
