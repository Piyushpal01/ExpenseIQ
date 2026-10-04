from django.db import models
from django.conf import settings

# Create your models here.
class Category(models.Model):
    # Category Type - Either income or expense
    class CategoryType(models.TextChoices):
        INCOME = "INCOME", "Income",
        EXPENSE = "EXPENSE", "Expense"

    # Which user does this category belong to? settings.auth_user_model gives that user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="categories")
    category_name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=12, choices=CategoryType.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Meta settings: To control database rules and custom behaviors
    class Meta:
        ordering = ["category_name"] # sorting in alphabetical order
        # DB Level Constraints - Prevents duplicate entries for a single user, To make the combination of (User + Name + Category_type) unique 
        # UniqueConstraint => So a user cannot create a category with the same name and type more than once
        constraints = [
            models.UniqueConstraint(
                fields=["user", "category_name", "category_type"],
                name="unique_user_category_type"
            )
        ]

    # returning category name with its type - e.g., "food (expense)"
    def __str__(self):
        return f"{self.category_name} ({self.category_type})"