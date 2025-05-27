"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Utensils, DollarSign, Tag } from "lucide-react";

export default function MenuManagement() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null as File | null,
  });

  // Mock data for menu items
  const menuItems = [
    {
      id: 1,
      name: "Classic Burger",
      description: "Juicy beef patty with fresh vegetables",
      price: 12.99,
      category: "main",
      image: "/images/burger.jpg",
    },
    {
      id: 2,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing",
      price: 8.99,
      category: "appetizers",
      image: "/images/salad.jpg",
    },
    {
      id: 3,
      name: "Chocolate Cake",
      description: "Rich chocolate cake with ganache",
      price: 6.99,
      category: "desserts",
      image: "/images/cake.jpg",
    },
  ];

  const categories = [
    { id: "all", name: "All Items" },
    { id: "appetizers", name: "Appetizers" },
    { id: "main", name: "Main Courses" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
  ];

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the new item to your database
    toast({
      title: "Success",
      description: "New menu item added successfully",
    });
    setIsAddingItem(false);
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
    });
  };

  const handleDeleteItem = (id: number) => {
    // Here you would typically delete the item from your database
    toast({
      title: "Success",
      description: "Menu item deleted successfully",
    });
  };

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <Button
            className="bg-[#FF7F50] hover:bg-[#FF6B3D]"
            onClick={() => setIsAddingItem(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`${
                  activeCategory === category.id
                    ? "bg-[#FF7F50] hover:bg-[#FF6B3D]"
                    : "border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-white">
              <CardHeader>
                <div className="aspect-video relative bg-gray-100 rounded-lg mb-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  )}
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#FF7F50] hover:text-[#FF6B3D]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#FF7F50]">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {categories.find((c) => c.id === item.category)?.name}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Item Modal */}
        {isAddingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Add New Menu Item</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) =>
                          setNewItem({ ...newItem, price: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) =>
                          setNewItem({ ...newItem, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((c) => c.id !== "all")
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Item Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          image: e.target.files?.[0] || null,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingItem(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#FF7F50] hover:bg-[#FF6B3D]"
                    >
                      Add Item
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
