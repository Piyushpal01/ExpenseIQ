from rest_framework import serializers
from categories.models import Category
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    """Handles data validation and conversion for Expense Model."""

    class Meta:
        model = Expense
        fields = ["id", "account", "category", "amount", "description", "date", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_account(self, account):
        """Validate account ownership and activity status"""
        user = self.context['request'].user     # Current logged-in user

        # Security: Block entry into another's user accounts
        if account.user != user:
            raise serializers.ValidationError("You can only use your own account.")

        # Security: Block entry into frozen/deactivated accounts
        if not account.is_active:
            raise serializers.ValidationError("This account is inactive.")

        return account

    # Category Validation
    def validate_category(self, category):
        user = self.context['request'].user

        # Security: Block usage of someone else's category
        if category.user != user:
            raise  serializers.ValidationError("You can only use your own category.")

        # Security: Prevent linking an Income type here
        if category.category_type != Category.CategoryType.EXPENSE:
            raise serializers.ValidationError("Expense must use an expense category.")

        return category