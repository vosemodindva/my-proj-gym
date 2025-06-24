from drf_spectacular.utils import OpenApiExample, extend_schema
from GymApp.serializers import TrainerSerializer

get_trainers_docs = extend_schema(
    summary="Получить список тренеров",
    description="Возвращает список всех тренеров с их опытом и клиентами.",
    responses=TrainerSerializer,
    examples=[
        OpenApiExample(
            name="Пример успешного ответа",
            value=[
                {
                    "id": 1,
                    "name": "Айдар",
                    "experience": 5,
                    "clients": [3, 5]
                }
            ],
            response_only=True,
        )
    ]
)

create_trainer_docs = extend_schema(
    summary="Добавить нового тренера",
    request=TrainerSerializer,
    responses=TrainerSerializer,
    examples=[
        OpenApiExample(
            name="Пример запроса",
            value={
                "name": "Ильдар",
                "experience": 7,
                "clients": [1, 2]
            },
            request_only=True,
        ),
        OpenApiExample(
            name="Пример успешного ответа",
            value={
                "id": 4,
                "name": "Ильдар",
                "experience": 7,
                "clients": [1, 2]
            },
            response_only=True,
        )
    ]
)
