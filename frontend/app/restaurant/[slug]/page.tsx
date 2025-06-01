import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MenuCategories } from "@/components/menu-categories"
import { MenuItem } from "@/components/menu-item"

interface RestaurantPageProps {
  params: {
    slug: string
  }
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  // In a real app, you would fetch restaurant data based on the slug
  const restaurant = {
    name: "Burger Palace",
    cuisine: "American, Burgers",
    rating: 4.8,
    reviews: 200,
    deliveryTime: "25-35 min",
    deliveryFee: "$3.99",
    description:
      "Burger Palace offers the juiciest burgers in town with premium ingredients and unique flavor combinations. Our chef-crafted menu features options for everyone, from classic cheeseburgers to innovative plant-based creations.",
  }

  // Sample menu items
  const menuItems = [
    {
      id: "1",
      name: "Classic Cheeseburger",
      description: "Beef patty with cheddar cheese, lettuce, tomato, pickles and special sauce.",
      price: 8.99,
      category: "Popular Items",
    },
    {
      id: "2",
      name: "Bacon Supreme",
      description: "Beef patty with crispy bacon, swiss cheese, caramelized onions and BBQ sauce.",
      price: 10.99,
      category: "Popular Items",
    },
    {
      id: "3",
      name: "Crispy Fries",
      description: "Golden crispy french fries seasoned with our signature spice blend.",
      price: 3.99,
      category: "Sides",
    },
    {
      id: "4",
      name: "Chocolate Shake",
      description: "Rich and creamy chocolate milkshake topped with whipped cream.",
      price: 4.99,
      category: "Drinks",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-orange-500">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to restaurants
      </Link>

      <div className="mb-8 flex flex-col gap-6 md:flex-row">
        <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-auto md:w-1/3">
          <Image src="/placeholder.svg?height=300&width=400" alt={restaurant.name} fill className="object-cover" />
        </div>

        <div className="md:w-2/3">
          <h1 className="mb-2 text-3xl font-bold">{restaurant.name}</h1>
          <div className="mb-4 text-sm text-gray-600">
            <span>
              ⭐ {restaurant.rating} ({restaurant.reviews}+ ratings)
            </span>{" "}
            •<span> {restaurant.cuisine}</span> •<span> {restaurant.deliveryTime} delivery</span> •
            <span> {restaurant.deliveryFee} delivery fee</span>
          </div>
          <p className="text-gray-700">{restaurant.description}</p>
        </div>
      </div>

      <MenuCategories />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {menuItems.map((item) => (
          <MenuItem key={item.id} id={item.id} name={item.name} description={item.description} price={item.price} />
        ))}
      </div>
    </div>
  )
}

