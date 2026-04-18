"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/components/ui/button"
import { 
  BarChart3, 
  Users, 
  Ticket, 
  Heart, 
  Trophy, 
  FileText,
  Settings
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Draws", href: "/admin/draws", icon: Ticket },
    { name: "Charities", href: "/admin/charities", icon: Heart },
    { name: "Winners", href: "/admin/winners", icon: Trophy },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex h-full flex-col space-y-2">
      <div className="mb-4 px-4 py-2">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">Admin Panel</span>
      </div>
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-neutral-gray",
              isActive ? "bg-secondary text-secondary-foreground shadow-sm" : "text-neutral-charcoal/70"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{link.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
