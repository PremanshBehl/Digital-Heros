# Digital Heroes Golf Platform

A subscription-driven golf performance tracking platform that combines score management, monthly lottery-style prize draws, and charitable giving.

## 🚀 Features

- **Premium UI/UX**: Built with Next.js 15, Tailwind CSS v4, and Framer Motion for a modern, emotionally engaging experience.
- **Score Management**: Stableford scoring with a unique rolling window of exactly 5 recent rounds.
- **Monthly Draws**: Automated lottery system where every score entry is a ticket. Includes jackpot rollovers.
- **Charity Integration**: Mandatory charity selection at signup. User-definable contribution percentage (min 10%).
- **Full-Stack Security**: Supabase Auth with Row-Level Security (RLS) policies.
- **Subscription Engine**: Integrated with Stripe for monthly and yearly recurring payments.
- **Admin Command Center**: Complete dashboard for managing users, draws, charities, and winner verification.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe
- **Animations**: Framer Motion
- **Charts**: Recharts

## ⚙️ Setup Instructions

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file with the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   STRIPE_MONTHLY_PRICE_ID=price_...
   STRIPE_YEARLY_PRICE_ID=price_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Database Setup**
   - Execute the SQL in `supabase/migrations/` in your Supabase SQL Editor.
   - Run `supabase/seed.sql` to populate initial charities.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🧪 Test Credentials

**Subscriber Test Account**
- Email: `subscriber@test.com`
- Password: `TestPass123!`

**Admin Test Account**
- Email: `admin@test.com`
- Password: `AdminPass123!`

**Stripe Test Card**
- Number: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`

## 📋 Business Logic

- **Rolling Window**: When a 6th score is entered, the oldest score is automatically deleted, maintaining a pool of exactly 5 tickets for the draw.
- **Prize Pool**: 15% of all subscription revenue is allocated to the monthly prize pool.
- **Charity Contribution**: Calculated as `subscription_fee * (user_percentage / 100)`.
- **Match Logic**: Prizes are awarded for matching 3, 4, or 5 digits from the 5-digit winning number.
