from django.contrib import admin
from .models import Account

# Register your models here.
@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display=("acc_name", "acc_type", "acc_balance", "user", "is_active", "created_at",)
    list_filter=("acc_type", "is_active",)
    search_fields=("name", "user__email",)