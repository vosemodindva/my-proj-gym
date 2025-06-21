from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Membership, Trainer, Event, AuditLog
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
    
class UserSerializer(serializers.ModelSerializer):
    membership = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'email', 'is_staff', 'is_superuser', 'membership']

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