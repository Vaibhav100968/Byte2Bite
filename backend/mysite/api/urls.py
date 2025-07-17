from django.urls import path
from . import views

urlpatterns = [
    path('customers/', views.CustomerListCreate.as_view(),
         name='customer-list-create'),
    path('analyze-image/', views.analyze_image, name='analyze-image'),
    path('test-inventory-data/', views.send_test_inventory_data,
         name='test-inventory-data'),
    path('inventory/', views.InventoryItemListCreate.as_view(),
         name='inventory-list-create'),
    path('inventory/<int:pk>/', views.InventoryItemDetail.as_view(),
         name='inventory-detail'),
    path('sales/', views.SaleListCreate.as_view(), name='sale-list-create'),
    path('reports/', views.InventoryReportList.as_view(), name='report-list'),
    path('reports/generate/', views.generate_inventory_report,
         name='generate-report'),
    path('reports/<int:report_id>/download/',
         views.download_report, name='download-report'),
    path('update-reporting-frequency/', views.update_reporting_frequency,
         name='update-reporting-frequency'),
    path('chat/', views.chat_with_ai, name='chat-with-ai'),
    
    # Store and Product endpoints
    path('stores/', views.StoreList.as_view(), name='store-list'),
    path('stores/<int:pk>/', views.StoreDetail.as_view(), name='store-detail'),
    path('stores/<int:store_id>/products/', views.ProductList.as_view(), name='product-list'),
    
    # Order endpoints
    path('orders/', views.OrderListCreate.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', views.OrderDetail.as_view(), name='order-detail'),
    
    # Payment endpoints removed - Stripe integration removed
]
