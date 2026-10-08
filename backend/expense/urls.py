from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet

router = DefaultRouter()

router.register("", ExpenseViewSet, basename="expense")

urlpatterns = router.urls   # assign auto gnerated paths from drf router to django standard URL pattern list
