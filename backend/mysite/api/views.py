from django.shortcuts import render
from rest_framework import generics
from .models import Customer
from .serializers import CustomerSerializer


class CustomerListCreate(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
