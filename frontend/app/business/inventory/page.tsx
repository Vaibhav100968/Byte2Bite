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
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { api, InventoryItem as ApiInventoryItem, ApiError, TestInventoryResponse } from "@/lib/api";

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

// Helper function to strip markdown formatting
const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/^\s*[-*+]\s+/gm, '• ') // Convert list markers
    .replace(/^\s*\d+\.\s+/gm, '• ') // Convert numbered lists
    .trim();
};

export default function InventoryManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
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
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Business profile for personalized responses
  const [businessProfile, setBusinessProfile] = useState({
    name: "Byte2Bite Restaurant",
    location: "New York",
    type: "Restaurant",
    hours: "8 AM - 10 PM",
    goals: "Reduce waste and increase profits",
  });

  // Load conversation from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('byte2bite_chat_history');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading chat history:', error);
        // If loading fails, start with default welcome message
        setMessages([{
          role: "assistant",
          content: "Hello! I'm Byte2Bite, your AI inventory advisor. I can analyze your inventory data and provide smart recommendations to help you reduce waste and maximize profits. Ask me about:\n\n• Inventory optimization\n• Waste reduction strategies\n• Sales trend analysis\n• Reorder recommendations\n• Cost analysis\n\nWhat would you like to know about your inventory?",
          timestamp: new Date(),
        }]);
      }
    } else {
      // No saved history, start with default welcome message
      setMessages([{
        role: "assistant",
        content: "Hello! I'm Byte2Bite, your AI inventory advisor. I can analyze your inventory data and provide smart recommendations to help you reduce waste and maximize profits. Ask me about:\n\n• Inventory optimization\n• Waste reduction strategies\n• Sales trend analysis\n• Reorder recommendations\n• Cost analysis\n\nWhat would you like to know about your inventory?",
        timestamp: new Date(),
      }]);
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Keep only the last 15 messages to prevent localStorage from getting too large
      const messagesToSave = messages.slice(-15);
      localStorage.setItem('byte2bite_chat_history', JSON.stringify(messagesToSave));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages are added (unless user is manually scrolling)
  useEffect(() => {
    if (shouldAutoScroll && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }, 100);
    }
  }, [messages, shouldAutoScroll]);

  // Handle scroll events to detect user scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 5;
    
    // Only auto-scroll if user is at the bottom or very close to it
    if (isAtBottom) {
      setIsUserScrolling(false);
      setShouldAutoScroll(true);
    } else {
      setIsUserScrolling(true);
      setShouldAutoScroll(false);
    }
  };

  // Load inventory items from API
  useEffect(() => {
    loadInventoryItems();
    loadReports();
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

  const loadReports = async () => {
    try {
      setIsLoadingReports(true);
      const reportsData = await api.getReports();
      setReports(reportsData);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const downloadReport = async (reportId: number, filename: string) => {
    try {
      const response = await api.downloadReport(reportId);
      
      // Create a blob from the response
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Downloading ${filename}`,
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : "Failed to download report";
      toast({
        title: "Download Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      setShouldAutoScroll(true);
      setIsUserScrolling(false);
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
    setShouldAutoScroll(true); // Auto-scroll when user sends a message

    try {
      // Convert inventory data to CSV format for the AI
      const csvData =
        inventoryItems.length > 0
          ? "item,sold,wasted,price,cost\n" +
            inventoryItems
              .map((item) => {
                // Generate realistic pricing data based on item type
                const basePrice = item.name.toLowerCase().includes("beef")
                  ? 15.99
                  : item.name.toLowerCase().includes("chicken")
                  ? 12.99
                  : item.name.toLowerCase().includes("pork")
                  ? 11.99
                  : item.name.toLowerCase().includes("cheese")
                  ? 8.99
                  : item.name.toLowerCase().includes("lettuce")
                  ? 3.99
                  : item.name.toLowerCase().includes("tomato")
                  ? 4.99
                  : item.name.toLowerCase().includes("onion")
                  ? 2.99
                  : item.name.toLowerCase().includes("milk")
                  ? 5.99
                  : item.name.toLowerCase().includes("bread")
                  ? 4.99
                  : item.name.toLowerCase().includes("potato")
                  ? 3.99
                  : 7.99;

                const cost = basePrice * 0.6; // Assume 60% cost margin
                const estimatedWaste = Math.floor(item.total_sold * 0.1); // Assume 10% waste

                return `${item.name},${
                  item.total_sold
                },${estimatedWaste},${basePrice},${cost.toFixed(2)}`;
              })
              .join("\n")
          : undefined;

      console.log("Sending message to API:", input);
      console.log("CSV data:", csvData);
      console.log("Inventory items:", inventoryItems);
      console.log("Business profile:", businessProfile);

      // Call the real AI API
      const response = await api.chatWithAI(input, csvData, businessProfile);

      console.log("API response received:", response);

      const aiResponse: Message = {
        role: "assistant",
        content: stripMarkdown(response.response), // Strip markdown formatting
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Provide more specific error messages
      let errorContent =
        "I'm having trouble connecting to my AI brain right now. Please try again in a moment.";

      if (error instanceof ApiError) {
        if (error.status === 401) {
          errorContent = "Please log in again to use the AI assistant.";
        } else if (error.status === 500) {
          errorContent =
            "The AI service is temporarily unavailable. Please try again later.";
        } else if (error.status === 404) {
          errorContent =
            "The AI service is not available. Please check if the backend server is running.";
        } else {
          errorContent = `AI service error: ${error.message}`;
        }
      }

      // Fallback to a helpful error message
      const errorMessage: Message = {
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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

            {/* Reports Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Inventory Reports & Spreadsheets</CardTitle>
                <CardDescription>
                  Download your inventory data as Excel spreadsheets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingReports ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#FF7F50]" />
                    <span className="ml-2">Loading reports...</span>
                  </div>
                ) : reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {report.report_type === 'test' ? 'Test Inventory Report' : 'Inventory Report'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Generated: {new Date(report.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Period: {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => downloadReport(report.id, report.filename || 'inventory_report.xlsx')}
                          className="bg-[#FF7F50] hover:bg-[#FF6B3D]"
                          size="sm"
                        >
                          Download Excel
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reports available yet.</p>
                    <p className="text-sm mt-2">
                      Generate reports by using the "Send Test Inventory Data" feature in the AI Analyzer.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Advisor */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-[#FF7F50]" />
                    AI Inventory Advisor
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newName = prompt(
                        "Business Name:",
                        businessProfile.name
                      );
                      const newLocation = prompt(
                        "Location:",
                        businessProfile.location
                      );
                      const newType = prompt(
                        "Business Type:",
                        businessProfile.type
                      );
                      const newHours = prompt(
                        "Operating Hours:",
                        businessProfile.hours
                      );
                      const newGoals = prompt(
                        "Main Goal:",
                        businessProfile.goals
                      );

                      if (
                        newName &&
                        newLocation &&
                        newType &&
                        newHours &&
                        newGoals
                      ) {
                        setBusinessProfile({
                          name: newName,
                          location: newLocation,
                          type: newType,
                          hours: newHours,
                          goals: newGoals,
                        });
                      }
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    ⚙️
                  </Button>
                </CardTitle>
                <CardDescription>
                  Get smart recommendations for your inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col relative">
                <ScrollArea
                  className="flex-1 pr-4"
                  onScroll={handleScroll}
                  ref={scrollAreaRef}
                  style={{ maxHeight: '400px' }}
                >
                  <div className="space-y-4 pb-4">
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
                          <div className="flex items-center space-x-2">
                            <div className="animate-pulse">Thinking</div>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Scroll to bottom button - only show when user has scrolled up */}
                {isUserScrolling && (
                  <Button
                    onClick={scrollToBottom}
                    size="sm"
                    className="absolute bottom-16 right-4 bg-[#FF7F50] hover:bg-[#FF6B3D] text-white rounded-full w-8 h-8 p-0 shadow-lg"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
                <div className="mt-4 flex space-x-2 sticky bottom-0 bg-white pt-2 border-t">
                  <Input
                    placeholder="Ask about inventory recommendations..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-[#FF7F50] hover:bg-[#FF6B3D] min-w-[44px]"
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
