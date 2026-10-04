from rest_framework import viewsets
from django.db import transaction
# from django_filters.rest_framework import De

from .models import Income
from accounts.models import Account
from .serializers import IncomeSerializer


# Create your views here.
class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer

    def get_queryset(self):
        """fetch only those income records that belong to current logged-in user"""
        return Income.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically injects currently logged-in user into the income record upon creation, this prevent user to enter field manually

        Saves the new income entry and safely updates the linked account balance.
        User ki income save karke, `select_for_update` se account balance safely badhata hai, and Uses database locks and transactions to prevent race conditions during calculation.
        """

        """
        Business Logic:
        """

        # Start db transaction: if anything failed inside, everything rolls back
        with transaction.atomic():  # All-or-Nothing Block
            income = serializer.save(user=self.request.user)    # save the new income entry and set it's user field to logged-in user

            # SELECT_FOR_UPDATE locks this specific Account row in the DB so no other request can modify its balance simultaneously
            account = Account.objects.select_for_update().get(id=income.account.id)
            
            # As in income model money will get add, so increase the balance by income's amount, and update only acc_balance col in db to optimize speed and avoiding overwriting other fields
            account.acc_balance += income.amount
            account.save(update_fields=['acc_balance']) 

    def perform_update(self, serializer):
        """
        Updates the income records and updates account balances.
        
        Logic:
        - CASE-1: If the account stays the same, it only calculates and updates the difference in amount.
        - CASE-2: If the account is changed, it completely reverts the old account and adds funds to the new one.
        """

        # Transaction Block
        with transaction.atomic():
            # Fetch and lock the OLD income row.
            # This prevents concurrent updates from changing the historical values while this transaction is running.
            # self.get_object() directly fetch data from db nd returns model object(complete row), thru which we can acess any columnss
            old_income_object = Income.objects.select_for_update().get(pk=self.kwargs["pk"])
            # print("old_income_object =>", old_income_object)

            # Save OLD values before serializer.save()
            old_account_id = old_income_object.account_id
            old_amount = old_income_object.amount

            # Apply the requested changes
            income = serializer.save()

            # updated fields
            new_account_id = income.account_id
            new_amount = income.amount

            if old_account_id == new_account_id:
                '''CASE-1: If account same -> calculate difference and update balance'''
                # Lock single account row, so other req cannot change it simultaneously, old_acc_id is the one to get update so lock it
                account = Account.objects.select_for_update().get(id=old_account_id)    

                # calculate difference 
                difference = new_amount - old_amount

                # update balance and save, add the calculated difference in already saved balance
                account.acc_balance += difference
                account.save(update_fields=['acc_balance'])
            else:
                '''CASE-2: If account changed -> move amount between accounts'''
                # Lock both old account and new account rows in db
                old_account = Account.objects.select_for_update().get(id=old_account_id)
                new_account = Account.objects.select_for_update().get(id=new_account_id)

                # Deduct the old income amount from the old account (reverting it), and add new income amount to the new account
                old_account.acc_balance -= old_amount
                new_account.acc_balance += new_amount

                # save for both rows
                old_account.save(update_fields=['acc_balance'])
                new_account.save(update_fields=['acc_balance'])

    def perform_destroy(self, instance):
        # Transaction Block: Ensure calculation and balance update happens together
        with transaction.atomic():
            # Lock the account row associated with income entry
            # print("____INSTANCE_____ ", instance)
            account = Account.objects.select_for_update().get(id=instance.account_id)

            # Deduct the income amount from acc_balance, as it no longer exist, and save in db
            account.acc_balance -= instance.amount
            account.save(update_fields=['acc_balance'])

            # Permanently delete the income recoord from db
            instance.delete()