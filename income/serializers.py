from rest_framework import serializers
from .models import Income
from accounts.models import Account
from categories.models import Category

class IncomeSerializer(serializers.ModelSerializer):
    """Handles data validation and conversion for Income Model."""

    class Meta:
        model = Income
        fields = ["id", "account", "category", "amount", "description", "date", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]   # automatically system generated

    '''
    # validate account and category - Field level Validation
    # NOTE: Strictly use 'validate_<field_name>' pattern for implementing field level validation otherwise DRF skips this hook.
    # The 'account' and 'category' parameter here is already a fetched DB object, not just an ID.

    # [DJANGO'S JOB - TOKEN EXTRACTION]:
    # Right when the request hits the server, Django's Authentication Middleware reads the HTTP HEADERS & extracts the JWT Token, verifies it, and fetches the logged-in user, profile (User A) from the DB. We pull 'Rahul' here via 'self.context['request'].user'.
    # [DRF'S JOB - ACCOUNT ID EXTRACTION]:
    # Simultaneously, DRF reads the HTTP BODY payload. It extracts the raw Account ID (e.g., 2) & runs a single row database lookup for that ID, turns it into a Python object, & automatically injects it directly into this bracket 'account' variable.
    # Same goes for validation_category()
    '''
    
    def validate_account(self, account):
        """Validate account ownership and activity status"""
        # Extract user from request, 
        # The use of self.request.user only works inside Views (like APIView or ModelViewSet). Serializers do not have direct access to the request object. Because of this, DRF passes the request to the serializer by placing it inside a dictionary named "self.context."

        # Print entire context dictionary
        # print("--- MY SERIALIZER CONTEXT ---", self.context)
        # Print just the keys of context dict
        # print("--- CONTEXT KEYS ---", self.context.keys())

        user = self.context['request'].user     # Extract logged-in user from HTTP Headers (Auth Token)

        # Security: Block entry into another user's account
        if account.user != user:
            raise serializers.ValidationError("You can only use your own account.")

        # Security: Block entry into deactivated/frozen accounts
        if not account.is_active:
            raise serializers.ValidationError("This account is inactive.")

        return account

    def validate_category(self, category):
        """Validates ownership and correct type of the category."""
        user = self.context['request'].user

        # Security: Block usage of someone else's custom category
        if category.user != user:
            raise serializers.ValidationError("You can only use your own category.")

        # Security: Prevent linking an expense type here
        if category.category_type != Category.CategoryType.INCOME:
            raise serializers.ValidationError("Income must use an income category.")

        return category