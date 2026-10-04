from rest_framework import viewsets
from django.db import transaction
from .serializers import ExpenseSerializer
from .models import Expense
from accounts.models import Account

# Create your views here.
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer

    '''Check Notes for better understanding of Expense Model Logic & Recalibration'''

    def get_queryset(self):
        """fetch only those expense records that belong to current logged-in user"""
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Saves the income entry for the logged-in user and safely increases their account balance.
        Automatically binds request.user to the record and uses database locks to prevent concurrent race conditions.
        """

        # Transaction Block
        with transaction.atomic():
            # save new income and set it's user field
            expense = serializer.save(user=self.request.user)

            # Lock the entire Account row so no other parallel request can modify its balance simultaneously
            account = Account.objects.select_for_update().get(id=expense.account.id)

            # As in expense model money will get deduct, so deduct the balance by expense amount, and save the update balance
            account.acc_balance -= expense.amount
            account.save(update_fields=['acc_balance'])

    def perform_update(self, serializer):
        """
        Updates the expense record and recalibrates account balances.
        
        Logic:
        - CASE-1: If the account stays the same, it calculates the difference and deducts it.
        - CASE-2: If the account is changed, it completely reverts the old account and deducts funds from the new one.
        """

        with transaction.atomic():
            # Fetch the OLD expense directly from the database, and lock this row for the duration of this transaction.
            # select_for_update() helps protect us from concurrent requests trying to modify the same expense at the same time.
            # So ultimately, it becomes concurrent-safe / deadlock-proof.

            # self.kwargs["pk"]: It fetches the ID directly from the URL and queries the database. e.g., User hits API (such as PUT /api/expenses/5/), Django extracts that ID (5) from the URL and places it into the view's self.kwargs dictionary under the key "pk".
            old_expense_object = Expense.objects.select_for_update().get(pk=self.kwargs["pk"])

            # Store the old values before saving new values(serialzier.save())
            old_account_id = old_expense_object.account_id
            old_amount = old_expense_object.amount

            # Apply the requested changes
            expense = serializer.save()

            # updated fields, new Values
            new_account_id = expense.account_id
            new_amount = expense.amount

            if old_account_id == new_account_id:
                '''CASE-1: If account same -> calculate difference and update balance'''
                # Lock single account row,, so no other request can modify it's balance
                account = Account.objects.select_for_update().get(id=old_account_id)

                difference = new_amount - old_amount

                # update balance, deduct calculated difference from already saved balance(e.g. if expense increase, balance goes down)
                account.acc_balance -= difference
                account.save(update_fields=['acc_balance'])
            else:
                '''CASE-2: If account changed -> move amount between accounts'''
                # Lock both the old and new account rows
                old_account = Account.objects.select_for_update().get(id=old_account_id)
                new_account = Account.objects.select_for_update().get(id=new_account_id)

                # Revert the old account by adding back the old expense amount, and deduct the new amount from the new account & save
                old_account.acc_balance += old_amount
                new_account.acc_balance -= new_amount

                old_account.save(update_fields=["acc_balance"])
                new_account.save(update_fields=["acc_balance"])

    def perform_destroy(self, instance):
        # Transaction Block: Ensure calculation and balance update happens together with deletion
        with transaction.atomic():
            # Lock the account row associated with this expense entry before deletion
            account = Account.objects.select_for_update().get(id=instance.account_id)

            # Add back the expense amount to acc_balance, as it no longer exists, and save in DB
            account.acc_balance += instance.amount
            account.save(update_fields=["acc_balance"])

            # Permanently delete the expense record from DB
            instance.delete()