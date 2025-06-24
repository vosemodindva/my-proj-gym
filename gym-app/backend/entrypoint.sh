#!/bin/sh


if [ "$1" = "pytest" ]; then
    exec "$@"
else
    echo "Выполняем миграции и собираем статику"
    python manage.py migrate
    python manage.py collectstatic --noinput
    exec "$@"
fi

