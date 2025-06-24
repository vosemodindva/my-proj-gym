import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from GymApp.models import Membership

User = get_user_model()

@pytest.mark.django_db
def test_list_memberships():
    Membership.objects.create(name="Базовый", duration_days=30, price=500)
    Membership.objects.create(name="Премиум", duration_days=60, price=1000)

    client = APIClient()
    response = client.get("/api/memberships/")
    assert response.status_code == 200
    assert len(response.data) == 2
    names = [m["name"] for m in response.data]
    assert "Базовый" in names
    assert "Премиум" in names
