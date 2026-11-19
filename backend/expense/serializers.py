from rest_framework import serializers
from categories.models import Category
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    """Handles data validation and conversion for Expense Model."""

    # Read-only display fields: Preserve historical names and status even if the parent category/account is soft-deleted (archived)
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    category_is_active = serializers.BooleanField(source="category.is_active", read_only=True)
    account_name = serializers.CharField(source="account.acc_name", read_only=True)
    account_is_active = serializers.BooleanField(source="account.is_active", read_only=True)

    class Meta:
        model = Expense
        fields = ["id", "account", "account_name", "account_is_active", "category", "category_name", "category_is_active", "amount", "description", "date", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_account(self, account):
        """Validate account ownership and activity status"""
        user = self.context['request'].user     # Current logged-in user

        # Security: Block entry into another's user accounts
        if account.user != user:
            raise serializers.ValidationError("You can only use your own account.")

        # Security: Block entry into frozen/deactivated accounts
        # Naya record ya account change karte waqt deleted account block karo, Par purane record ka same deleted account edit mode mein allow hai
        is_unchanged = self.instance is not None and self.instance.account_id == account.id
        if not account.is_active and not is_unchanged:
            raise serializers.ValidationError("This account is deleted/inactive.")

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

        is_unchanged = self.instance is not None and self.instance.category_id == category.id
        if not category.is_active and not is_unchanged:
            raise serializers.ValidationError("This category is deleted/inactive.")

        return category

    # Ensure the expense amount is strictly greater than zero
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Expense amount must be greater than ₹0")
        return value