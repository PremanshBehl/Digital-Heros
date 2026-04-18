import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Upload, CheckCircle2, Clock, XCircle } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default async function WinningsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: winnings } = await supabase
    .from("winners")
    .select("*, draws(draw_date, winning_number)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold">Winnings & Rewards</h1>
        <p className="text-neutral-charcoal/60">View your prizes and submit verification for pending wins.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {winnings && winnings.length > 0 ? (
          winnings.map((win) => (
            <Card key={win.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={cn(
                  "flex flex-col items-center justify-center p-8 md:w-48",
                  win.payment_status === 'paid' ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary"
                )}>
                  <Trophy className="h-10 w-10 mb-2" />
                  <div className="text-2xl font-bold">${Number(win.prize_amount).toLocaleString()}</div>
                  <div className="text-xs font-bold uppercase tracking-wider">{win.match_type}-Number Match</div>
                </div>
                
                <div className="flex-grow p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">Draw Result: {format(new Date(win.draws.draw_date), 'MMMM yyyy')}</h3>
                      <p className="text-sm text-neutral-charcoal/60">Winning Number: <span className="font-mono font-bold">{win.draws.winning_number}</span></p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {win.verification_status === 'verified' ? (
                        <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                        </span>
                      ) : win.verification_status === 'unverified' ? (
                        <span className="inline-flex items-center rounded-full bg-neutral-gray px-3 py-1 text-xs font-bold text-neutral-charcoal/60">
                          <Clock className="mr-1 h-3 w-3" /> Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
                          <XCircle className="mr-1 h-3 w-3" /> Rejected
                        </span>
                      )}
                      
                      <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
                        win.payment_status === 'paid' ? "bg-success text-white" : "bg-neutral-charcoal text-white"
                      )}>
                        {win.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-neutral-charcoal/60">
                      {win.payment_date ? `Paid on ${format(new Date(win.payment_date), 'MMM dd, yyyy')}` : 'Payment processed within 3-5 business days after verification.'}
                    </div>
                    
                    {win.verification_status !== 'verified' && (
                      <Link href={`/dashboard/winnings/verify/${win.id}`}>
                        <Button size="sm" variant={win.verification_status === 'rejected' ? 'danger' : 'primary'}>
                          <Upload className="mr-2 h-4 w-4" /> 
                          {win.verification_status === 'rejected' ? 'Re-upload Proof' : 'Upload Proof'}
                        </Button>
                      </Link>
                    )}
                  </div>
                  
                  {win.rejection_reason && (
                    <div className="mt-4 rounded-lg bg-danger/5 p-3 text-xs text-danger border border-danger/10">
                      <span className="font-bold">Rejection Reason:</span> {win.rejection_reason}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 h-20 w-20 rounded-full bg-neutral-gray flex items-center justify-center text-neutral-charcoal/20">
              <Trophy className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold">No winnings yet</h3>
            <p className="text-neutral-charcoal/60 max-w-sm">
              Keep entering your scores! Every round is a chance to win and support local charities.
            </p>
            <Link href="/dashboard/scores" className="mt-8">
              <Button>Enter Your Scores</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
