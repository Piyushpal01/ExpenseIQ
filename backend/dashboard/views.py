from django.db.models import Sum, F
from django.db.models.functions import TruncMonth
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
import datetime

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
        Response: JSON with total stats, individual account liquidity, and top 5 recent transactions. This dashboard app itself have no table, it just read other apps table and calculates and return response as collective data.
        Data that is send as response while hitting get method on /dashboard
        [ total income, total expense, net balance, total acc balance, recent_transactions, active accounts, category_expenses(chart data), category_incomes(chart data), monthly_chart_data(income vs expense trend) ]
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

        # Account Summary - Active accounts only (soft-deleted accounts excluded)
        # .values() fetches raw dictionaries / specific fields instead of heavy Django model instances like .all() which fetches all fields, saving RAM.
        active_accounts_qs = Account.objects.filter(user=user, is_active=True)
        accounts = active_accounts_qs.values("id", "acc_name", "acc_type", "acc_balance")

        # Total balance, Trigger SQL Sum across all accounts to compute overall liquidity
        total_account_balance = active_accounts_qs.aggregate(total=Sum("acc_balance"))["total"] or 0

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

        # print("RECENT INCOME:", list(recent_income))    # print income object
        # print("RECENT EXPENSE:", list(recent_expense))  # print expense object

        # Combine all transactions, sort dynamically, and slice down to final top 5 items
        '''
        # chain function groups all the iterables together and produces a single iterable as output
        # sorted() runs in-memory. key=lambda sorts by date first, then by timestamp (created_at) for deterministic order.
        # reverse=True ensures latest items appear first. [:5] gets the final top 5 mixed actions.
        '''
        transactions = sorted(
            chain(recent_income, recent_expense),
            key=lambda transaction: (
                transaction.date,
                transaction.created_at
            ),
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

        # CHART-1: CATEGORY-WISE AGGREGATION FOR PIE CHARTS, Category wise Chart for income / expense
        # .values group the data by category_name, & .annotate() sums up the amount for each group
        # F() is used to reach into related 'Category' table & pull 'category_name' directly
        category_income_qs = Income.objects.filter(user=user).values(
            category_name = F("category__category_name")
        ).annotate(amount = Sum("amount")).order_by("-amount")

        category_expense_qs = Expense.objects.filter(user=user).values(
            category_name = F("category__category_name")
        ).annotate(amount = Sum("amount")).order_by("-amount")

        # Map to Exact JSON Shape required by Recharts (Frontend)
        # Since queryset data that comes from db, looks something like this: [{"category_name": "Salary", "amount": 50000}, ...] and  Recharts expects: [{ "category": "Salary", "amount": 50000 },], so with loop we pick every item's category name and map into 'category' key

        # Empty lists to hold formatted chart data
        category_incomes = []
        category_expenses = []

        # Loop through raw income and expense queryset to reshape keys for Recharts, category_name -> category
        for item in category_income_qs:
            # Map 'category_name' to 'category' to match frontend chart schema
            data = {
                "category": item["category_name"],
                "amount": item["amount"]
            }
            # Push formatted record into final income list
            category_incomes.append(data)

        for item in category_expense_qs:
            # Map 'category_name' to 'category' to match frontend chart schema
            data = {
                "category": item["category_name"],
                "amount": item["amount"]
            }
            # Push formatted record into final income list
            category_expenses.append(data)

        # CHART-2: MONTHLY TREND AGGREGATION FOR BAR CHART, for Income vs Expense Trend in past 6 months
        # fetch last 6 months data
        six_months_ago = timezone.now().date() - datetime.timedelta(days=180)

        # TruncMonth truncates date to the 1st of the month (e.g., 2026-11-15 -> 2026-11-01) for grouping
        monthly_incomes_qs = Income.objects.filter(user=user, date__gte=six_months_ago).annotate(
            month = TruncMonth("date")
        ).values("month").annotate(total=Sum("amount"))

        monthly_expenses_qs = Expense.objects.filter(user=user, date__gte=six_months_ago).annotate(
            month = TruncMonth("date")
        ).values("month").annotate(total=Sum("amount"))

        # Merge them into a single dictionary using the date object as the key
        monthly_data = {}

        for item in monthly_incomes_qs:
            month_date = item["month"]
            if month_date not in monthly_data:
                monthly_data[month_date] = {"income": 0, "expense": 0}
            monthly_data[month_date]["income"] += item["total"]

        for item in monthly_expenses_qs:
            month_date = item["month"]
            if month_date not in monthly_data:
                monthly_data[month_date] = {"income": 0, "expense": 0}
            monthly_data[month_date]["expense"] += item["total"]

        # Sort chronologically and format for Recharts array: [{month: "Nov 26", income: 5000, expense: 3000}]
        monthly_chart_data = []
        for d in sorted(monthly_data.keys()):
            # Fallback if d is string (sqlite edge case), otherwise format date
            month_label = d.strftime("%b %y") if hasattr(d, 'strftime') else str(d)[:7]
            monthly_chart_data.append({
                "month": month_label,
                "income": monthly_data[d]["income"],
                "expense": monthly_data[d]["expense"]
            })       

        # API Response
        return Response(
            {
                "total_income": total_income,
                "total_expense": total_expense,
                "net_balance": net_balance,
                "total_account_balance": total_account_balance,
                "accounts": list(accounts),
                "recent_transactions": recent_transactions,
                "category_incomes": category_incomes,       # Chart 1 Data
                "category_expenses": category_expenses,     # Chart 2 Data
                "monthly_chart_data": monthly_chart_data,   # Chart 3 Data
            }
        )