from django.contrib import admin
from .models import Income

# Register your models here.
@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display=("amount", "category", "account", "user", "date",)
    list_filter=("date", "category",)
    search_fields=("description", "category__category_name", "account__acc_name", "user__email",)