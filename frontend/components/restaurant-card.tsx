"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"

interface RestaurantCardProps {
  name: string
  cuisine: string
  rating: number
  reviews: number
  deliveryTime: string
}

export function RestaurantCard({ name, cuisine, rating, reviews, deliveryTime }: RestaurantCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/restaurant/${name.toLowerCase().replace(/\s+/g, "-")}`)
  }

  return (
    <Card
      className="overflow-hidden transition-transform duration-300 hover:cursor-pointer hover:translate-y-[-5px]"
      onClick={handleClick}
    >
      <div className="relative h-44 w-full">
        <Image src="/placeholder.svg?height=180&width=300" alt={name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 text-lg font-bold">{name}</h3>
        <p className="mb-3 text-sm text-gray-500">{cuisine}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            ⭐ {rating} ({reviews}+)
          </span>
          <span>{deliveryTime}</span>
        </div>
      </CardContent>
    </Card>
  )
}

