import pytest
from rest_framework.test import APIClient
from GymApp.models import Event
from django.utils.timezone import now
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_list_events_authenticated_only():
    # Создаём пользователя и логинимся
    user = User.objects.create_user(username="eventuser", password="pass123")
    client = APIClient()
    login = client.post("/api/token/", {"username": "eventuser", "password": "pass123"})
    access = login.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    # Создаём мероприятия
    Event.objects.create(title="Йога", description="утро", date=now().date(), age_limit=18)
    Event.objects.create(title="HIIT", description="вечер", date=now().date(), age_limit=21)

    response = client.get("/api/events/")
    assert response.status_code == 200
    assert len(response.data) == 2
