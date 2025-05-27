import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown } from "lucide-react";

// Mock data for orders
const orders = [
  {
    id: "ORD001",
    customer: "John Doe",
    items: 3,
    total: 45.99,
    status: "Pending",
    date: "2024-03-20 14:30",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    items: 2,
    total: 29.99,
    status: "Preparing",
    date: "2024-03-20 14:25",
  },
  {
    id: "ORD003",
    customer: "Mike Johnson",
    items: 4,
    total: 67.5,
    status: "Ready for Pickup",
    date: "2024-03-20 14:20",
  },
  {
    id: "ORD004",
    customer: "Sarah Wilson",
    items: 1,
    total: 15.99,
    status: "Completed",
    date: "2024-03-20 14:15",
  },
];

export default function BusinessOrders() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <div className="flex gap-4">
            <Button className="bg-[#FF7F50] hover:bg-[#FF6B3D]">
              Export Orders
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search orders..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready for Pickup</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Items
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">{order.id}</td>
                      <td className="py-4 px-4">{order.customer}</td>
                      <td className="py-4 px-4">{order.items} items</td>
                      <td className="py-4 px-4">${order.total.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Ready for Pickup"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Preparing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">{order.date}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white"
                          >
                            Update
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing 1 to 4 of 4 orders
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="outline" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
