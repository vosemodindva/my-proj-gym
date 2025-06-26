import pytest
from django.contrib.auth import get_user_model
from GymApp.models import Membership, UserMembership, Trainer, Event
from GymApp.serializers import (
    RegisterSerializer,
    MembershipSerializer,
    UserSerializer,
    EventSerializer,
    TrainerSerializer
)
from django.utils.timezone import now, timedelta

User = get_user_model()


@pytest.mark.django_db
def test_register_serializer_creates_user():
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "securepass123"
    }
    serializer = RegisterSerializer(data=data)
    assert serializer.is_valid()
    user = serializer.save()

    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.check_password("securepass123") is True

    response_data = serializer.to_representation(user)
    assert "access" in response_data
    assert "refresh" in response_data


@pytest.mark.django_db
def test_membership_serializer_output():
    membership = Membership.objects.create(name="Фитнес", duration_days=30,
                                           price=999.99)
    serializer = MembershipSerializer(membership)
    data = serializer.data

    assert data["name"] == "Фитнес"
    assert data["duration_days"] == 30
    assert data["price"] == "999.99"


@pytest.mark.django_db
def test_user_serializer_with_membership():
    user = User.objects.create_user(username="has_plan", email="user@mail.com",
                                    password="12345")
    membership = Membership.objects.create(name="Премиум", duration_days=60,
                                           price=1999.00)
    UserMembership.objects.create(
        user=user,
        membership=membership,
        valid_until=now() + timedelta(days=60)
    )

    serializer = UserSerializer(user)
    data = serializer.data

    assert data["username"] == "has_plan"
    assert data["membership"]["name"] == "Премиум"
    assert data["membership"]["duration_days"] == 60


@pytest.mark.django_db
def test_trainer_serializer_output():
    user = User.objects.create_user(username="trainer", password="12345")
    trainer = Trainer.objects.create(user=user, name="Сергей",
                                     bio="Сила и выносливость", experience=4)

    data = TrainerSerializer(trainer).data

    assert data["name"] == "Сергей"
    assert data["experience"] == 4
    assert "bio" in data


@pytest.mark.django_db
def test_event_serializer_output():
    event = Event.objects.create(
        title="Функционалка", description="Тренировка всего тела",
        date=now().date(), age_limit=16
    )
    data = EventSerializer(event).data

    assert data["title"] == "Функционалка"
    assert data["age_limit"] == 16
    assert "description" in data
    assert "date" in data
