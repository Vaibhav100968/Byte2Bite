"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  user_type: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signUp: (
    name: string,
    email: string,
    phone: string,
    password: string,
    userType: "customer" | "business"
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored token and user data
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    userType: "customer" | "business"
  ) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone_number: phone,
          password,
          password2: password, // Required by backend for password confirmation
          user_type: userType,
          username: email, // Using email as username
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Registration failed");
      }

      // Store the token and user data
      localStorage.setItem("token", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      toast({
        title: "Success",
        description: "Account created successfully!",
      });

      // Redirect based on user type
      if (userType === "business") {
        router.push("/business/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Login failed");
      }

      if (!data.user || !data.access) {
        throw new Error("Invalid response format from server");
      }

      // Store the token and user data
      localStorage.setItem("token", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Redirect based on user type
      if (data.user.user_type === "business") {
        router.push("/business/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log in",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, login, logout }}>
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
