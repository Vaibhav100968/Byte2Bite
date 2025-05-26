"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export function SiteHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-2 px-4 py-4 sm:h-16 sm:flex-row sm:space-y-0 sm:py-0">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-orange-500">Byte</span>
          <span className="text-teal-500">2</span>
          <span className="text-orange-500">Bite</span>
        </Link>

        <nav className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-orange-500">
            Home
          </Link>
          <Link href="/restaurants" className="transition-colors hover:text-orange-500">
            Restaurants
          </Link>
          <Link href="/about" className="transition-colors hover:text-orange-500">
            About Us
          </Link>
          <Link href="/contact" className="transition-colors hover:text-orange-500">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name.split(" ")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/orders" className="w-full">
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/payment" className="w-full">
                    Payment Methods
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="link" className="text-orange-500 hover:text-orange-600" asChild>
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

