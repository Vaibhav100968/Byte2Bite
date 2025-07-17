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


class Store(models.Model):
    business = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='store', limit_choices_to={'user_type': 'business'})
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    address = models.TextField()
    phone = models.CharField(max_length=15, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.business.email}"


class Product(models.Model):
    store = models.ForeignKey(
        Store, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True)
    in_stock = models.BooleanField(default=True)
    stock_quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.store.name}"


class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready for Pickup'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    customer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='orders', limit_choices_to={'user_type': 'customer'})
    store = models.ForeignKey(
        Store, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    # Stripe payment intent field removed
    delivery_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.customer.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x{self.quantity} - Order {self.order.id}"
