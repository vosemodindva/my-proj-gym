from django.db import models
from django.conf import settings
from .trainers import Trainer


class TrainerClient(models.Model):
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE,
                                related_name="appointments")
    client = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE,
                               related_name="appointments")
    appointment_time = models.DateTimeField()

    class Meta:
        unique_together = ('trainer', 'client')

    def __str__(self):
        return f"{self.client} записан к {self.trainer} на {self.appointment_time}"
