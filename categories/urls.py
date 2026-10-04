from rest_framework.routers import DefaultRouter
from .views import CategoryViewset

router = DefaultRouter()

router.register("", CategoryViewset, basename="category")

urlpatterns = router.urls
