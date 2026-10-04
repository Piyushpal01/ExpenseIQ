from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "category_name", "category_type", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]