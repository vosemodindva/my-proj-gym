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