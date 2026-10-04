from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager

# Create your models here.
class User(AbstractUser):
    username = None     # completely remove username field from django auth
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"    # setting email as login field instead of default username
    REQUIRED_FIELDS = []        # empty bcoz no other fields are required during account creation, except email and pass
    objects = UserManager()     # Link the custom manager to handle user creation using email