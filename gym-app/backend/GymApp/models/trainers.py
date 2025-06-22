from django.contrib.auth.models import User
from django.db import models

class Trainer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="trainer_profile")
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    experience = models.PositiveIntegerField(default=0)
    photo = models.ImageField(upload_to="trainers/", blank=True, null=True)
    clients = models.ManyToManyField(User, related_name="assigned_trainers", blank=True)

    def __str__(self):
        return self.name