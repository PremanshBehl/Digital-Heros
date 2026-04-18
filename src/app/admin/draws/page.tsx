"use client"

import { useState, useEffect } from "react"
import { Button, cn } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Play, Eye, CheckCircle2, Loader2, AlertTriangle } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { createDraw, simulateDraw, publishDraw } from "@/app/actions/draws"
import { format } from "date-fns"
import { toast } from "sonner"

export default function AdminDrawsPage() {
  const supabase = createClient()
  const [draws, setDraws] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [simResults, setSimResults] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    drawType: 'random' as 'random' | 'algorithmic',
    drawDate: format(new Date(), 'yyyy-MM-dd')
  })

  useEffect(() => {
    fetchDraws()
  }, [])

  async function fetchDraws() {
    const { data } = await supabase.from("draws").select("*").order("draw_date", { ascending: false })
    if (data) setDraws(data)
  }

  const handleCreateDraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createDraw(formData)
      toast.success("Draw created successfully")
      fetchDraws()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSimulate = async (id: string) => {
    setLoading(true)
    try {
      const results = await simulateDraw(id)
      setSimResults({ id, ...results })
      toast.success("Simulation complete")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (id: string) => {
    if (!confirm("Are you sure? This will notify all users and is irreversible.")) return
    setLoading(true)
    try {
      await publishDraw(id)
      toast.success("Results published!")
      fetchDraws()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Draw Management</h1>
          <p className="text-neutral-charcoal/60">Schedule, simulate, and publish monthly lottery results.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Create Draw Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Schedule New Draw</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDraw} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Draw Date</label>
                <input
                  required
                  type="date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.drawDate}
                  onChange={(e) => setFormData({...formData, drawDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Draw Method</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.drawType}
                  onChange={(e) => setFormData({...formData, drawType: e.target.value as any})}
                >
                  <option value="random">Random (Standard)</option>
                  <option value="algorithmic">Algorithmic (Score-Weighted)</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Draw"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Previous Draws Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Draws</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-neutral-charcoal/60">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Winning #</th>
                    <th className="pb-3 font-medium">Pool</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {draws.map((draw) => (
                    <tr key={draw.id} className="group">
                      <td className="py-4 font-bold">{format(new Date(draw.draw_date), 'MMM dd, yyyy')}</td>
                      <td className="py-4 font-mono text-primary">{draw.winning_number}</td>
                      <td className="py-4 font-medium">${Number(draw.pool_size).toLocaleString()}</td>
                      <td className="py-4">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                          draw.status === 'published' ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary"
                        )}>
                          {draw.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {draw.status === 'scheduled' && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleSimulate(draw.id)}>
                                <Play className="mr-1 h-3 w-3" /> Simulate
                              </Button>
                              <Button size="sm" onClick={() => handlePublish(draw.id)}>
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Publish
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulation Results Overlay/Card */}
      {simResults && (
        <Card className="border-2 border-primary bg-primary/5 animate-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-primary" /> Simulation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-card p-4 text-center">
                <div className="text-2xl font-bold text-primary">{simResults.match5}</div>
                <div className="text-xs text-neutral-charcoal/60 uppercase">Jackpot Winners (5)</div>
              </div>
              <div className="rounded-lg bg-card p-4 text-center">
                <div className="text-2xl font-bold text-secondary">{simResults.match4}</div>
                <div className="text-xs text-neutral-charcoal/60 uppercase">4-Number Match</div>
              </div>
              <div className="rounded-lg bg-card p-4 text-center">
                <div className="text-2xl font-bold text-success">{simResults.match3}</div>
                <div className="text-xs text-neutral-charcoal/60 uppercase">3-Number Match</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-charcoal/60 text-center">
              These results are based on currently active subscribers and their stored scores.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
