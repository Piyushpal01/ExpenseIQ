from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal

# Create your models here.
class Expense(models.Model):
    """
    LOGIC FLOW / CONNECTIONS:
    Tracks who spent the money (User), where it came from (Account e.g., SBI, Paytm),
    and what it was spent on (Category e.g., Food, Travel).
    """
    # Link to User, deleting user deletes all their expense
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="expense")

    # Linked to Account; protected from deletion if expenses exist
    account = models.ForeignKey("accounts.Account", on_delete=models.PROTECT, related_name="expense")

    # Linked to Category; protected from deletion if expenses exist
    category = models.ForeignKey("categories.Category", on_delete=models.PROTECT, related_name="expense")

    # check: the amount must be greater then 0.00, strictly positive (> 0.00)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))])
    description = models.TextField(blank=True)
    date = models.DateField()   # on which date expense was done
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        # latest entries first, like recent expense should show first, and if multiple expense done on same day then in that the latest expense should show(-created_at)
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.amount} - {self.category.category_name}"
