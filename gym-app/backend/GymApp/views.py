from django.views.generic import View
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, viewsets, decorators
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import (
    RegisterSerializer,
    MembershipSerializer,
    UserSerializer,
    TrainerSerializer,
    EventSerializer,
    AuditLogSerializer,
)
from .permissions import IsAdminOrReadOnly, IsAdminToken, IsTrainer, IsTrainerOwner
from .models import Membership, Trainer, Event, AuditLog
from django.contrib.auth.models import User
from .services import (
    buy_membership_for_user, 
    assign_trainer_to_user, 
    unassign_trainer_from_user,
    get_user_trainers,
    get_trainer_clients,
)



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


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['age_limit', 'date']


class BuyMembershipAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, membership_id):
        print(request.user)
        result = buy_membership_for_user(request.user, membership_id)
        return Response(result['data'], status=result['status'])
    

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminToken]


class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer

    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsTrainerOwner()]
        return [IsAuthenticated()]

    @decorators.action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def assign(self, request, pk=None):
        result = assign_trainer_to_user(pk, request.user)
        return Response(result["data"], status=result["status"])

    @decorators.action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def unassign(self, request, pk=None):
        result = unassign_trainer_from_user(pk, request.user)
        return Response(result["data"], status=result["status"])

    @decorators.action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my(self, request):
        trainers = get_user_trainers(request.user)
        data = TrainerSerializer(trainers, many=True).data
        return Response(data)

    @decorators.action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsTrainer])
    def my_clients(self, request):
        clients = get_trainer_clients(request.user)
        data = [{'id': u.id, 'username': u.username, 'email': u.email} for u in clients]
        return Response(data)