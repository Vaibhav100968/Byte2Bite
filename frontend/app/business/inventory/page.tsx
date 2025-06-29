"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Send,
  Bot,
  Package,
  Plus,
  Search,
  AlertCircle,
  Upload,
  Camera,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { api, InventoryItem as ApiInventoryItem, ApiError } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DetectedItem {
  name: string;
  confidence: number;
  category: string;
}

// Updated interface to match the API model
interface InventoryItem {
  id: number;
  name: string;
  total_added: number;
  total_sold: number;
  current_quantity: number;
  created_at: string;
  updated_at: string;
}

export default function InventoryManagement() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your inventory advisor. I can help you optimize your stock levels based on sales trends and seasonal patterns. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    total_added: 0,
    current_quantity: 0,
  });
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load inventory items from API
  useEffect(() => {
    loadInventoryItems();
  }, []);

  const loadInventoryItems = async () => {
    try {
      setIsLoadingInventory(true);
      const items = await api.getInventoryItems();
      setInventoryItems(items);
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : "Failed to load inventory";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: generateAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    // This is a mock response generator. In a real application, this would call an LLM API
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("beef") || lowerInput.includes("meat")) {
      return "Based on recent sales trends, I recommend ordering 30kg of ground beef. Your current stock of 25kg is above the reorder point, but with the upcoming weekend rush, you might want to stock up. The price from Meat Co. is currently favorable.";
    }

    if (lowerInput.includes("vegetable") || lowerInput.includes("produce")) {
      return "I notice your lettuce and tomato stocks are healthy, but I recommend ordering 10kg of each to prepare for the weekend. The quality from Fresh Produce has been excellent lately, and prices are stable.";
    }

    if (lowerInput.includes("cheese")) {
      return "Your cheese inventory is at 12kg, which is above the reorder point. However, considering the popularity of cheese-based items, I suggest ordering 15kg to ensure you don't run out during peak hours.";
    }

    if (lowerInput.includes("trend") || lowerInput.includes("analysis")) {
      return "Based on the last 30 days of sales data:\n1. Burger sales are up 15% on weekends\n2. Salad orders peak during lunch hours\n3. Pizza orders are highest on Friday nights\nI recommend adjusting your inventory accordingly.";
    }

    return "I can help you analyze your inventory needs based on sales trends, seasonal patterns, and upcoming events. Would you like specific recommendations for any particular item?";
  };

  const handleAddItem = async () => {
    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = await api.updateInventoryItem(editingItem.id, {
          name: newItem.name || editingItem.name,
          total_added: newItem.total_added || editingItem.total_added,
          current_quantity:
            newItem.current_quantity || editingItem.current_quantity,
        });

        setInventoryItems((items) =>
          items.map((item) => (item.id === editingItem.id ? updatedItem : item))
        );

        toast({
          title: "Success",
          description: "Inventory item updated successfully",
        });
      } else {
        // Add new item
        const createdItem = await api.createInventoryItem({
          name: newItem.name || "",
          total_added: newItem.total_added || 0,
          current_quantity: newItem.current_quantity || 0,
        });

        setInventoryItems((items) => [...items, createdItem]);

        toast({
          title: "Success",
          description: "Inventory item added successfully",
        });
      }

      setIsAddModalOpen(false);
      setEditingItem(null);
      setNewItem({
        name: "",
        total_added: 0,
        current_quantity: 0,
      });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "Failed to save inventory item";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem(item);
    setIsAddModalOpen(true);
  };

  const filteredItems = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setIsProcessingImage(true);

    try {
      // Convert image to base64 for API call
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Simulate API call to computer vision service
        // In a real application, this would call your backend API
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate processing time

        // Mock detection results
        const mockDetectedItems: DetectedItem[] = [
          { name: "Ground Beef", confidence: 0.95, category: "Meat" },
          { name: "Chicken Breast", confidence: 0.85, category: "Meat" },
          { name: "Pork Chops", confidence: 0.75, category: "Meat" },
        ];

        setDetectedItems(mockDetectedItems);
        setIsProcessingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      setIsProcessingImage(false);
    }
  };

  const handleSelectDetectedItem = (item: DetectedItem) => {
    setNewItem({
      ...newItem,
      name: item.name,
    });
    setDetectedItems([]);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white"
              onClick={() => {
                // Navigate to the analyze page
                window.location.href = "/business/analyze";
              }}
            >
              <Camera className="mr-2 h-4 w-4" />
              AI Image Analyzer
            </Button>
            <Button
              className="bg-[#FF7F50] hover:bg-[#FF6B3D]"
              onClick={() => {
                setEditingItem(null);
                setNewItem({
                  name: "",
                  total_added: 0,
                  current_quantity: 0,
                });
                setIsAddModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Current Inventory</CardTitle>
                    <CardDescription>
                      Manage your stock levels and reorder points
                    </CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search inventory..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Current Quantity: {item.current_quantity} • Total
                          Added: {item.total_added} • Total Sold:{" "}
                          {item.total_sold}
                          {item.current_quantity <= 5 && (
                            <span className="ml-2 text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Low Stock
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(item.created_at).toLocaleDateString()} •
                          Updated:{" "}
                          {new Date(item.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white"
                          onClick={() => handleEditItem(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white"
                        >
                          Order
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Advisor */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-[#FF7F50]" />
                  AI Inventory Advisor
                </CardTitle>
                <CardDescription>
                  Get smart recommendations for your inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-[#FF7F50] text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">
                            {message.content}
                          </p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm">Thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="mt-4 flex space-x-2">
                  <Input
                    placeholder="Ask about inventory recommendations..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="bg-[#FF7F50] hover:bg-[#FF6B3D]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            {/* Left column - Image upload and detection */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected item"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedImage(null);
                        setDetectedItems([]);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#FF7F50] hover:bg-[#FF6B3D] text-white"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo or Upload Image
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Upload an image of your inventory item
                    </p>
                  </div>
                )}
              </div>

              {isProcessingImage && (
                <div className="text-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#FF7F50]" />
                  <p className="mt-2 text-sm text-gray-500">
                    Processing image...
                  </p>
                </div>
              )}

              {detectedItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Detected Items</h4>
                  <div className="space-y-2">
                    {detectedItems.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleSelectDetectedItem(item)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{item.name}</span>
                          <span className="text-sm text-gray-500">
                            {Math.round(item.confidence * 100)}% match
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column - Form fields */}
            <div className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="total_added">Total Added</Label>
                  <Input
                    id="total_added"
                    type="number"
                    value={newItem.total_added}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        total_added: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="current_quantity">Current Quantity</Label>
                  <Input
                    id="current_quantity"
                    type="number"
                    value={newItem.current_quantity}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        current_quantity: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingItem(null);
                setNewItem({
                  name: "",
                  total_added: 0,
                  current_quantity: 0,
                });
                setSelectedImage(null);
                setDetectedItems([]);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FF7F50] hover:bg-[#FF6B3D]"
              onClick={handleAddItem}
            >
              {editingItem ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
