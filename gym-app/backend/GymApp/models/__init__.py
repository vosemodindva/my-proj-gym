from .memberships import UserMembership, Membership
from .trainers import Trainer
from .events import Event
from .audit import AuditLog
from .trainer_client import TrainerClient
from django.contrib.auth import get_user_model


__all__ = [
    "UserMembership",
    "Membership",
    "Trainer",
    "Event",
    "AuditLog",
    "TrainerClient",
]

User = get_user_model()
