from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2',
                  'user_type', 'phone_number', 'address', 'first_name', 'last_name',
                  'reporting_frequency', 'custom_reporting_days')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'user_type': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'reporting_frequency': {'required': False},
            'custom_reporting_days': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'user_type',
                  'phone_number', 'address', 'created_at', 'first_name', 'last_name',
                  'reporting_frequency', 'custom_reporting_days')
        read_only_fields = ('id', 'created_at')


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('reporting_frequency', 'custom_reporting_days')
