from django.db import models
from django.contrib.auth.models import User
from datetime import date


class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='event_images/')
    date = models.DateField(default=date.today, verbose_name="Дата проведения")
    age_limit = models.PositiveIntegerField(
        default=0, verbose_name="Возрастное ограничение")
    participants = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return self.title

    def participant_count(self):
        return self.participants.count()
