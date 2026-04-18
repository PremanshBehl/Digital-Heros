"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addScore(formData: { score: number; date: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  // 1. Check if a score already exists for this date
  const { data: existing } = await supabase
    .from("scores")
    .select("id")
    .eq("user_id", user.id)
    .eq("score_date", formData.date)
    .single()

  if (existing) {
    return { error: "A score already exists for this date." }
  }

  // 2. Insert the new score
  const { error: insertError } = await supabase.from("scores").insert({
    user_id: user.id,
    score: formData.score,
    score_date: formData.date
  })

  if (insertError) throw insertError

  // 3. Handle rolling window: Get all scores for this user, sorted by date DESC
  const { data: allScores } = await supabase
    .from("scores")
    .select("id")
    .eq("user_id", user.id)
    .order("score_date", { ascending: false })

  // 4. If more than 5 scores, delete the oldest ones
  if (allScores && allScores.length > 5) {
    const idsToDelete = allScores.slice(5).map(s => s.id)
    const { error: deleteError } = await supabase
      .from("scores")
      .delete()
      .in("id", idsToDelete)
      
    if (deleteError) console.error("Error cleaning up old scores:", deleteError)
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/scores")
  return { success: true }
}

export async function deleteScore(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("scores").delete().eq("id", id)
  
  if (error) throw error
  
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/scores")
  return { success: true }
}
