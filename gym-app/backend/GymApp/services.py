from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import Membership, UserMembership, AuditLog, Trainer, TrainerClient
from django.utils.timezone import now
from django.utils import timezone
from datetime import timedelta, time, datetime
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

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


def assign_trainer_to_user(user, trainer_id, appointment_time_str):
    try:
        # Преобразуем строку в datetime
        appointment_time = datetime.fromisoformat(appointment_time_str)
        appointment_time = timezone.make_aware(appointment_time)
    except (ValueError, TypeError):
        return Response({"detail": "Неверный формат времени"}, status=status.HTTP_400_BAD_REQUEST)

    if appointment_time < timezone.now():
        return Response({"detail": "Нельзя записаться в прошлое"}, status=status.HTTP_400_BAD_REQUEST)

    if not time(8, 0) <= appointment_time.time() <= time(18, 0):
        return Response({"detail": "Запись возможна только с 8:00 до 18:00"}, status=status.HTTP_400_BAD_REQUEST)

    if TrainerClient.objects.filter(
        trainer_id=trainer_id,
        appointment_time=appointment_time
    ).exists():
        return Response({"detail": "Это время уже занято"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        trainer = Trainer.objects.get(id=trainer_id)
    except Trainer.DoesNotExist:
        return Response({"detail": "Тренер не найден"}, status=status.HTTP_404_NOT_FOUND)

    if TrainerClient.objects.filter(trainer=trainer, client=user).exists():
        return Response({"detail": "Вы уже записаны к этому тренеру"}, status=status.HTTP_400_BAD_REQUEST)

    TrainerClient.objects.create(trainer=trainer, client=user, appointment_time=appointment_time)

    return Response({"detail": "Запись прошла успешно"}, status=status.HTTP_200_OK)


def unassign_trainer_from_user(trainer_id, user):
    try:
        trainer = Trainer.objects.get(id=trainer_id)
    except Trainer.DoesNotExist:
        return Response({"detail": "Тренер не найден"}, status=status.HTTP_404_NOT_FOUND)

    deleted, _ = TrainerClient.objects.filter(trainer=trainer, client=user).delete()
    if deleted:
        return Response({"detail": "Вы отписались от тренера"}, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "Вы не были записаны к этому тренеру"}, status=status.HTTP_400_BAD_REQUEST)



def remove_client_from_trainer(trainer_user, client_id):
    trainer = Trainer.objects.get(user=trainer_user)
    TrainerClient.objects.filter(trainer=trainer, client_id=client_id).delete()

def get_user_trainers(user):
    return user.assigned_trainers.all()


def get_trainer_clients(trainer_user):
    try:
        return TrainerClient.objects.filter(trainer__user=trainer_user)
    except Trainer.DoesNotExist:
        return []