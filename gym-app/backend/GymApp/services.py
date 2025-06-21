from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Membership, UserMembership, AuditLog
from django.utils.timezone import now
from datetime import timedelta
from rest_framework import status

def buy_membership_for_user(user, membership_id):
    membership = get_object_or_404(Membership, id=membership_id)

    if UserMembership.objects.filter(user=user).exists():
        return {
            'status': status.HTTP_400_BAD_REQUEST,
            'data': {'detail': 'У вас уже есть абонемент.'}
        }

    valid_until = now() + timedelta(days=membership.duration_days)

    UserMembership.objects.create(
        user=user,
        membership=membership,
        valid_until=valid_until
    )

    # ✅ Логирование действия
    AuditLog.objects.create(
        user=user,
        action=f"Куплен абонемент: {membership.name}"
    )

    return {
        'status': status.HTTP_201_CREATED,
        'data': {'detail': 'Абонемент успешно куплен!'}
    }

User = get_user_model()

def register_user(username, email, password):
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    # логируем регистрацию
    AuditLog.objects.create(
        user=user,
        action="Пользователь зарегистрировался"
    )

    return user