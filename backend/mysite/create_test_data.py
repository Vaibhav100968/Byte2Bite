#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from accounts.models import User
from api.models import Store, Product

def create_test_data():
    print("Creating test data...")
    
    # Create a business user
    business_user, created = User.objects.get_or_create(
        email='business@test.com',
        defaults={
            'username': 'testbusiness',
            'user_type': 'business',
            'first_name': 'Test',
            'last_name': 'Business',
            'phone_number': '1234567890',
            'address': '123 Business St, Test City, TS 12345'
        }
    )
    
    if created:
        business_user.set_password('testpass123')
        business_user.save()
        print(f"Created business user: {business_user.email}")
    
    # Create a store
    store, created = Store.objects.get_or_create(
        business=business_user,
        defaults={
            'name': 'Test Restaurant',
            'description': 'A delicious test restaurant with amazing food!',
            'address': '456 Food Ave, Test City, TS 12345',
            'phone': '9876543210',
            'is_active': True
        }
    )
    
    if created:
        print(f"Created store: {store.name}")
    
    # Create products
    products_data = [
        {
            'name': 'Margherita Pizza',
            'description': 'Classic tomato sauce with mozzarella cheese',
            'price': 15.99,
            'in_stock': True,
            'stock_quantity': 50
        },
        {
            'name': 'Chicken Burger',
            'description': 'Grilled chicken with fresh vegetables',
            'price': 12.99,
            'in_stock': True,
            'stock_quantity': 30
        },
        {
            'name': 'Caesar Salad',
            'description': 'Fresh romaine lettuce with caesar dressing',
            'price': 8.99,
            'in_stock': True,
            'stock_quantity': 25
        },
        {
            'name': 'Chocolate Cake',
            'description': 'Rich chocolate cake with vanilla frosting',
            'price': 6.99,
            'in_stock': True,
            'stock_quantity': 20
        }
    ]
    
    for product_data in products_data:
        product, created = Product.objects.get_or_create(
            store=store,
            name=product_data['name'],
            defaults=product_data
        )
        
        if created:
            print(f"Created product: {product.name} - ${product.price}")
    
    print("\nTest data created successfully!")
    print(f"Business email: {business_user.email}")
    print(f"Business password: testpass123")
    print(f"Store: {store.name}")
    print(f"Products: {Product.objects.filter(store=store).count()} items")

if __name__ == '__main__':
    create_test_data() 