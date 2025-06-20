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
    TrainerSerializer,
    EventSerializer,
)
from .permissions import IsAdminOrReadOnly
from .models import Membership, Trainer, Event
from django.contrib.auth.models import User
from .services import buy_membership_for_user


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
    permission_classes = [IsAdminOrReadOnly]


class TrainerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class BuyMembershipAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, membership_id):
        print(request.user)
        result = buy_membership_for_user(request.user, membership_id)
        return Response(result['data'], status=result['status'])