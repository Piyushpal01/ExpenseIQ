from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal

# Income table to track User income, amount, where it is coming from etc
class Income(models.Model):
    # to which user this income belongs to
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="incomes")

    # Foreign Key (Account): Which account the income was deposited into (e.g., HDFC Bank, Cash Wallet).
    # PROTECT means if any income is linked to this account, the database will not allow the account to be deleted.
    account = models.ForeignKey("accounts.Account", on_delete=models.PROTECT, related_name="incomes")

    # Foreign Key (Category): Which source the income came from (e.g., Salary, Freelance).
    # PROTECT means as long as this category is linked to an income, the category cannot be deleted.
    category = models.ForeignKey("categories.Category", on_delete=models.PROTECT, related_name="incomes")

    # models.PROTECT is intentionally used, coz If an Account or Category is already linked to a transaction history, deleting it accidentally should be blocked to prevent breaking historical data.

    # as amt must be greater than 0 so applying minvaluevalidator, validators=[MinValueValidator(Decimal("0.01"))]
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))],)
    description = models.TextField(blank=True)
    date = models.DateField()   # user can itself set at which data income was earned?
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        # double ordering - Django sorts data using wo-level hierarchy: primary sort(-date) so it sort all entries in desc order(newest to first) and then secondary sort(-created_at) so If multiple entries share the exact same date, it breaks the tie by sorting them by creation timestamp (Newest First).

    def __str__(self):
        return f"{self.amount} - {self.category.category_name}"