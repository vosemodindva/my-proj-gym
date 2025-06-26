import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from GymApp.models import Trainer
from GymApp.models.trainer_client import TrainerClient
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


@pytest.mark.django_db
def test_profile_for_regular_user():
    user = User.objects.create_user(username='user1', password='pass')
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get('/api/profile/')
    assert response.status_code == 200
    assert response.data['username'] == 'user1'
    assert response.data['trainer_profile'] is None


@pytest.mark.django_db
def test_profile_for_trainer_with_clients():
    trainer_user = User.objects.create_user(username='trainer1',
                                            password='pass')
    trainer = Trainer.objects.create(user=trainer_user, name="Тренер")

    client_user = User.objects.create_user(username='client1', password='pass')
    TrainerClient.objects.create(
        trainer=trainer,
        client=client_user,
        appointment_time=timezone.now() + timedelta(days=1)
    )

    client = APIClient()
    client.force_authenticate(user=trainer_user)

    response = client.get('/api/profile/')
    assert response.status_code == 200
    assert response.data['trainer_profile']['name'] == "Тренер"
    assert response.data['trainer_profile']['client_count'] == 1
    assert len(response.data['trainer_profile']['clients']) == 1
    assert response.data['trainer_profile']['clients'][0]['client'][
        'username'] == 'client1'


@pytest.mark.django_db
def test_profile_requires_authentication():
    client = APIClient()
    response = client.get('/api/profile/')
    assert response.status_code == 401
