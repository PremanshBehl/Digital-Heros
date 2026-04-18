import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: "2023-10-16" as any, // Use latest stable
  typescript: true,
})

export const PLANS = {
  MONTHLY: {
    id: "monthly",
    name: "Monthly Plan",
    price: 9.99,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID,
  },
  YEARLY: {
    id: "yearly",
    name: "Yearly Plan",
    price: 99.00,
    priceId: process.env.STRIPE_YEARLY_PRICE_ID,
  },
}
