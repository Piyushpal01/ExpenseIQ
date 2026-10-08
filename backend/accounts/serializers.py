from rest_framework import serializers
from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ["id", "acc_name", "acc_type", "acc_balance", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "acc_balance", "created_at", "updated_at"]