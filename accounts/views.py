from rest_framework import viewsets
from .models import Account
from .serializers import AccountSerializer

# Create your views here.
class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer

    # To perform **Dynamic Filtering** based on whoever is currently logged in, we completely drop the static variable and let the dynamic method handle it
    # 'queryset = Account.objects.all()' is omitted here because static class variables load at server boot and cannot access dynamic user request context.
    def get_queryset(self):
        """
        MANDATORY NAME(get_queryset): Pre-defined hook inside DRF. The name has to be this only.
        PURPOSE: Isolates user data. Ensures users can only view their own accounts.
        Fetch only those accounts that belong to the logged-in user. 
        self.request.user gives you the currently logged-in (authenticated) user.
        Filters the Account table so that User A can never access User B's financial data
        """
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        MANDATORY NAME(perform_create): Pre-defined hook inside DRF.
        PURPOSE: Automatically injects the logged-in user as account owener, and save to the database.
        """
        # Implicitly binds the logged-in user to the new record, avoiding frontend payload manipulation, so that the frontend/user, can't send user-id and backend automatically assign the data to logged-in user
        serializer.save(user=self.request.user)