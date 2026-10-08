from rest_framework.routers import DefaultRouter
from .views import IncomeViewSet

router = DefaultRouter()

router.register("", IncomeViewSet, basename="income")

urlpatterns = router.urls   # assign the auto-generated routing paths from the DRF router to Django's standard URL pattern list.
