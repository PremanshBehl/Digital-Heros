"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Check, X, Eye, Loader2, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

export default function AdminWinnersPage() {
  const supabase = createClient()
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState<any>(null)

  useEffect(() => {
    fetchWinners()
  }, [])

  async function fetchWinners() {
    const { data } = await supabase
      .from("winners")
      .select("*, users(email, first_name, last_name), draws(draw_date)")
      .order("created_at", { ascending: false })
    if (data) setWinners(data)
  }

  const handleVerify = async (id: string, status: 'verified' | 'rejected', reason?: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("winners")
        .update({ 
          verification_status: status, 
          verified_at: status === 'verified' ? new Date().toISOString() : null,
          rejection_reason: reason || null
        })
        .eq("id", id)
      
      if (error) throw error
      toast.success(`Winner ${status}`)
      fetchWinners()
      setSelectedWinner(null)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (id: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("winners")
        .update({ 
          payment_status: 'paid', 
          payment_date: new Date().toISOString(),
          payment_method: 'Manual Transfer'
        })
        .eq("id", id)
      
      if (error) throw error
      toast.success("Marked as paid")
      fetchWinners()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in">
      <header>
        <h1 className="text-3xl font-bold">Winner Management</h1>
        <p className="text-neutral-charcoal/60">Review proofs, verify winners, and track payouts.</p>
      </header>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-gray/50 text-neutral-charcoal/60">
                  <th className="px-6 py-4 font-medium">Winner</th>
                  <th className="px-6 py-4 font-medium">Prize</th>
                  <th className="px-6 py-4 font-medium">Draw Date</th>
                  <th className="px-6 py-4 font-medium">Verification</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {winners.map((winner) => (
                  <tr key={winner.id} className="group hover:bg-neutral-gray/20">
                    <td className="px-6 py-4">
                      <div className="font-bold">{winner.users.first_name} {winner.users.last_name}</div>
                      <div className="text-xs text-neutral-charcoal/40">{winner.users.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary">${Number(winner.prize_amount).toLocaleString()}</div>
                      <div className="text-xs text-neutral-charcoal/40">{winner.match_type}-Match</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {format(new Date(winner.draws.draw_date), 'MMM yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        winner.verification_status === 'verified' ? 'bg-success/10 text-success' :
                        winner.verification_status === 'rejected' ? 'bg-danger/10 text-danger' :
                        'bg-neutral-gray text-neutral-charcoal/40'
                      }`}>
                        {winner.verification_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        winner.payment_status === 'paid' ? 'bg-primary text-white' : 'bg-neutral-gray text-neutral-charcoal/40'
                      }`}>
                        {winner.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {winner.verification_status === 'unverified' && winner.proof_image_url && (
                          <Button size="icon" variant="outline" onClick={() => setSelectedWinner(winner)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {winner.verification_status === 'verified' && winner.payment_status === 'pending' && (
                          <Button size="sm" onClick={() => handleMarkPaid(winner.id)}>
                            <DollarSign className="mr-1 h-3 w-3" /> Mark Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Verification Modal Placeholder */}
      {selectedWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl overflow-hidden animate-in">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center justify-between">
                <span>Verify Proof: {selectedWinner.users.first_name}</span>
                <button onClick={() => setSelectedWinner(null)}><X className="h-6 w-6" /></button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-video w-full rounded-lg bg-neutral-gray mb-6 flex items-center justify-center overflow-hidden border">
                {selectedWinner.proof_image_url ? (
                  <img src={selectedWinner.proof_image_url} alt="Proof" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-neutral-charcoal/40 italic text-sm">No proof image uploaded</span>
                )}
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  className="flex-1 bg-success hover:bg-success/90" 
                  onClick={() => handleVerify(selectedWinner.id, 'verified')}
                  disabled={loading}
                >
                  <Check className="mr-2 h-4 w-4" /> Approve Winner
                </Button>
                <Button 
                  className="flex-1" 
                  variant="danger"
                  onClick={() => {
                    const reason = prompt("Reason for rejection:")
                    if (reason) handleVerify(selectedWinner.id, 'rejected', reason)
                  }}
                  disabled={loading}
                >
                  <X className="mr-2 h-4 w-4" /> Reject Proof
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
