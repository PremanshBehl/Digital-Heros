"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Heart, ArrowRight, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [charities, setCharities] = useState<any[]>([])
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    charityId: "",
    contribution: 10,
  })

  useEffect(() => {
    async function fetchCharities() {
      const { data } = await supabase.from("charities").select("id, name")
      if (data) setCharities(data)
    }
    fetchCharities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.charityId) {
      toast.error("Please select a charity")
      return
    }
    
    setLoading(true)
    
    try {
      // 1. Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Create entry in our users table (via trigger or manual)
        // Note: Usually we have a trigger in Supabase, but I'll do a manual check/upsert here for safety
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          selected_charity_id: formData.charityId,
          charity_contribution_percentage: formData.contribution
        })

        if (profileError) throw profileError

        toast.success("Account created! Please check your email for verification.")
        router.push("/login")
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-gray/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Trophy className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-bold">Join Digital Heroes</CardTitle>
          <p className="text-sm text-neutral-charcoal/60">Start tracking and making an impact today.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input
                  required
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  required
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                required
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                required
                type="password"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Heart className="mr-2 h-4 w-4 text-danger" /> Choose Your Charity
              </label>
              <select
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.charityId}
                onChange={(e) => setFormData({...formData, charityId: e.target.value})}
              >
                <option value="">Select a charity...</option>
                {charities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                {charities.length === 0 && <option value="test">Test Charity (No DB data)</option>}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-neutral-charcoal">Contribution Percentage</label>
                <span className="text-sm font-bold text-primary">{formData.contribution}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                className="w-full accent-primary"
                value={formData.contribution}
                onChange={(e) => setFormData({...formData, contribution: parseInt(e.target.value)})}
              />
              <p className="text-[10px] text-neutral-charcoal/50">Minimum 10% contribution required.</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
