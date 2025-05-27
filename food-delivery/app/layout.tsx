import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";
import { CartSheet } from "@/components/cart-sheet";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Byte2Bite",
  description:
    "Connecting restaurants with customers while reducing food waste",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col h-full">
              <Header />
              <main className="flex-1">{children}</main>
              <SiteFooter />
              <CartSheet />
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import "./globals.css";
