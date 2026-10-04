from django.db import models
from django.conf import settings

# Create your models here.
class Account(models.Model):
    # choices for Account Type
    class AccountType(models.TextChoices):
        BANK = "BANK", "Bank",
        CASH = "CASH", "Cash",
        UPI = "UPI", "Upi",
        CREDIT_CARD = "CREDIT_CARD", "Credit Card"
        OTHER = "OTHER", "Other"

    # single user can have multiple a/c.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="accounts")
    acc_name = models.CharField(max_length=100)
    acc_type = models.CharField(max_length=100, choices=AccountType.choices)
    acc_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Soft-delete mechanism: instead of deleting, a/c should be deactivated, Preserves financial/transaction history instead of wiping data from DB, and prevent broken foreign keys., (This is the reason behind using is_active)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ordering accourding to created at 
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.acc_name