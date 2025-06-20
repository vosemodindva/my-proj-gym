from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now, timedelta

class Membership(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()
    duration_days = models.PositiveIntegerField(default=30)  # ← новая длительность

    def __str__(self):
        return self.name


class UserMembership(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    membership = models.ForeignKey(Membership, on_delete=models.SET_NULL, null=True)
    purchase_date = models.DateTimeField(default=now)
    valid_until = models.DateTimeField()

    def is_active(self):
        return self.valid_until >= now()

    def __str__(self):
        return f"{self.user.username} — {self.membership.name}"
    
    def days_remaining(self):
        delta = self.valid_until - now()
        return max(delta.days, 0)  # не будет показывать отрицательное значение
    
class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='event_images/')
    participants = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return self.title

    def participant_count(self):
        return self.participants.count()

class Trainer(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="trainers/", blank=True, null=True)

    def __str__(self):
        return self.name