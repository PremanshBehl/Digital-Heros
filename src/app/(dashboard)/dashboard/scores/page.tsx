"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Calendar, Loader2, AlertCircle } from "lucide-react"
import { addScore } from "@/app/actions/scores"
import { toast } from "sonner"
import { format } from "date-fns"

export default function ScoresPage() {
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState<number>(30)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await addScore({ score, date })
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Score added successfully!")
        // Reset or redirect? I'll keep them here for now
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold">Manage Scores</h1>
        <p className="text-neutral-charcoal/60">Enter your Stableford points for a specific date.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" /> Enter Today's Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Round Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-charcoal/40" />
                  <input
                    required
                    type="date"
                    max={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Stableford Points</label>
                  <span className="text-sm font-bold text-primary">{score}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="45"
                  className="w-full h-10 accent-primary"
                  value={score}
                  onChange={(e) => setScore(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
              <div className="flex space-x-3">
                <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-neutral-charcoal/70">
                  <span className="font-bold text-primary">Rolling Window Notice:</span> You only keep your 5 most recent scores. Adding this score will update your lottery entries for the next draw.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Score"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
