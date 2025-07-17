"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  in_stock: boolean;
  stock_quantity: number;
}

interface Store {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  is_active: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function StorePage() {
  const params = useParams();
  const storeId = params.id as string;
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStoreAndProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem(`cart_${storeId}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [storeId]);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem(`cart_${storeId}`, JSON.stringify(cart));
  }, [cart, storeId]);

  const fetchStoreAndProducts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch store details
      const storeResponse = await fetch(`http://127.0.0.1:8000/api/stores/${storeId}/`);
      if (!storeResponse.ok) throw new Error('Store not found');
      const storeData = await storeResponse.json();
      setStore(storeData);

      // Fetch products
      const productsResponse = await fetch(`http://127.0.0.1:8000/api/stores/${storeId}/products/`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
      toast({
        title: "Error",
        description: "Failed to load store information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart",
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7F50]"></div>
        <span className="ml-2">Loading store...</span>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Store not found</h2>
          <Link href="/customer/home" className="text-[#FF7F50] hover:underline">
            Back to stores
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/customer/home">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Stores
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
                <p className="text-gray-600">{store.description}</p>
              </div>
            </div>
            <Link href={`/customer/cart?store=${storeId}`}>
              <Button className="bg-[#FF7F50] hover:bg-[#FF6B3D] relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const cartItem = cart.find(item => item.product.id === product.id);
            const isInCart = !!cartItem;

            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {!product.in_stock && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.image_url && (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#FF7F50]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.stock_quantity > 0 && (
                        <span className="text-sm text-gray-500">
                          {product.stock_quantity} available
                        </span>
                      )}
                    </div>
                    
                    {isInCart ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{cartItem.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                            disabled={!product.in_stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-[#FF7F50] hover:bg-[#FF6B3D]"
                        onClick={() => addToCart(product)}
                        disabled={!product.in_stock}
                      >
                        {product.in_stock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-500">This store hasn't added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
} 