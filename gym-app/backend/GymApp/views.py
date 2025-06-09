from django.views.generic import View
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, viewsets
from rest_framework.response import Response
from .serializers import (
    RegisterSerializer,
    MembershipSerializer,
    UserSerializer,
)
from .permissions import IsAdminToken
from .models import Membership
from django.contrib.auth.models import User


class FrontendAppView(View):
    def get(self, request):
        return render(request, 'index.html')


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = []


class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAdminToken]