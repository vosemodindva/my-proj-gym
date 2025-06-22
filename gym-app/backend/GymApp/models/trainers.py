from django.db import models

class Trainer(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    experience = models.PositiveIntegerField(default=0, verbose_name="Стаж (лет)")
    photo = models.ImageField(upload_to="trainers/", blank=True, null=True)

    def __str__(self):
        return self.name