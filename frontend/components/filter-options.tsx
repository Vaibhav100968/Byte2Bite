"use client"

import { Button } from "@/components/ui/button"

interface FilterOptionsProps {
  activeFilter?: string
  setActiveFilter?: (filter: string) => void
}

export function FilterOptions({ activeFilter = "All", setActiveFilter = () => {} }: FilterOptionsProps) {
  const filters = [
    "All",
    "Fast Food",
    "Pizza",
    "Asian",
    "Healthy",
    "Desserts",
    "Mexican",
    "Indian",
    "Vegetarian",
    "BBQ",
  ]

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          className={`rounded-full ${
            activeFilter === filter
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "hover:bg-orange-100 hover:text-orange-500"
          }`}
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>
  )
}

