import pytest
from rest_framework.test import APIClient
from GymApp.models import Membership

@pytest.mark.django_db
def test_get_membership_list():
    Membership.objects.create(name="1 месяц", duration_days=30, price=1000)
    Membership.objects.create(name="Пробный", duration_days=7, price=0)

    client = APIClient()
    response = client.get("/api/memberships/")

    assert response.status_code == 200
    assert len(response.data) == 2
