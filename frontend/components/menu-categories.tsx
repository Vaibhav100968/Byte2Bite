"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function MenuCategories() {
  const [activeCategory, setActiveCategory] = useState("Popular Items")

  const categories = ["Popular Items", "Burgers", "Sides", "Drinks", "Desserts"]

  return (
    <div className="border-b overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className={`whitespace-nowrap ${
              activeCategory === category ? "border-b-2 border-orange-500 text-orange-500" : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}

