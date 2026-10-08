from django.contrib.auth.models import BaseUserManager

# The UserManager works, that whenever a new normal user or superuser (admin) is created, it will force Django, to not ask for a username, just create the account using a unique Email and password.
class UserManager(BaseUserManager):
    """Custom manager to use Email instead of Django's default Username for authentication."""
    def create_user(self, email, password=None, **extra_fields):
        """
        Validates, creates, and saves a standard user account.
        Returns: The saved User object.
        """
        if not email:
            raise ValueError("Email is required")   # making email mandatory

        # setting email
        email = self.normalize_email(email) # Normalize/clean the email address by lowercasing the domain part of it.• This prevents duplicate accounts due to typos.

        user = self.model(
            email=email,
            **extra_fields
        )

        # setting password and storing in DB
        user.set_password(password) # encrypt(hash) the password then store it
        user.save(using=self._db)   # _db => save in db

        return user

    # Admin / Superuser
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves an admin account with full permissions.
        Returns: The saved Superuser object.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        # with the help of above create_user this method will create superuser
        return self.create_user(
            email=email,
            password=password,
            **extra_fields
        )