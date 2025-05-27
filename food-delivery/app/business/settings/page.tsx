"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Building2, Bell, Clock, Globe, Shield, Save } from "lucide-react";

export default function BusinessSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Business Profile
    businessName: "Byte2Bite Restaurant",
    email: "contact@byte2bite.com",
    phone: "+1 (555) 123-4567",
    address: "123 Food Street, Cuisine City",
    description: "A modern restaurant serving delicious meals",
    cuisine: "international",
    timezone: "America/New_York",

    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,
    marketingUpdates: false,

    // Operating Hours
    monday: { open: "09:00", close: "22:00" },
    tuesday: { open: "09:00", close: "22:00" },
    wednesday: { open: "09:00", close: "22:00" },
    thursday: { open: "09:00", close: "22:00" },
    friday: { open: "09:00", close: "23:00" },
    saturday: { open: "10:00", close: "23:00" },
    sunday: { open: "10:00", close: "22:00" },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (
    day: string,
    type: "open" | "close",
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [type]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Here you would typically save the settings to your database
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Business Settings
          </h1>
          <Button
            type="submit"
            form="settings-form"
            className="bg-[#FF7F50] hover:bg-[#FF6B3D]"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center">
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </div>
            )}
          </Button>
        </div>

        <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Business Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-[#FF7F50]" />
                Business Profile
              </CardTitle>
              <CardDescription>
                Update your business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={settings.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={settings.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Select
                    value={settings.cuisine}
                    onValueChange={(value) =>
                      handleSelectChange("cuisine", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="international">
                        International
                      </SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) =>
                      handleSelectChange("timezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-[#FF7F50]" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={handleSwitchChange("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Order Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Get notified for new orders
                  </p>
                </div>
                <Switch
                  checked={settings.orderNotifications}
                  onCheckedChange={handleSwitchChange("orderNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Inventory Alerts</Label>
                  <p className="text-sm text-gray-500">
                    Get notified for low stock
                  </p>
                </div>
                <Switch
                  checked={settings.inventoryAlerts}
                  onCheckedChange={handleSwitchChange("inventoryAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Updates</Label>
                  <p className="text-sm text-gray-500">
                    Receive marketing communications
                  </p>
                </div>
                <Switch
                  checked={settings.marketingUpdates}
                  onCheckedChange={handleSwitchChange("marketingUpdates")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#FF7F50]" />
                Operating Hours
              </CardTitle>
              <CardDescription>Set your business hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(settings)
                  .filter(([key]) =>
                    [
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].includes(key)
                  )
                  .map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between"
                    >
                      <Label className="capitalize w-32">{day}</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) =>
                            handleTimeChange(day, "open", e.target.value)
                          }
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) =>
                            handleTimeChange(day, "close", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
