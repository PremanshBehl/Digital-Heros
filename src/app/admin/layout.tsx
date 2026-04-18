import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
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

  // Check if user is an admin
  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto flex flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <AdminSidebar />
        </aside>
        <main className="flex-grow lg:ml-8">
          {children}
        </main>
      </div>
    </div>
  )
}
