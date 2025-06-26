"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cuisineTypes = [
  "American",
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "Thai",
  "Mediterranean",
  "Fast Food",
  "Healthy",
  "Vegetarian",
  "Vegan",
  "Seafood",
  "Steakhouse",
  "Cafe",
  "Bakery",
  "Dessert",
];

const reportingFrequencies = [
  { value: "daily", label: "Every 1 day" },
  { value: "3days", label: "Every 3 days" },
  { value: "weekly", label: "Once a week" },
  { value: "monthly", label: "Once a month" },
  { value: "custom", label: "Custom" },
];

export default function BusinessSignup() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    address: "",
    cuisine: "",
    reporting_frequency: "weekly",
    custom_reporting_days: 7,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCuisineChange = (value: string) => {
    setFormData((prev) => ({ ...prev, cuisine: value }));
  };

  const handleReportingFrequencyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, reporting_frequency: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.restaurantName ||
      !formData.address ||
      !formData.cuisine
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await signUp(
        formData.name,
        formData.email,
        formData.phone,
        formData.password,
        "business",
        formData.reporting_frequency,
        formData.custom_reporting_days
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-16">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Business Account</CardTitle>
          <CardDescription>
            Sign up to start managing your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  type="text"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your restaurant name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Restaurant Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your restaurant address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cuisine">Type of Food</Label>
                <Select
                  onValueChange={handleCuisineChange}
                  value={formData.cuisine}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineTypes.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reporting_frequency">
                  Inventory Report Frequency
                </Label>
                <Select
                  onValueChange={handleReportingFrequencyChange}
                  value={formData.reporting_frequency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reporting frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportingFrequencies.map((frequency) => (
                      <SelectItem key={frequency.value} value={frequency.value}>
                        {frequency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.reporting_frequency === "custom" && (
                <div className="grid gap-2">
                  <Label htmlFor="custom_reporting_days">Custom Days</Label>
                  <Input
                    id="custom_reporting_days"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.custom_reporting_days}
                    onChange={handleChange}
                    placeholder="Enter number of days"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/business/login"
              className="text-orange-500 hover:underline"
            >
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
