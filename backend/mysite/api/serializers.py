from rest_framework import serializers
from .models import Customer, InventoryItem, Sale, InventoryReport


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'total_added', 'total_sold',
                  'current_quantity', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SaleSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)

    class Meta:
        model = Sale
        fields = ['id', 'item', 'item_name', 'quantity', 'sold_at']
        read_only_fields = ['id', 'sold_at']


class InventoryReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryReport
        fields = ['id', 'report_type', 'file_path',
                  'generated_at', 'period_start', 'period_end']
        read_only_fields = ['id', 'generated_at']
