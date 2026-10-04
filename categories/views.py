from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CategorySerializer
from .models import Category

# Create your views here.
class CategoryViewset(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        # Return only the categories of the currently logged-in user.
        # User A cannot see User B's categories. This ensures strict user isolation, Called USER ISOLATION TECHNIQUE
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # print("self.request.user => ", self.request.user)
        serializer.save(user=self.request.user)
    