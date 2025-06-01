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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";

export default function BusinessAnalytics() {
  const [timeRange, setTimeRange] = useState("week");

  // Mock data for analytics
  const metrics = {
    revenue: {
      current: 12500,
      previous: 11000,
      change: 13.6,
    },
    customers: {
      current: 450,
      previous: 380,
      change: 18.4,
    },
    orders: {
      current: 280,
      previous: 250,
      change: 12,
    },
    averageOrder: {
      current: 44.64,
      previous: 44,
      change: 1.5,
    },
  };

  const topItems = [
    { name: "Classic Burger", sales: 156, revenue: 2028 },
    { name: "Caesar Salad", sales: 98, revenue: 880.2 },
    { name: "Chocolate Cake", sales: 87, revenue: 608.13 },
    { name: "Margherita Pizza", sales: 76, revenue: 836 },
    { name: "Chicken Wings", sales: 65, revenue: 455 },
  ];

  const peakHours = [
    { hour: "12:00 PM", orders: 45 },
    { hour: "1:00 PM", orders: 38 },
    { hour: "6:00 PM", orders: 42 },
    { hour: "7:00 PM", orders: 35 },
    { hour: "8:00 PM", orders: 28 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">
              Track your business performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last 365 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#FF7F50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.revenue.current.toLocaleString()}
              </div>
              <div className="flex items-center text-sm">
                {metrics.revenue.change > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={
                    metrics.revenue.change > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {Math.abs(metrics.revenue.change)}%
                </span>
                <span className="text-gray-500 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-[#FF7F50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.customers.current}
              </div>
              <div className="flex items-center text-sm">
                {metrics.customers.change > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={
                    metrics.customers.change > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {Math.abs(metrics.customers.change)}%
                </span>
                <span className="text-gray-500 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-[#FF7F50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.orders.current}</div>
              <div className="flex items-center text-sm">
                {metrics.orders.change > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={
                    metrics.orders.change > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {Math.abs(metrics.orders.change)}%
                </span>
                <span className="text-gray-500 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#FF7F50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.averageOrder.current.toFixed(2)}
              </div>
              <div className="flex items-center text-sm">
                {metrics.averageOrder.change > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={
                    metrics.averageOrder.change > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {Math.abs(metrics.averageOrder.change)}%
                </span>
                <span className="text-gray-500 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="items">Top Items</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>
                    Daily revenue for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Revenue chart will be displayed here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Volume</CardTitle>
                  <CardDescription>
                    Daily order count for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Order volume chart will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Revenue distribution across menu categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center text-gray-500">
                  Sales by category chart will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                  <CardDescription>Busiest hours of operation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {peakHours.map((hour) => (
                      <div
                        key={hour.hour}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-[#FF7F50] mr-2" />
                          <span>{hour.hour}</span>
                        </div>
                        <span className="font-medium">
                          {hour.orders} orders
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Retention</CardTitle>
                  <CardDescription>Repeat customer rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Customer retention chart will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Best performing menu items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topItems.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.sales} units sold
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#FF7F50]">
                          ${item.revenue.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
