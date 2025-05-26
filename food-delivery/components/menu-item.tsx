"use client";

import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
}

export function MenuItem({ id, name, description, price }: MenuItemProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image: "/placeholder.svg?height=100&width=100",
    });
  };

  return (
    <div className="flex overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="relative h-24 w-24 flex-shrink-0">
        <Image
          src="/placeholder.svg?height=100&width=100"
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-medium">{name}</h3>
        <p className="mb-2 text-sm text-gray-500 line-clamp-2">{description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-semibold">{formatPrice(price)}</span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
