"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Target, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut 
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Scores", href: "/dashboard/scores", icon: Target },
    { name: "Winnings", href: "/dashboard/winnings", icon: Trophy },
    { name: "Impact", href: "/dashboard/impact", icon: Heart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-neutral-gray",
                isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-neutral-charcoal/70"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium text-danger transition-all hover:bg-danger/10"
      >
        <LogOut className="h-5 w-5" />
        <span>Log Out</span>
      </button>
    </div>
  )
}
