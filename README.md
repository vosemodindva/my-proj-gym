# 🏋️ Проект "Омежка" — система управления тренажёрным залом

## 📌 Описание

Веб-приложение для администрирования тренажёрного зала: регистрация клиентов, запись на занятия, управление расписанием и сотрудниками.

---

## ⚙️ Технологии

| Компонент       | Технология             |
|-----------------|------------------------|
| Backend         | Django / FastAPI       |
| Frontend        | HTML, CSS, JS / React  |
| База данных     | SQLite                 |
| Контейнеризация | Docker, Docker Compose |
| Аутентификация  | JWT                    |
| CI/CD           | Azure DevOps           |

---

## 🚀 Быстрый старт

1. Клонируйте проект:

```bash
git clone https://dev.azure.com/ge-org05/_git/superproject
cd superproject
```

2. Создайте `.env` файл:

```bash
cd gym-app
cp .env.example .env
```

3. Запустите проект:

```bash
cd gym-app
docker-compose up --build
```

---

## 🔐 Аутентификация

- JWT-токены (access / refresh)
- Роли: `user`, `admin`, `trainer`
- Эндпоинты см. в [API_DOCS.md](gym-app/API_DOCS.md)

---

## ✅ Покрытие и тесты

- `pytest` — юнит- и интеграционные тесты
- Покрытие ≥ 87% (`--cov`)

---

## 🌐 Интерфейс

- Адаптивный дизайн
- Уведомления об ошибках и успехе
- Удобная навигация и фильтрация

---

## 📄 Документация

- Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)
- Полные примеры в [API_DOCS.md](gym-app/API_DOCS.md)

---

## 👥 Команда

- Backend: Альмар, Ayaz
- Frontend: Victor, Данил
- QA & CI/CD: George

---

## 📦 Лицензия

Проект разработан в рамках учебной программы. Распространяется свободно.
