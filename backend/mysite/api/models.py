from django.db import models

# Create your models here.


class Customer(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    published_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
