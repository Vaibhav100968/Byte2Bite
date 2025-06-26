from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.


class Customer(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    published_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class InventoryItem(models.Model):
    business = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='inventory_items')
    name = models.CharField(max_length=255)
    total_added = models.IntegerField(default=0)
    total_sold = models.IntegerField(default=0)
    current_quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['business', 'name']

    def __str__(self):
        return f"{self.business.email} - {self.name}"

    @property
    def available_quantity(self):
        return self.current_quantity


class Sale(models.Model):
    business = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='sales')
    item = models.ForeignKey(
        InventoryItem, on_delete=models.CASCADE, related_name='sales')
    quantity = models.IntegerField()
    sold_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.business.email} - {self.item.name} x{self.quantity}"


class InventoryReport(models.Model):
    business = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='inventory_reports')
    # daily, weekly, monthly, custom
    report_type = models.CharField(max_length=20)
    file_path = models.CharField(max_length=500)
    generated_at = models.DateTimeField(auto_now_add=True)
    period_start = models.DateField()
    period_end = models.DateField()

    def __str__(self):
        return f"{self.business.email} - {self.report_type} report ({self.period_start} to {self.period_end})"
