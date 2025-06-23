from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Membership, UserMembership, AuditLog, Trainer
from django.utils.timezone import now
from datetime import timedelta
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


def assign_trainer_to_user(trainer_id, user):
    try:
        trainer = Trainer.objects.get(id=trainer_id)

        if trainer.clients.filter(id=user.id).exists():
            return {
                'status': status.HTTP_400_BAD_REQUEST,
                'data': {'detail': 'Вы уже записаны к этому тренеру'}
            }

        trainer.clients.add(user)
        return {
            'status': status.HTTP_200_OK,
            'data': {'detail': 'Вы успешно записались к тренеру'}
        }

    except Trainer.DoesNotExist:
        return {
            'status': status.HTTP_404_NOT_FOUND,
            'data': {'detail': 'Тренер не найден'}
        }


def unassign_trainer_from_user(trainer_id, user):
    try:
        trainer = Trainer.objects.get(id=trainer_id)

        if not trainer.clients.filter(id=user.id).exists():
            return {
                'status': status.HTTP_400_BAD_REQUEST,
                'data': {'detail': 'Вы не записаны к этому тренеру'}
            }

        trainer.clients.remove(user)
        return {
            'status': status.HTTP_200_OK,
            'data': {'detail': 'Запись отменена'}
        }

    except Trainer.DoesNotExist:
        return {
            'status': status.HTTP_404_NOT_FOUND,
            'data': {'detail': 'Тренер не найден'}
        }
    

def get_user_trainers(user):
    return user.assigned_trainers.all()


def get_trainer_clients(trainer_user):
    try:
        return trainer_user.trainer_profile.clients.all()
    except Trainer.DoesNotExist:
        return []
    
@action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
def assign(self, request, pk=None):
    trainer = self.get_object()
    user = request.user

    if trainer.clients.filter(id=user.id).exists():
        return Response({"detail": "Вы уже записаны к этому тренеру."}, status=400)

    trainer.clients.add(user)
    return Response({"detail": "Вы успешно записались к тренеру!"})