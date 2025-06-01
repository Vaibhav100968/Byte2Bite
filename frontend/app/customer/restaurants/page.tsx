import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, MapPin, Clock } from "lucide-react";
import { RestaurantCard } from "@/components/restaurant-card";

// Mock data for restaurants
const restaurants = [
  {
    id: 1,
    name: "Burger Palace",
    cuisine: "American, Burgers",
    rating: 4.4,
    reviews: 200,
    deliveryTime: "25-35 min",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Pizza Heaven",
    cuisine: "Italian, Pizza",
    rating: 4.5,
    reviews: 150,
    deliveryTime: "30-45 min",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Sushi Wave",
    cuisine: "Japanese, Sushi",
    rating: 4.7,
    reviews: 180,
    deliveryTime: "35-50 min",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Green Bowl",
    cuisine: "Healthy, Salads",
    rating: 4.6,
    reviews: 120,
    deliveryTime: "20-30 min",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export default function CustomerRestaurants() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <div className="flex gap-4">
            <Button className="bg-[#FF7F50] hover:bg-[#FF6B3D]">
              <MapPin className="mr-2 h-4 w-4" />
              Set Location
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search restaurants..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="delivery">Delivery Time</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              name={restaurant.name}
              cuisine={restaurant.cuisine}
              rating={restaurant.rating}
              reviews={restaurant.reviews}
              deliveryTime={restaurant.deliveryTime}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-500">
            Showing 1 to 4 of 4 restaurants
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
      </div>
    </div>
  );
}
