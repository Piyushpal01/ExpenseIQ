from rest_framework import viewsets,status
from rest_framework.response import Response
from .serializers import CategorySerializer
from .models import Category

# Create your views here.
class CategoryViewset(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        # Return only the only active categories of the currently logged-in user.
        # User A cannot see User B's categories. This ensures strict user isolation, Called USER ISOLATION TECHNIQUE
        return Category.objects.filter(user=self.request.user, is_active=True)

    def perform_create(self, serializer):
        # print("self.request.user => ", self.request.user)
        serializer.save(user=self.request.user)

    # Soft deleting category
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
        # custom response for soft delete
        return Response(status=status.HTTP_204_NO_CONTENT)
    