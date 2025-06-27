from django.urls import path, re_path
from .views import (
    RegisterView, MembershipViewSet, ProfileAPIView,
    FrontendAppView, BuyMembershipAPIView, TrainerViewSet,
    EventViewSet,

)
from rest_framework.routers import DefaultRouter
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

router = DefaultRouter()
router.register(r'api/memberships', MembershipViewSet, basename='memberships')
router.register(r'api/trainers', TrainerViewSet, basename='trainers')
router.register(r'api/events', EventViewSet, basename='events')


class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


urlpatterns = [
    # API endpoints
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),
    path('api/profile/', ProfileAPIView.as_view(), name='profile'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),

    #ПЫТАЮСЬ СДЕЛАТЬ АДМИН ПАНЕЛЬ
    path('create-admin/', create_admin_view),

    # Swagger UI
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'),
         name='swagger-ui'),
    # Альтернатива — Redoc
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'),
         name='redoc'),

    # React SPA fallback (все остальные URL → index.html)
    re_path(r"^(?!api/|media/|admin/?|favicon\.ico).*",
            FrontendAppView.as_view(), name="spa"),
    path('api/memberships/buy/<int:membership_id>/',
         BuyMembershipAPIView.as_view(), name='buy_membership'),
]

urlpatterns += router.urls
