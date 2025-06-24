import pytest
from django.utils.timezone import now, timedelta
from django.contrib.auth import get_user_model
from GymApp.models import Membership, UserMembership, Event, Trainer

User = get_user_model()

@pytest.mark.django_db
def test_create_membership():
    user = User.objects.create_user(username="testuser", password="12345678")
    membership = Membership.objects.create(
        name="Безлимит",
        duration_days=30,
        price=999.00
    )
    assert membership.name == "Безлимит"
    assert membership.duration_days == 30


User = get_user_model()

@pytest.mark.django_db
def test_user_membership_creation_and_methods():
    # Создание пользователя и абонемента
    user = User.objects.create_user(username="testuser", password="12345678")
    membership = Membership.objects.create(
        name="Месячный",
        duration_days=30,
        price=990.00
    )

    # Создание активного абонемента
    valid_until_date = now() + timedelta(days=10)
    user_membership = UserMembership.objects.create(
        user=user,
        membership=membership,
        valid_until=valid_until_date
    )

    # Тест __str__
    assert str(user_membership) == f"{user.username} — {membership.name}"

    # Тест is_active
    assert user_membership.is_active() is True

    # Тест days_remaining
    remaining_days = user_membership.days_remaining()
    assert remaining_days == 10 or remaining_days == 9  # возможна погрешность в секундах

    # Тест просроченного абонемента
    expired = UserMembership.objects.create(
        user=User.objects.create_user(username="expired", password="pass"),
        membership=membership,
        valid_until=now() - timedelta(days=1)
    )

    assert expired.is_active() is False
    assert expired.days_remaining() == 0

@pytest.mark.django_db
def test_event_str_and_participant_count():
    user = User.objects.create_user(username="eventuser", password="123")
    event = Event.objects.create(
        title="Йога", description="Утренняя", date=now().date(), age_limit=18
    )
    event.participants.add(user)
    assert str(event) == "Йога"
    assert event.participant_count() == 1

@pytest.mark.django_db
def test_trainer_str():
    User = get_user_model()
    user = User.objects.create_user(username="alexey", password="pass123")
    t = Trainer.objects.create(user=user, name="Алексей", bio="Мастер спорта", experience=5)
    assert str(t) == "Алексей"