import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is a subscriber (Optional for layout, but good for access control)
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .single()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto flex flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-64 flex-shrink-0 md:block">
          <Sidebar />
        </aside>
        <main className="flex-grow md:ml-8">
          {children}
        </main>
      </div>
    </div>
  )
}
