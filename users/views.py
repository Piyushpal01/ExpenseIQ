from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenBlacklistView
from .serializers import RegisterSerializer, LogoutSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # AllowAny, because at the time of first time user registration, user will not have the JWT token

# Logout View
class LogoutView(TokenBlacklistView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]  
    authentication_classes = [JWTAuthentication]    # Force injection of JWT Authentication for proper working of token_bucketlist