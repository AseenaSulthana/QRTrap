"use client"

import type React from "react"
import { useState } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Shield, Palette } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isRedTheme, setIsRedTheme] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const toggleTheme = () => {
    setIsTransitioning(true)

    // Add transition class to body
    document.body.classList.add("theme-transition")

    setTimeout(() => {
      setIsRedTheme(!isRedTheme)
      document.documentElement.classList.toggle("red-theme", !isRedTheme)

      // Add pulse effect to key elements
      const elements = document.querySelectorAll('button, .card, [class*="bg-primary"]')
      elements.forEach((el) => {
        el.classList.add("pulse-on-theme-change")
        setTimeout(() => el.classList.remove("pulse-on-theme-change"), 600)
      })

      setTimeout(() => {
        document.body.classList.remove("theme-transition")
        setIsTransitioning(false)
      }, 300)
    }, 100)
  }

  return (
    <html lang="en" className={isRedTheme ? "red-theme" : ""}>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                <Shield className="h-6 w-6" />
                <span>QRTrap</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/scan" className="text-sm font-medium hover:text-primary transition-colors">
                  Scan QR
                </Link>
                <Link href="/report" className="text-sm font-medium hover:text-primary transition-colors">
                  Report QR
                </Link>
                <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                  About & Security
                </Link>
              </nav>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <button
                    onClick={toggleTheme}
                    disabled={isTransitioning}
                    className={`relative w-20 h-10 rounded-full transition-all duration-700 ease-in-out transform ${
                      isRedTheme
                        ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-lg shadow-red-200"
                        : "bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 shadow-lg shadow-emerald-200"
                    } ${isRedTheme ? "scale-105" : ""} ${isTransitioning ? "animate-pulse" : ""} 
                    hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-70`}
                    title={isRedTheme ? "Switch to Emerald Theme" : "Switch to Red Theme"}
                  >
                    <div
                      className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg transition-all duration-700 ease-in-out transform flex items-center justify-center ${
                        isRedTheme ? "translate-x-10 rotate-180" : "translate-x-1"
                      } hover:shadow-xl`}
                    >
                      <Palette
                        className={`h-4 w-4 transition-all duration-500 ${
                          isRedTheme ? "text-red-500 rotate-45" : "text-emerald-500"
                        }`}
                      />
                    </div>
                    <div
                      className={`absolute inset-0 flex items-center justify-between px-3 text-xs font-bold text-white transition-all duration-500 ${
                        isRedTheme ? "opacity-100" : "opacity-90"
                      }`}
                    >
                      <span
                        className={`transition-all duration-500 transform ${
                          isRedTheme ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"
                        }`}
                      >
                        🟢
                      </span>
                      <span
                        className={`transition-all duration-500 transform ${
                          isRedTheme ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                        }`}
                      >
                        🔴
                      </span>
                    </div>

                    {/* Animated ring effect */}
                    <div
                      className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                        isRedTheme ? "border-red-300 animate-ping" : "border-emerald-300"
                      } opacity-20`}
                    ></div>
                  </button>

                  {/* Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                    {isRedTheme ? "Switch to Emerald" : "Switch to Red"}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                </div>

                <Link
                  href="/scan"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  Scan Now
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500">
              <p>
                © {new Date().getFullYear()} QRTrap. All rights reserved. | Developed By Aseena Sulthana . From AS
                Software Productions
              </p>
              <p className="mt-2">Protecting users from phishing attacks, obfuscated URLs, and malicious redirects.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
