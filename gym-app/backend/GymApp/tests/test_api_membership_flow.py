import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from GymApp.models import Membership

User = get_user_model()


@pytest.mark.django_db
def test_buy_membership_and_profile_update():
    # Создаём пользователя и логинимся
    membership = Membership.objects.create(name="VIP", duration_days=90,
                                           price=2500)

    client = APIClient()
    token = client.post("/api/token/", {"username": "buyer",
                                        "password": "123pass"}).data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # Покупаем абонемент
    response = client.post(f"/api/memberships/buy/{membership.id}/")
    assert response.status_code == 201

    # Проверяем, появился ли в профиле
    profile = client.get("/api/profile/").data
    assert profile["membership"]["name"] == "VIP"
    assert profile["membership"]["duration_days"] == 90


@pytest.mark.django_db
def test_buy_membership_requires_authentication():
    membership = Membership.objects.create(name="Фитнес", duration_days=30,
                                           price=999)

    client = APIClient()
    response = client.post(f"/api/memberships/buy/{membership.id}/")

    assert response.status_code == 401


@pytest.mark.django_db
def test_buy_nonexistent_membership_returns_404():
    client = APIClient()
    token = client.post("/api/token/", {"username": "ghost",
                                        "password": "12345"}).data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    invalid_id = 9999  # несуществующий ID
    response = client.post(f"/api/memberships/buy/{invalid_id}/")

    assert response.status_code == 404
