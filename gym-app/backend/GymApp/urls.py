from django.urls import re_path, path
from . import views
from .views import RegisterView, MembershipViewSet
from rest_framework.routers import DefaultRouter
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'api/memberships', MembershipViewSet, basename='memberships')

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
    path('', views.home, name='home'),
    re_path(r'purchase/', views.purchase, name='purchase'),
    re_path(r'login/', views.login_view, name='login'),
    path("profile/<str:name>", views.profile),
    re_path(r'profile/', views.profile, name='profile'),
    path("login/postuser/", views.postuser),
    path('register/', views.register, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('trainers/', views.trainers_view, name='trainers'),
    path('buy/<int:membership_id>/', views.buy_membership, name='buy_membership'),
    path('events/', views.event_list, name='events'),
    path('events/join/<int:event_id>/', views.join_event, name='join_event'),
    path('events/leave/<int:event_id>/', views.leave_event, name='leave_event'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += router.urls