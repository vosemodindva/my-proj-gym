from django.contrib import admin
from .models import Membership, UserMembership, Event

admin.site.register(Membership)
admin.site.register(UserMembership)
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'participant_count')
