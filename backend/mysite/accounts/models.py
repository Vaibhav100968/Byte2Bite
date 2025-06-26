from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('business', 'Business'),
        ('customer', 'Customer'),
    )

    REPORTING_FREQUENCY_CHOICES = (
        ('daily', 'Every 1 day'),
        ('3days', 'Every 3 days'),
        ('weekly', 'Once a week'),
        ('monthly', 'Once a month'),
        ('custom', 'Custom'),
    )

    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    reporting_frequency = models.CharField(
        max_length=10,
        choices=REPORTING_FREQUENCY_CHOICES,
        default='weekly',
        blank=True
    )
    custom_reporting_days = models.IntegerField(
        default=7,
        blank=True,
        null=True,
        help_text="Number of days for custom reporting frequency"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'user_type']

    def __str__(self):
        return self.email
