import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

// Use service role key to bypass RLS for webhook updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as any

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = await stripe.subscriptions.retrieve(session.subscription || session.id)
      
      const { error: upsertError } = await supabaseAdmin.from("subscriptions").upsert({
        user_id: session.metadata?.userId || (await getUserByStripeId(subscription.customer as string)),
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        plan_type: session.metadata?.planType || 'monthly',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        renewal_date: new Date(subscription.current_period_end * 1000).toISOString(),
        amount: subscription.items.data[0].plan.amount! / 100,
        currency: subscription.currency,
      }, { onConflict: 'user_id' })

      if (upsertError) console.error("Webhook Upsert Error:", upsertError)
      break

    case "customer.subscription.deleted":
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled", canceled_at: new Date().toISOString() })
        .eq("stripe_subscription_id", session.id)
      break
  }

  return new NextResponse(null, { status: 200 })
}

async function getUserByStripeId(stripeId: string) {
  const { data } = await supabaseAdmin.from("subscriptions").select("user_id").eq("stripe_subscription_id", stripeId).single()
  return data?.user_id
}
