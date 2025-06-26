from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Membership, Trainer, Event, AuditLog, TrainerClient
from .services import register_user


class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return register_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        return {
            'user_id': instance.id,
            'username': instance.username,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }


class MembershipSerializer(serializers.ModelSerializer):
    """
    Сериализатор абонементов:
    - name: Название абонемента
    - duration_days: Длительность в днях
    - price: Стоимость
    """
    class Meta:
        model = Membership
        fields = '__all__'


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Добавим кастомное поле "role"
        token['role'] = 'admin' if user.is_staff else 'user'

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = 'admin' if self.user.is_staff else 'user'
        return data


class ClientShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class TrainerClientSerializer(serializers.ModelSerializer):
    client = SimpleUserSerializer()

    class Meta:
        model = TrainerClient
        fields = ['client', 'appointment_time']


class TrainerProfileSerializer(serializers.ModelSerializer):
    client_count = serializers.SerializerMethodField()
    clients = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()
    experience_years = serializers.SerializerMethodField()

    class Meta:
        model = Trainer
        fields = [
            "id", "user", "name", "experience", "experience_years",
            "description", "photo", "photo_url", "client_count", "clients"
        ]

    def get_client_count(self, obj):
        return TrainerClient.objects.filter(trainer=obj).count()

    def get_clients(self, obj):
        sessions = TrainerClient.objects.filter(trainer=obj)
        return TrainerClientSerializer(sessions, many=True).data

    def get_photo_url(self, obj):
        if obj.photo and hasattr(obj.photo, 'url'):
            return obj.photo.url
        return None

    def get_experience_years(self, obj):
        years = obj.experience
        if years == 1:
            return "1 год"
        elif 2 <= years <= 4:
            return f"{years} года"
        else:
            return f"{years} лет"


class UserSerializer(serializers.ModelSerializer):
    membership = serializers.SerializerMethodField()
    trainer_profile = TrainerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'is_staff', 'is_superuser',
                  'membership', "trainer_profile"]

    def get_membership(self, user):
        user_membership = getattr(user, 'usermembership', None)
        if user_membership and user_membership.membership:
            return {
                "name": user_membership.membership.name,
                "duration_days": user_membership.membership.duration_days
            }
        return None


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = fields
