from django.contrib import admin
from .models import Category

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display=("category_name", "category_type", "user", "created_at",)
    list_filter=("category_type",)
    search_fields=("category_name", "user__email",)