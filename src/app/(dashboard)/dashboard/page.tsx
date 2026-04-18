import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Heart, Calendar, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch user profile and current scores
  const { data: profile } = await supabase
    .from("users")
    .select("*, charities(name)")
    .eq("id", user?.id)
    .single()

  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user?.id)
    .order("score_date", { ascending: false })
    .limit(5)

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  const { data: winnings } = await supabase
    .from("winners")
    .select("prize_amount")
    .eq("user_id", user?.id)

  const totalWon = winnings?.reduce((acc, curr) => acc + (curr.prize_amount || 0), 0) || 0

  return (
    <div className="space-y-8 animate-in">
      <header className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.first_name}</h1>
          <p className="text-neutral-charcoal/60">Here's what's happening with your golf impact.</p>
        </div>
        <Link href="/dashboard/scores">
          <Button>
            Enter Today's Score <Target className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Subscription Status */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-charcoal/60 uppercase">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{subscription?.status === 'active' ? 'Active' : 'Inactive'}</div>
                <p className="text-xs text-neutral-charcoal/60">
                  {subscription?.renewal_date ? `Renews on ${format(new Date(subscription.renewal_date), 'MMM dd, yyyy')}` : 'No active plan'}
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <Link href="/dashboard/settings" className="mt-4 inline-flex items-center text-xs font-medium text-primary hover:underline">
              Manage Subscription <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Winnings Summary */}
        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-charcoal/60 uppercase">Total Winnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${totalWon.toLocaleString()}</div>
                <p className="text-xs text-neutral-charcoal/60">All-time prizes awarded</p>
              </div>
              <div className="rounded-full bg-secondary/10 p-2 text-secondary">
                <Trophy className="h-6 w-6" />
              </div>
            </div>
            <Link href="/dashboard/winnings" className="mt-4 inline-flex items-center text-xs font-medium text-secondary hover:underline">
              View Winnings History <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Charity Impact */}
        <Card className="border-l-4 border-l-success lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-charcoal/60 uppercase">Charity Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{profile?.charities?.name || 'No charity selected'}</div>
                <p className="text-xs text-neutral-charcoal/60">{profile?.charity_contribution_percentage}% of subscription</p>
              </div>
              <div className="rounded-full bg-success/10 p-2 text-success">
                <Heart className="h-6 w-6" />
              </div>
            </div>
            <Link href="/dashboard/impact" className="mt-4 inline-flex items-center text-xs font-medium text-success hover:underline">
              Change Your Impact <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Scores */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Scores</CardTitle>
          </CardHeader>
          <CardContent>
            {scores && scores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-neutral-charcoal/60">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Points</th>
                      <th className="pb-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {scores.map((score) => (
                      <tr key={score.id} className="group">
                        <td className="py-4 font-medium">{format(new Date(score.score_date), 'MMM dd, yyyy')}</td>
                        <td className="py-4">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-gray font-bold text-primary">
                            {score.score}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link href={`/dashboard/scores/edit/${score.id}`} className="text-primary hover:underline">Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="mb-4 h-12 w-12 text-neutral-charcoal/20" />
                <p className="text-neutral-charcoal/60">No scores entered yet.</p>
                <Link href="/dashboard/scores" className="mt-4">
                  <Button variant="outline" size="sm">Enter Your First Score</Button>
                </Link>
              </div>
            )}
            {scores && scores.length >= 5 && (
              <p className="mt-4 text-xs text-neutral-charcoal/50 text-center italic">
                You've reached your 5-score limit. Adding a new score will remove the oldest.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Next Draw Card */}
        <Card className="bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Trophy className="h-48 w-48" />
          </div>
          <CardHeader>
            <CardTitle>Next Draw</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="mb-4">
              <div className="text-4xl font-extrabold">$5,000</div>
              <div className="text-sm opacity-80 uppercase tracking-wider font-bold">Estimated Jackpot</div>
            </div>
            
            <div className="space-y-4 border-t border-white/20 pt-4">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Draw Date</span>
                <span className="font-bold">June 1, 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Your Tickets</span>
                <span className="font-bold">{scores?.length || 0} / 5</span>
              </div>
            </div>
            
            <Button variant="secondary" className="mt-6 w-full shadow-lg">
              View Draw Details
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
