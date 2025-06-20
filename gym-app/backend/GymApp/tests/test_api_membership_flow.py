import pytest
from rest_framework.test import APIClient
from django.utils.timezone import now, timedelta
from django.contrib.auth import get_user_model
from GymApp.models import Membership, UserMembership

User = get_user_model()

@pytest.mark.django_db
def test_buy_membership_and_view_profile():
    client = APIClient()

    # 1. Регистрация пользователя
    reg_data = {
        "username": "buyer",
        "email": "buyer@example.com",
        "password": "mypassword123"
    }
    response = client.post("/api/register/", reg_data)
    assert response.status_code == 201
    access = response.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    # 2. Создание абонемента
    membership = Membership.objects.create(name="Премиум", duration_days=30, price=999.00)

    # 3. Покупка абонемента
    response = client.post(f"/api/memberships/buy/{membership.id}/")
    assert response.status_code == 201

    # 4. Проверка, что UserMembership действительно создан
    user = User.objects.get(username="buyer")
    assert UserMembership.objects.filter(user=user, membership=membership).exists()

    # 5. Получение профиля
    response = client.get("/api/profile/")
    assert response.status_code == 200
    data = response.data

    assert data["username"] == "buyer"
    assert data["membership"]["name"] == "Премиум"
    assert data["membership"]["duration_days"] == 30
