"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  username: string;
  user_type: "business" | "customer";
  phone_number?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  password2: string;
  user_type: "business" | "customer";
  phone_number?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token and user data on mount
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("token", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      // Redirect based on user type
      if (data.user.user_type === "business") {
        router.push("/business/dashboard");
      } else {
        router.push("/customer/restaurants");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Store token and user data
      localStorage.setItem("token", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      // Redirect based on user type
      if (data.user.user_type === "business") {
        router.push("/business/dashboard");
      } else {
        router.push("/customer/restaurants");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
