from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from itertools import chain

from accounts.models import Account
from income.models import Income
from expense.models import Expense

# Create your views here.
class DashboardView(APIView):
    """
    Fetches a comprehensive financial summary for the authenticated user.
    Calculates aggregates and merges split income/expense histories into a single timeline.

    Returns:
        Response: JSON with total stats, individual account liquidity, and top 5 recent transactions.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Sum total user income and expense; fallback to 0 if null
        
        # .aggregate() shifts calculations to SQL level. It does NOT fetch rows into Python memory.
        # Sum('amount') triggers SQL SUM(). [ 'total' ] extracts the value from the returned dict & store it in total variable
        # 'or 0' is a null-fallback safeguard preventing application crash for new users with no entries.
        
        total_income = Income.objects.filter(user=user).aggregate(total=Sum("amount"))["total"] or 0
        total_expense = Expense.objects.filter(user=user).aggregate(total=Sum("amount"))["total"] or 0

        # net savings
        net_balance = total_income - total_expense

        # Account Summary
        # .values() fetches raw dictionaries / specific fields instead of heavy Django model instances like .all() which fetches all fields, saving RAM.
        accounts = Account.objects.filter(user=user).values("id", "acc_name", "acc_type", "acc_balance")

        # Total balance, Trigger SQL Sum across all accounts to compute overall liquidity
        total_account_balance = Account.objects.filter(user=user).aggregate(total=Sum("acc_balance"))["total"] or 0

        '''
        Net Balance and total_account_balance might look same in starting but they have different work:
        Agar opening balances use kar rahe h, toh total_account_balance hamesha tumhare net_balance se bada ya alag hoga. Dashboard UI par dono metrics alag jagah dikhte hain: Net Balance batata hai app mein tracked bachat, aur Total Account Balance batata hai tumhari kul net worth/liquidity.
        Net Balance = App-tracked savings from transactions (e.g., New Income ₹10k - Expense ₹2k = ₹8k).
        Total Account Balance = Actual live net worth across all wallets including opening balances (e.g., SBI ₹50k old + ₹8k new = ₹58k).
        '''

        # Recent Transactions
        # since income, expense are 2 different table, django orm can't combine them, causes polymorphic serialization
        '''
        Polymorphic Serialization: Iterates over mixed structural shapes (Income/Expense objects) and flattens them into a clean, uniform JSON dictionary shape that the frontend can readily parse.
        isinstance(object, classinfo), a built-in utility, checks whether an object belongs to a specific class, type, or subclass.
        if transaction belongs to income, set transaction_type='income', otherwise 'expense'
        
        select_related('account', 'category') performs an SQL INNER JOIN. It binds Income / Expense table with its respective Account and Category table. [:5] => only top 5 results.
        '''

        # Fetch top 5 recent incomes with pre-fetched foreign keys
        recent_income = Income.objects.filter(
            user=user
        ).select_related(
            "account", 
            "category",
        ).order_by(
            "-date",
            "-created_at"
        )[:5]

        # Fetch top 5 recent expenses with pre-fetched foreign keys
        recent_expense = Expense.objects.filter(
            user=user
        ).select_related(
            "account",
            "category"
        ).order_by(
            "-date",
            "-created_at",
        )[:5]

        # Combine all transactions, sort dynamically, and slice down to final top 5 items
        '''
        # chain function groups all the iterables together and produces a single iterable as output
        # sorted() runs in-memory. key=lambda sorts by date first, then by timestamp (created_at) for deterministic order.
        # reverse=True ensures latest items appear first. [:5] gets the final top 5 mixed actions.
        '''
        transactions = sorted(
            chain(recent_income, recent_expense),
            key=lambda transaction: (transaction.date,transaction.created_at),
            reverse=True,
        )[:5]

        
        # Serialize polymorphic database objects into clean frontend JSON
        recent_transactions = []

        for transaction in transactions:
            # isinstance check if transaction belongs to income or expense
            if isinstance(transaction, Income):
                transaction_type = "income"
            else:
                transaction_type = "expense"

            # append result
            recent_transactions.append(
                {
                    "type": transaction_type,
                    "id": transaction.id,
                    "amount": transaction.amount,
                    "description": transaction.description,
                    "date": transaction.date,
                    "category": transaction.category.category_name,
                    "account": transaction.account.acc_name,
                }
            )

        # API Response
        return Response(
            {
                "total_income": total_income,
                "total_expense": total_expense,
                "net_balance": net_balance,
                "total_account_balance": total_account_balance,
                "accounts": list(accounts),
                "recent_transactions": recent_transactions,
            }
        )