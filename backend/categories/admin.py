from django.contrib import admin
from .models import Category

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display=("category_name", "category_type", "user", "created_at", "is_active")
    list_filter=("category_type", "is_active")
    search_fields=("category_name", "user__email",)