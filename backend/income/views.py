from rest_framework import viewsets, filters, serializers
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend

from .models import Income
from .serializers import IncomeSerializer
from accounts.models import Account


# Create your views here.
class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer

    # Query Filter Backends
    filter_backends = [
        DjangoFilterBackend,        # for Exact / Field-based filtering, (?account=3)
        filters.SearchFilter,       # fot text search, (?search=food)
        filters.OrderingFilter,     # for sorting, (?search=food)
    ]

    # Exact Match Filters: Filter records by specific fields
    filterset_fields = ["account", "category", "date",]

    # Text Search: Lookup keywords inside descriptions
    search_fields = ["description",]

    # Allowed Sort Fields: Fields users can explicitly sort by
    ordering_fields = ["amount", "date", "created_at",]

    # Default Ordering: Show newest entries first, if 2 incomes created at same date, then sort accordingly which is made newest first.
    ordering = ["-date", "-created_at"]

    def get_queryset(self):
        """fetch only those income records that belong to current logged-in user & JOIN account & category to prevent N+1 queries"""
        return Income.objects.filter(user=self.request.user).select_related("account", "category")

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
            
            # As in income model money will get add, so increase the balance by income's amount.
            account.acc_balance += income.amount
            # update only acc_balance col in db to optimize speed and avoiding overwriting other fields
            account.save(update_fields=['acc_balance']) 

    def perform_update(self, serializer):
        """
        Updates the income records and updates account balances.
        Negative Balance Guard(in perform update and destroy): Money is deducted from an acc when a user reduces prev income or shifts it to other account or deletes it. If deducting this money causes any acc other than credit card to drop below 0, it must be blocked. 
        
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
                available_balance = account.acc_balance

                # calculate difference 
                difference = new_amount - old_amount

                # update balance and save, add the calculated difference in already saved balance
                account.acc_balance += difference

                # Prevent negative balance for non-credit-card accounts
                if account.acc_type != "CREDIT_CARD" and account.acc_balance < 0:
                    raise serializers.ValidationError(
                        {"amount": f"Cannot reduce income. Account balance would drop below ₹0 (Available Balance: ₹{available_balance})."}
                    )
                
                account.save(update_fields=['acc_balance'])
            else:
                '''CASE-2: If account changed -> move amount between accounts'''
                # Implementing Concurrent account locking (prevents deadlock), instead of fetching first old account then transferring to new account
                # 1. Locks both old & new account rows in a strict deterministic order(by ID)
                locked_accounts = Account.objects.select_for_update().filter(
                    id__in = [old_account_id, new_account_id]
                ).order_by("id")

                # 2. Map account instances to their IDs for easy access
                accounts = {account.id: account for account in locked_accounts}

                # 3. Extract the locked objects safely using keys
                old_account = accounts[old_account_id]
                new_account = accounts[new_account_id]

                # Store old account balance before reverting income
                old_available_balance = old_account.acc_balance
                old_account.acc_balance -= old_amount

                # Prevent negative balance on the old account when reverting this income
                if old_account.acc_type != "CREDIT_CARD" and old_account.acc_balance < 0:
                    raise serializers.ValidationError(
                        {"account": f"Cannot move income from '{old_account.acc_name}'. Balance would drop below ₹0 (Available: ₹{old_available_balance})."}
                    )

                # add new income amount to the new account
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
            available_balance = account.acc_balance

            # Deduct the income amount from acc_balance, as it no longer exist, and save in db
            account.acc_balance -= instance.amount

            # Prevent negative balance for non-credit-card accounts upon income deletion
            if account.acc_type != "CREDIT_CARD" and account.acc_balance < 0:
                raise serializers.ValidationError(
                    {"detail": f"Cannot delete this income because '{account.acc_name}' balance would drop below ₹0 (Available: ₹{available_balance})."}
                )
            
            account.save(update_fields=['acc_balance'])

            # Permanently delete the income recoord from db
            instance.delete()