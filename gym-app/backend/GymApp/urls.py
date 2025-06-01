from django.urls import re_path, path
from . import views

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
]
