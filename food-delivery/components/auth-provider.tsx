"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  phone?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signUp: (name: string, email: string, phone: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user from localStorage", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Sign up function
  const signUp = async (name: string, email: string, phone: string, password: string) => {
    // In a real app, this would be an API call to create a user
    // For demo purposes, we'll just store in localStorage

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    if (users.some((u: any) => u.email === email)) {
      throw new Error("Email already in use")
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
    }

    // Store user in "database"
    users.push({ ...newUser, password })
    localStorage.setItem("users", JSON.stringify(users))

    // Log user in
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))

    // Redirect to home page
    router.push("/")
  }

  // Login function
  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call to authenticate
    // For demo purposes, we'll check localStorage

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (!foundUser) {
      throw new Error("Invalid email or password")
    }

    // Remove password before storing in state
    const { password: _, ...userWithoutPassword } = foundUser

    // Set user in state and localStorage
    setUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    // Redirect to home page
    router.push("/")
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, isLoading, signUp, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

