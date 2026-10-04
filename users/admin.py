from django.contrib import admin
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display=("id", "email", "first_name", "last_name", "is_staff",)
    list_display_links=("email",)   # click on email to open details
    list_filter=("email",)
    search_fields=("email", "first_name", "last_name",)