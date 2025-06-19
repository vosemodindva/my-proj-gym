from django.urls import path, re_path
from .views import (
    RegisterView, MembershipViewSet, ProfileAPIView,
    FrontendAppView, BuyMembershipAPIView
)
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
    # API endpoints
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/profile/', ProfileAPIView.as_view(), name='profile'),

    # React SPA fallback (все остальные URL → index.html)
    re_path(r"^(?!api/).*", FrontendAppView.as_view(), name="spa"),

    path('api/memberships/buy/<int:membership_id>/', BuyMembershipAPIView.as_view(), name='buy_membership'),
]

urlpatterns += router.urls