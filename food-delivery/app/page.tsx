import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RestaurantCard } from "@/components/restaurant-card"
import { FilterOptions } from "@/components/filter-options"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main>
        {/* Hero Section */}
        <section className="relative bg-zinc-900 py-20 text-center text-white">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: "url('/placeholder.svg?height=400&width=1200')" }}
          />
          <div className="container relative z-10 mx-auto px-4">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Your favorite food, delivered fast</h1>
            <p className="mx-auto mb-8 max-w-xl text-lg">
              Order from the best local restaurants with easy, on-demand delivery.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
              <Input type="text" placeholder="Enter your delivery address" className="h-12 bg-white text-black" />
              <Button className="h-12 bg-orange-500 px-6 hover:bg-orange-600">Find Food</Button>
            </div>
          </div>
        </section>

        {/* Restaurant List Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">Popular Restaurants</h2>

            <FilterOptions />

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <RestaurantCard
                name="Burger Palace"
                cuisine="American, Burgers"
                rating={4.8}
                reviews={200}
                deliveryTime="25-35 min"
              />
              <RestaurantCard
                name="Pizza Heaven"
                cuisine="Italian, Pizza"
                rating={4.5}
                reviews={150}
                deliveryTime="30-45 min"
              />
              <RestaurantCard
                name="Sushi Wave"
                cuisine="Japanese, Sushi"
                rating={4.7}
                reviews={180}
                deliveryTime="35-50 min"
              />
              <RestaurantCard
                name="Green Bowl"
                cuisine="Healthy, Salads"
                rating={4.6}
                reviews={120}
                deliveryTime="20-30 min"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

