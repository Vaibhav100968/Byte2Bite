import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Utensils,
  Settings,
  AlertCircle,
} from "lucide-react";

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Business Dashboard
          </h1>
          <div className="flex gap-4">
            <Button className="bg-[#FF7F50] hover:bg-[#FF6B3D]" asChild>
              <Link href="/business/analytics">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-[#FF7F50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Orders
              </CardTitle>
              <Package className="h-4 w-4 text-[#FF7F50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                +4 new orders today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#FF7F50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,345</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#FF7F50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+15%</div>
              <p className="text-xs text-muted-foreground">vs. last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div
                    key={order}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Order #{order}</p>
                      <p className="text-sm text-gray-500">2 items • $24.99</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button
                  className="w-full bg-[#FF7F50] hover:bg-[#FF6B3D]"
                  asChild
                >
                  <Link href="/business/inventory">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Inventory
                  </Link>
                </Button>
                <Button
                  className="w-full bg-[#FF7F50] hover:bg-[#FF6B3D]"
                  asChild
                >
                  <Link href="/business/orders">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Orders
                  </Link>
                </Button>
                <Button
                  className="w-full bg-[#FF7F50] hover:bg-[#FF6B3D]"
                  asChild
                >
                  <Link href="/business/menu">
                    <Utensils className="mr-2 h-4 w-4" />
                    Update Menu
                  </Link>
                </Button>
                <Button
                  className="w-full bg-[#FF7F50] hover:bg-[#FF6B3D]"
                  asChild
                >
                  <Link href="/business/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button
                  className="w-full bg-[#FF7F50] hover:bg-[#FF6B3D]"
                  asChild
                >
                  <Link href="/business/report-issue">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Report Issue
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
