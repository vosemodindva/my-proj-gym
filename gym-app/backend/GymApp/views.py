from django.views.generic import View
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, viewsets, decorators
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import (
    RegisterSerializer,
    MembershipSerializer,
    UserSerializer,
    TrainerSerializer,
    EventSerializer,
    AuditLogSerializer,
    TrainerProfileSerializer,
)
from .permissions import (IsAdminOrReadOnly, IsAdminToken, IsTrainer,
                          IsTrainerOwner)
from .models import Membership, Trainer, Event, AuditLog
from django.contrib.auth.models import User
from .services import (
    buy_membership_for_user,
    assign_trainer_to_user,
    unassign_trainer_from_user,
    get_user_trainers,
    get_trainer_clients,
    remove_client_from_trainer,
)
from .docs.trainer_docs import get_trainers_docs, create_trainer_docs

#ПЫТАЮСЬ СДЕЛАТЬ АДМИН ПАНЕЛЬ
from django.contrib.auth import get_user_model
from django.http import JsonResponse

def create_admin_view(request):
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        return JsonResponse({"status": "created"})
    return JsonResponse({"status": "already exists"})



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

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated]
            )
    def assign(self, request, pk=None):
        appointment_time = request.data.get("appointment_time")
        return assign_trainer_to_user(user=request.user, trainer_id=pk,
                                      appointment_time_str=appointment_time)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated]
            )
    def unassign(self, request, pk=None):
        return unassign_trainer_from_user(trainer_id=pk, user=request.user)

    @decorators.action(detail=False, methods=["get"],
                       permission_classes=[IsAuthenticated])
    def my(self, request):
        trainers = get_user_trainers(request.user)
        data = TrainerSerializer(trainers, many=True).data
        return Response(data)

    @decorators.action(detail=False, methods=["get"],
                       permission_classes=[IsAuthenticated, IsTrainer])
    def my_clients(self, request):
        clients = get_trainer_clients(request.user)
        data = [{'id': u.id,
                 'username': u.username, 'email': u.email} for u in clients]
        return Response(data)

    @action(detail=False, methods=["get", "put"], url_path="me",
            permission_classes=[IsAuthenticated, IsTrainer])
    def my_profile(self, request):
        if not hasattr(request.user, "trainer_profile"):
            return Response({"detail": "Вы не являетесь тренером."},
                            status=403)

        trainer = request.user.trainer_profile

        if request.method == "GET":
            serializer = TrainerProfileSerializer(trainer)
            return Response(serializer.data)

        serializer = TrainerProfileSerializer(trainer, data=request.data,
                                              partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=["post"], url_path="remove_client",
            permission_classes=[IsTrainer])
    def remove_client(self, request):
        client_id = request.data.get("client_id")
        remove_client_from_trainer(trainer_user=request.user,
                                   client_id=client_id)
        return Response({"detail": "Клиент удален"}, status=200)

    @get_trainers_docs
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @create_trainer_docs
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
