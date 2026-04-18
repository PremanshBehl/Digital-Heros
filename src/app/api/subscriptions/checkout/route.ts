import { createClient } from "@/utils/supabase/server"
import { stripe, PLANS } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { planId } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const priceId = planId === "yearly" ? PLANS.YEARLY.priceId : PLANS.MONTHLY.priceId

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planType: planId,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Stripe Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
