"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Trophy, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "./ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Charities", href: "/charities" },
    { name: "Draws", href: "/draws" },
    { name: "About", href: "/about" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">Digital Heroes</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-neutral-charcoal transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Subscribe Now</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-charcoal hover:bg-neutral-gray"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-neutral-charcoal hover:bg-neutral-gray"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-4 flex flex-col space-y-2 px-3">
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-center">Log in</Button>
            </Link>
            <Link href="/signup" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-center">Subscribe Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
