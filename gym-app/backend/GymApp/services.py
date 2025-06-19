from django.shortcuts import get_object_or_404
from .models import Membership, UserMembership
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

    return {
        'status': status.HTTP_201_CREATED,
        'data': {'detail': 'Абонемент успешно куплен!'}
    }