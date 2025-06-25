from django.contrib.admin import SimpleListFilter


class IsTrainerFilter(SimpleListFilter):
    title = "Тренер"
    parameter_name = "is_trainer"

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Да'),
            ('no', 'Нет'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(trainer_profile__isnull=False)
        if self.value() == 'no':
            return queryset.filter(trainer_profile__isnull=True)
        return queryset
