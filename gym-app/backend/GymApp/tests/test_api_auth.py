import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_register_and_login():
    client = APIClient()

    # Регистрация
    registration_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "secure12345"
    }
    response = client.post("/api/register/", registration_data)
    assert response.status_code == 201
    assert "access" in response.data
    assert "refresh" in response.data

    # Авторизация
    login_data = {
        "username": "testuser",
        "password": "secure12345"
    }
    response = client.post("/api/token/", login_data)
    assert response.status_code == 200
    assert "access" in response.data
