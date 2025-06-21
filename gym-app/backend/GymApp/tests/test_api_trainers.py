import pytest
from rest_framework.test import APIClient
from GymApp.models import Trainer
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_list_trainers_authenticated_only():
    # Создаём пользователя и логинимся
    user = User.objects.create_user(username="traineruser", password="pass123")
    client = APIClient()
    login = client.post("/api/token/", {"username": "traineruser", "password": "pass123"})
    access = login.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    Trainer.objects.create(name="Андрей", bio="силовые", experience=5)
    Trainer.objects.create(name="Елена", bio="йога", experience=3)

    response = client.get("/api/trainers/")
    assert response.status_code == 200
    assert len(response.data) == 2
