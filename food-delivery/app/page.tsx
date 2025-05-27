import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RestaurantCard } from "@/components/restaurant-card";
import { FilterOptions } from "@/components/filter-options";

export default function Home() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block">
            <span className="text-black">Byte</span>
            <span className="text-[#FF7F50]">2</span>
            <span className="text-black">Bite</span>
          </span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Connecting restaurants with customers while reducing food waste
        </p>

        <div className="mt-10 flex justify-center gap-8">
          <Link
            href="/business/login"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF7F50] hover:bg-[#FF6B3D] md:py-4 md:text-lg md:px-10"
          >
            Login for Businesses
          </Link>
          <Link
            href="/customer/login"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF7F50] hover:bg-[#FF6B3D] md:py-4 md:text-lg md:px-10"
          >
            Login for Customers
          </Link>
        </div>
      </div>

      {/* Hero Section - Commented out
      <section className="relative bg-zinc-900 py-20 text-center text-white">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage:
              "url('/placeholder.svg?height=400&width=1200')",
          }}
        />
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Your favorite food, delivered fast
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg">
            Order from the best local restaurants with easy, on-demand
            delivery.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              placeholder="Enter your delivery address"
              className="h-12 bg-white text-black"
            />
            <Button className="h-12 bg-[#FF7F50] px-6 hover:bg-[#FF6B3D]">
              Find Food
            </Button>
          </div>
        </div>
      </section>
      */}

      {/* Restaurant List Section - Commented out
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Popular Restaurants
          </h2>

          <FilterOptions />

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <RestaurantCard
              name="Burger Palace"
              cuisine="American, Burgers"
              rating={4.4}
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
      */}
    </div>
  );
}
