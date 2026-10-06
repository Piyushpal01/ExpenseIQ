# Registering API, users and Logout Flow
# Flow => data from frontend(email,pass,fname,lname) -> Field Validation(RegisterSerializer) -> Data Stripping(inside create() method, password get separated so that it cannot be saved in plain text) -> Password Hashing(create_user method hash the password) -> Response

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenBlacklistSerializer
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    # Hide password in responses & enforcing minimum length of 8 chars
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name"]
        read_only_fields = ["id"]   # id is auto generated, users cannot change it

    # create method -> remove plain password -> Hashesh it securely -> save in Database
    def create(self, validated_data):
        # Extract the password from password field
        password = validated_data.pop("password")
        
        # hash the password and save in DB & create user in DB using Custom UserManager
        user = User.objects.create_user(
            password=password,
            **validated_data,   # (**)Argument Unpacking => Unpacks the remaining fields (email, names) from dict
        )
        return user

# Logout functionality
class LogoutSerializer(TokenBlacklistSerializer):
    pass