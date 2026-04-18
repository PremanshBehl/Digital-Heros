"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createDraw(data: { drawType: 'random' | 'algorithmic', drawDate: string }) {
  const supabase = await createClient()
  
  // 1. Calculate the prize pool
  const { data: activeSubs } = await supabase
    .from("subscriptions")
    .select("amount")
    .eq("status", "active")

  const activeSubscriberCount = activeSubs?.length || 0
  const totalPool = activeSubs?.reduce((acc, curr) => acc + (Number(curr.amount) * 0.15), 0) || 0

  // 2. Generate winning number
  let winningNumber = ""
  if (data.drawType === 'random') {
    // Generate 5 random digits (each 0-9)
    winningNumber = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("")
  } else {
    // Algorithmic: Weighted by score frequency
    const { data: scores } = await supabase.from("scores").select("score")
    if (scores && scores.length > 0) {
      const freqMap: Record<number, number> = {}
      scores.forEach(s => freqMap[s.score] = (freqMap[s.score] || 0) + 1)
      const sortedScores = Object.entries(freqMap).sort((a, b) => b[1] - a[1])
      // Use most frequent scores to influence digits? 
      // Simplified: Just pick most frequent 5 scores and take last digits
      winningNumber = sortedScores.slice(0, 5).map(s => String(s[0]).slice(-1)).join("")
      if (winningNumber.length < 5) winningNumber = winningNumber.padEnd(5, "0")
    } else {
      winningNumber = "12345"
    }
  }

  // 3. Create the draw record
  const { data: draw, error: drawError } = await supabase
    .from("draws")
    .insert({
      draw_date: data.drawDate,
      draw_type: data.drawType,
      winning_number: winningNumber,
      pool_size: totalPool,
      active_subscriber_count: activeSubscriberCount,
      status: 'scheduled'
    })
    .select()
    .single()

  if (drawError) throw drawError

  revalidatePath("/admin/draws")
  return { success: true, drawId: draw.id }
}

export async function simulateDraw(drawId: string) {
  const supabase = await createClient()
  
  // 1. Get draw details
  const { data: draw } = await supabase.from("draws").select("*").eq("id", drawId).single()
  if (!draw) throw new Error("Draw not found")

  // 2. Get all active subscribers and their scores
  const { data: users } = await supabase
    .from("users")
    .select("id, scores(score)")
    
  // 3. Match logic
  const winningDigits = draw.winning_number.split("")
  const results = {
    match5: 0,
    match4: 0,
    match3: 0,
  }

  users?.forEach(user => {
    user.scores?.forEach((s: any) => {
      const scoreStr = String(s.score).split("")
      let matches = 0
      // Position-independent match logic (simplified)
      const tempWinning = [...winningDigits]
      scoreStr.forEach(digit => {
        const idx = tempWinning.indexOf(digit)
        if (idx > -1) {
          matches++
          tempWinning.splice(idx, 1)
        }
      })

      if (matches === 5) results.match5++
      else if (matches === 4) results.match4++
      else if (matches === 3) results.match3++
    })
  })

  return results
}

export async function publishDraw(drawId: string) {
  const supabase = await createClient()
  
  // 1. Perform final matching and insert winners
  // (In a real app, this would be a more complex batch process)
  
  // 2. Update draw status
  const { error } = await supabase
    .from("draws")
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq("id", drawId)

  if (error) throw error
  
  revalidatePath("/admin/draws")
  revalidatePath("/dashboard")
  return { success: true }
}
