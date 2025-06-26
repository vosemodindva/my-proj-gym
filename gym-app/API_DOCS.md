# 📚 API-документация проекта "Омежка"

## 🔐 Аутентификация

### POST `/api/auth/register`
Регистрация нового пользователя.

**Запрос:**
```json
{
  "username": "john",
  "password": "123456",
  "email": "john@example.com"
}
```

**Ответ:**
```json
{
  "message": "User registered successfully"
}
```

---

### POST `/api/auth/login`
Аутентификация по JWT.

**Запрос:**
```json
{
  "username": "john",
  "password": "123456"
}
```

**Ответ:**
```json
{
  "access": "JWT_token",
  "refresh": "JWT_refresh_token",
  "role": "role"
}
```

---

## 🧍 Пользователи

### GET `/api/users/`
(Только для админа) Получение списка всех пользователей.

---

## 🏋️ Мероприятия

### GET `/api/events/`
Список мероприятий (фильтрация по типу).

---

### POST `/api/classes/`
Создание нового занятия (роль: `admin`).

## 👨‍🏫 Тренеры

### GET `/api/trainers/`
Список всех тренеров.

---

## 📝 Запись на занятие

### POST `/api/booking/`
Пользователь записывается на занятие.

**Запрос:**
```json
{
  "class_id": 3
}
```

**Ответ:**
```json
{
  "message": "Вы записаны на занятие"
}
```

---

## 🧾 Аудит лог

### GET `/api/logs/`
(Только для `admin`) Журнал действий пользователей.

---

## 🛠️ Технические детали

- Авторизация через `Authorization: Bearer <token>`
- Ответы в формате JSON
- Swagger: `/docs`
