import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Trophy, Heart } from "lucide-react"

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // Fetch basic stats
  const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })
  const { data: activeSubs } = await supabase.from("subscriptions").select("*").eq("status", "active")
  const { data: donations } = await supabase.from("charity_donations").select("subscription_contribution, voluntary_donation")
  const { data: winners } = await supabase.from("winners").select("prize_amount")

  const activeSubCount = activeSubs?.length || 0
  const mrr = activeSubs?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0
  const totalDonated = donations?.reduce((acc, curr) => acc + Number(curr.subscription_contribution) + Number(curr.voluntary_donation), 0) || 0
  const totalPrizePool = winners?.reduce((acc, curr) => acc + Number(curr.prize_amount), 0) || 0

  const stats = [
    { name: "Active Subscribers", value: activeSubCount, icon: Users, color: "text-primary" },
    { name: "Estimated MRR", value: `$${mrr.toLocaleString()}`, icon: DollarSign, color: "text-secondary" },
    { name: "Total Prize Pool", value: `$${totalPrizePool.toLocaleString()}`, icon: Trophy, color: "text-success" },
    { name: "Total Donations", value: `$${totalDonated.toLocaleString()}`, icon: Heart, color: "text-danger" },
  ]

  return (
    <div className="space-y-8 animate-in">
      <header>
        <h1 className="text-3xl font-bold text-neutral-charcoal">System Overview</h1>
        <p className="text-neutral-charcoal/60">Real-time platform performance and charity impact metrics.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="premium-shadow overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-charcoal/60">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-3 bg-neutral-gray ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="premium-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for real activity logs */}
              {[
                { user: "John Doe", action: "signed up", time: "2 mins ago" },
                { user: "Jane Smith", action: "entered score: 42", time: "15 mins ago" },
                { user: "Charity Foundation", action: "featured status updated", time: "1 hour ago" },
                { user: "System", action: "subscription renewed for 45 users", time: "3 hours ago" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-gray" />
                    <div>
                      <p className="text-sm font-medium">{log.user}</p>
                      <p className="text-xs text-neutral-charcoal/60">{log.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-charcoal/40">{log.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="premium-shadow">
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for pending winners */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trophy className="mb-4 h-12 w-12 text-neutral-charcoal/10" />
              <p className="text-neutral-charcoal/60">No pending winner verifications.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
