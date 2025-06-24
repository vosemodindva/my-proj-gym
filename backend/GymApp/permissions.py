from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Только админ может изменять, остальные — только читать (GET, HEAD, OPTIONS)
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
    
class IsAdminToken(BasePermission):
    """
    Доступ только для пользователей с ролью admin (по is_staff)
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff
    
class IsTrainer(BasePermission):
    """
    Доступ разрешён только пользователям, у которых есть trainer_profile
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'trainer_profile')
    
class IsTrainerOwner(BasePermission):
    """
    Доступ только если пользователь — владелец этого Trainer-объекта
    """
    def has_object_permission(self, request, view, obj):
        return hasattr(request.user, 'trainer_profile') and obj.user == request.user