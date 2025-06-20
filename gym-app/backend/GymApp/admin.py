from django.contrib import admin
from .models import Membership, UserMembership, Event, Trainer

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration_days')

@admin.register(UserMembership)
class UserMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'membership', 'valid_until')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'participant_count')

from .models import Trainer

@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ('name',)