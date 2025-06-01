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
    </div>
  );
}
