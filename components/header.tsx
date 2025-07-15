"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Github, Star, TrendingUp, Brain, Zap, BarChart3, Snowflake } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Dashboard", href: "#dashboard", icon: BarChart3 },
    { name: "Predictions", href: "#predictions", icon: TrendingUp },
    { name: "AI Models", href: "#models", icon: Brain },
    { name: "Analytics", href: "#analytics", icon: Zap },
  ]

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass-crystal shadow-2xl border-b border-sky-200/50" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative mystical-glow">
              <div className="w-12 h-12 glass-frost rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-sky-400/50 transition-all duration-300 group-hover:scale-110 animate-frost-breath">
                <Snowflake className="h-7 w-7 text-sky-600 animate-spin" style={{ animationDuration: "8s" }} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-crystalline group-hover:animate-crystalline-shimmer transition-all duration-300">
                CrystalStock AI
              </h1>
              <p className="text-xs text-sky-600 group-hover:text-sky-500 transition-colors duration-300">
                Ethereal Market Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => handleNavClick(item.href)}
                  className="relative group px-4 py-2 rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300 animate-fade-in-down mystical-glow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.name}</span>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                </Button>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="group border-sky-300 hover:border-sky-400 hover:bg-sky-50/50 text-sky-700 hover:text-sky-900 transition-all duration-300 hover:scale-105 bg-transparent mystical-glow"
            >
              <Github className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
              GitHub
            </Button>
            <Button
              size="sm"
              className="crystalline-button shadow-2xl hover:shadow-sky-400/50 transition-all duration-300 hover:scale-105 group"
            >
              <Star className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
              Star Project
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-sky-100/30 text-sky-700 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5 animate-spin" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-down">
            <div className="glass-crystal rounded-2xl shadow-2xl border border-sky-200/50 p-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={() => handleNavClick(item.href)}
                    className="w-full justify-start rounded-xl hover:bg-sky-100/30 text-sky-700 hover:text-sky-900 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Button>
                )
              })}
              <div className="pt-3 border-t border-sky-200/50 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-sky-300 hover:border-sky-400 hover:bg-sky-50/50 text-sky-700 hover:text-sky-900 transition-all duration-300 bg-transparent"
                >
                  <Github className="h-4 w-4 mr-3" />
                  GitHub Repository
                </Button>
                <Button size="sm" className="w-full justify-start crystalline-button">
                  <Star className="h-4 w-4 mr-3" />
                  Star Project
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Floating particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
    </header>
  )
}
