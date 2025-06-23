from GymApp.models import Trainer

def make_trainers(modeladmin, request, queryset):
    """Назначить выбранных пользователей тренерами"""
    for user in queryset:
        Trainer.objects.get_or_create(user=user, name=user.username)
make_trainers.short_description = "Назначить выбранных пользователей тренерами"


def remove_trainers(modeladmin, request, queryset):
    """Удалить роль тренера у выбранных пользователей"""
    Trainer.objects.filter(user__in=queryset).delete()
remove_trainers.short_description = "Удалить роль тренера у выбранных пользователей"