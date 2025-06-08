from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.utils.timezone import now, timedelta
from .models import UserMembership, Membership, Event, User
from rest_framework import generics, viewsets
from .serializers import RegisterSerializer, MembershipSerializer
from .permissions import IsAdminOrReadOnly, IsAdminToken

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = []

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAdminToken]

def home(request):
    memberships = Membership.objects.all()
    return render(request, 'GymApp/home.html', {'memberships': memberships})

@login_required
def purchase(request):
    memberships = Membership.objects.all()
    return render(request, 'GymApp/purchase.html', {'memberships': memberships})

@login_required
def profile(request):
    try:
        membership = request.user.usermembership
        if not membership.is_active():
            membership = None
    except UserMembership.DoesNotExist:
        membership = None

    return render(request, 'GymApp/profile.html', {
        'user': request.user,
        'membership': membership,
    })

def postuser(request):
    # получаем из данных запроса POST отправленные через форму данные
    name = request.POST.get("name", "Undefined")
    age = request.POST.get("age", 1)
    return HttpResponse(f"<h2>Name: {name}  Age: {age}</h2>")
from django.shortcuts import render, redirect

from django.contrib.auth import authenticate, login
from django.shortcuts import redirect

def login_view(request):
    next_url = request.GET.get('next', 'profile')  # если нет ?next — идём в профиль

    if request.method == 'POST':
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(request.POST.get('next', next_url))  # приоритет: скрытое поле, потом ?next
        else:
            return render(request, 'GymApp/login.html', {'error': 'Неверные данные', 'next': next_url})

    return render(request, 'GymApp/login.html', {'next': next_url})


def register(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if password1 != password2:
            return render(request, "GymApp/register.html", {"error": "Пароли не совпадают"})
        if User.objects.filter(username=username).exists():
            return render(request, "GymApp/register.html", {"error": "Пользователь уже существует"})

        user = User.objects.create_user(username=username, email=email, password=password1)
        login(request, user)  # сразу входим после регистрации
        return redirect("profile")

    return render(request, "GymApp/register.html")

def logout_view(request):
    logout(request)
    return redirect("home")

def trainers_view(request):
    return redirect("home")

@login_required
def buy_membership(request, membership_id):
    membership = Membership.objects.get(id=membership_id)
    valid_until = now() + timedelta(days=membership.duration_days)

    # Обновляем или создаём запись
    UserMembership.objects.update_or_create(
        user=request.user,
        defaults={
            'membership': membership,
            'purchase_date': now(),
            'valid_until': valid_until
        }
    )
    return redirect('profile')

@login_required
def event_list(request):
    events = Event.objects.all()
    return render(request, 'GymApp/events.html', {'events': events})

@login_required
def join_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    event.participants.add(request.user)
    return redirect('events')

@login_required
def leave_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    event.participants.remove(request.user)
    return redirect('events')
