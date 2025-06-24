from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Membership(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()
    duration_days = models.PositiveIntegerField(default=30)

    def __str__(self):
        return self.name

class UserMembership(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    membership = models.ForeignKey(Membership, on_delete=models.SET_NULL, null=True)
    purchase_date = models.DateTimeField(default=now)
    valid_until = models.DateTimeField()

    def is_active(self):
        return self.valid_until >= now()

    def days_remaining(self):
        delta = self.valid_until - now()
        return max(delta.days, 0)

    def __str__(self):
        return f"{self.user.username} — {self.membership.name}"