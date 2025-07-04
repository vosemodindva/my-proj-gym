from django.contrib import admin
from django.contrib.auth.models import User
from .models import Membership, UserMembership, Event, Trainer, AuditLog
from .admin_filters import IsTrainerFilter
from .admin_actions import make_trainers, remove_trainers


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'duration_days']

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        action = "Обновил" if change else "Создал"
        AuditLog.objects.create(
            user=request.user,
            action=f"{action} абонемент: {obj.name}"
        )

    def delete_model(self, request, obj):
        AuditLog.objects.create(
            user=request.user,
            action=f"Удалил абонемент: {obj.name}"
        )
        super().delete_model(request, obj)


@admin.register(UserMembership)
class UserMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'membership', 'valid_until')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'participant_count')

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        action = "Обновил" if change else "Создал"
        AuditLog.objects.create(
            user=request.user,
            action=f"{action} ивент: {obj.title}"
        )

    def delete_model(self, request, obj):
        AuditLog.objects.create(
            user=request.user,
            action=f"Удалил ивент: {obj.title}"
        )
        super().delete_model(request, obj)


@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ['name', 'experience']

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        action = "Обновил" if change else "Создал"
        AuditLog.objects.create(
            user=request.user,
            action=f"{action} тренера: {obj.name}"
        )

    def delete_model(self, request, obj):
        AuditLog.objects.create(
            user=request.user,
            action=f"Удалил тренера: {obj.name}"
        )
        super().delete_model(request, obj)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user', 'action')
    readonly_fields = ('timestamp', 'user', 'action')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_superuser',
                    'is_trainer')
    actions = [make_trainers, remove_trainers]
    list_filter = ('is_staff', 'is_superuser', IsTrainerFilter)

    @admin.display(boolean=True, description="Тренер")
    def is_trainer(self, obj):
        return hasattr(obj, 'trainer_profile')


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
