"use client"

import { Button } from "@/components/ui/button"
import { Snowflake, Github, Twitter, Linkedin, Mail, Heart, Code, Zap, TrendingUp } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API", href: "#api" },
      { name: "Documentation", href: "#docs" },
    ],
    company: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" },
    ],
    resources: [
      { name: "Help Center", href: "#help" },
      { name: "Community", href: "#community" },
      { name: "Tutorials", href: "#tutorials" },
      { name: "Status", href: "#status" },
    ],
  }

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#github" },
    { name: "Twitter", icon: Twitter, href: "#twitter" },
    { name: "LinkedIn", icon: Linkedin, href: "#linkedin" },
    { name: "Email", icon: Mail, href: "#email" },
  ]

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900 text-white relative overflow-hidden">
      {/* Ethereal background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute inset-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="relative mystical-glow">
                <div className="w-12 h-12 glass-frost rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-sky-400/50 transition-all duration-300 group-hover:scale-110 animate-frost-breath">
                  <Snowflake className="h-7 w-7 text-sky-400 animate-spin" style={{ animationDuration: "8s" }} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-crystalline">CrystalStock AI</h3>
                <p className="text-sky-200 text-sm">Ethereal Market Intelligence</p>
              </div>
            </div>

            <p className="text-sky-100 leading-relaxed max-w-md">
              Experience the serenity of advanced stock market analysis. Our ethereal AI platform brings tranquil
              precision to investment decisions through crystalline neural network predictions.
            </p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 glass-ethereal rounded-full border border-sky-400/30 floating-element">
                <TrendingUp className="h-4 w-4 text-sky-300 animate-bounce" />
                <span className="text-sm font-medium">Ethereal Analytics</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 glass-ethereal rounded-full border border-sky-400/30 floating-element">
                <Zap className="h-4 w-4 text-blue-300 animate-pulse" />
                <span className="text-sm font-medium">Crystal AI</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-lg font-semibold text-white capitalize">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sky-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-sky-700/50">
          <div className="max-w-md mx-auto text-center space-y-4">
            <h4 className="text-xl font-semibold text-white">Stay Ethereal</h4>
            <p className="text-sky-200">Receive crystalline AI insights and serene market intelligence</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 glass-ethereal border border-sky-400/30 rounded-lg text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-200"
              />
              <Button className="crystalline-button">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-sky-700/50 glass-ethereal relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sky-200">
              <span>© {currentYear} CrystalStock AI. Crafted with</span>
              <Heart className="h-4 w-4 text-red-400 animate-pulse" />
              <span>and</span>
              <Code className="h-4 w-4 text-sky-400 animate-bounce" />
              <span>for ethereal experiences</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className="text-sky-200 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 animate-fade-in mystical-glow"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{social.name}</span>
                  </Button>
                )
              })}
            </div>

            {/* Additional Info */}
            <div className="flex items-center space-x-4 text-sm text-sky-300">
              <a href="#privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
