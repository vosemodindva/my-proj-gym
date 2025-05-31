from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required


def home(request):
    return render(request, 'GymApp/home.html')

def subscribe(request):
    return render(request, 'GymApp/purchase.html')

def login_view(request):
    return render(request, 'GymApp/login.html')

@login_required
def profile(request):
    return render(request, 'GymApp/profile.html', {'user': request.user})

def postuser(request):
    # получаем из данных запроса POST отправленные через форму данные
    name = request.POST.get("name", "Undefined")
    age = request.POST.get("age", 1)
    return HttpResponse(f"<h2>Name: {name}  Age: {age}</h2>")
from django.shortcuts import render, redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('profile')  # переход в личный кабинет
        else:
            return render(request, 'GymApp/login.html', {'error': 'Неверные данные'})

    return render(request, 'GymApp/login.html')

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
