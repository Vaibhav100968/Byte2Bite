"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RestaurantCard } from "@/components/restaurant-card"
import { FilterOptions } from "@/components/filter-options"

// Sample restaurant data
const restaurantsData = [
  {
    id: "1",
    name: "Burger Palace",
    cuisine: "American, Burgers",
    rating: 4.8,
    reviews: 200,
    deliveryTime: "25-35 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "2",
    name: "Pizza Heaven",
    cuisine: "Italian, Pizza",
    rating: 4.5,
    reviews: 150,
    deliveryTime: "30-45 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "3",
    name: "Sushi Wave",
    cuisine: "Japanese, Sushi",
    rating: 4.7,
    reviews: 180,
    deliveryTime: "35-50 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "4",
    name: "Green Bowl",
    cuisine: "Healthy, Salads",
    rating: 4.6,
    reviews: 120,
    deliveryTime: "20-30 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "5",
    name: "Taco Fiesta",
    cuisine: "Mexican, Tacos",
    rating: 4.4,
    reviews: 160,
    deliveryTime: "25-40 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "6",
    name: "Noodle House",
    cuisine: "Chinese, Noodles",
    rating: 4.3,
    reviews: 140,
    deliveryTime: "30-45 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "7",
    name: "Curry Spice",
    cuisine: "Indian, Curry",
    rating: 4.6,
    reviews: 190,
    deliveryTime: "35-50 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "8",
    name: "Mediterranean Delight",
    cuisine: "Mediterranean, Kebabs",
    rating: 4.5,
    reviews: 130,
    deliveryTime: "30-45 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "9",
    name: "Sweet Treats",
    cuisine: "Desserts, Ice Cream",
    rating: 4.7,
    reviews: 110,
    deliveryTime: "20-30 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "10",
    name: "Breakfast Club",
    cuisine: "Breakfast, Brunch",
    rating: 4.4,
    reviews: 170,
    deliveryTime: "25-35 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "11",
    name: "Veggie Paradise",
    cuisine: "Vegetarian, Vegan",
    rating: 4.5,
    reviews: 140,
    deliveryTime: "25-40 min",
    image: "/placeholder.svg?height=180&width=300",
  },
  {
    id: "12",
    name: "BBQ Shack",
    cuisine: "BBQ, Ribs",
    rating: 4.8,
    reviews: 210,
    deliveryTime: "35-50 min",
    image: "/placeholder.svg?height=180&width=300",
  },
]

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")

  // Filter restaurants based on search query and active filter
  const filteredRestaurants = restaurantsData.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = activeFilter === "All" || restaurant.cuisine.includes(activeFilter)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Restaurants</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for restaurants or cuisines..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Options */}
      <div className="mb-8">
        <FilterOptions activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      </div>

      {/* Restaurant Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRestaurants.map((restaurant) => (
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
      ) : (
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-500">No restaurants found matching your search.</p>
          <Button
            variant="link"
            className="mt-2 text-orange-500"
            onClick={() => {
              setSearchQuery("")
              setActiveFilter("All")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}

