-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Charities Table
CREATE TABLE charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  logo_url VARCHAR,
  website_url VARCHAR,
  contact_email VARCHAR,
  registration_number VARCHAR,
  tax_id VARCHAR,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (Extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  selected_charity_id UUID REFERENCES charities(id),
  charity_contribution_percentage DECIMAL DEFAULT 10,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR UNIQUE,
  plan_type VARCHAR CHECK (plan_type IN ('monthly', 'yearly')),
  status VARCHAR CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'lapsed')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  renewal_date TIMESTAMP WITH TIME ZONE,
  amount DECIMAL,
  currency VARCHAR DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  canceled_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Golf Scores Table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 1 AND score <= 45),
  score_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

-- Draws Table
CREATE TABLE draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_date DATE UNIQUE NOT NULL,
  draw_type VARCHAR CHECK (draw_type IN ('random', 'algorithmic')),
  winning_number VARCHAR(5) NOT NULL,
  pool_size DECIMAL,
  active_subscriber_count INTEGER,
  status VARCHAR CHECK (status IN ('scheduled', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  simulation_mode BOOLEAN DEFAULT FALSE
);

-- Winners Table
CREATE TABLE winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_type INTEGER CHECK (match_type IN (3, 4, 5)),
  prize_amount DECIMAL,
  verification_status VARCHAR DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'rejected')),
  proof_image_url VARCHAR,
  proof_uploaded_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason VARCHAR,
  payment_status VARCHAR DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charity Events Table
CREATE TABLE charity_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charity_id UUID REFERENCES charities(id) ON DELETE CASCADE,
  event_name VARCHAR NOT NULL,
  event_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charity Images Table
CREATE TABLE charity_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charity_id UUID REFERENCES charities(id) ON DELETE CASCADE,
  image_url VARCHAR NOT NULL,
  alt_text VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charity Donations Tracking Table
CREATE TABLE charity_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  charity_id UUID REFERENCES charities(id) ON DELETE CASCADE,
  subscription_contribution DECIMAL DEFAULT 0,
  voluntary_donation DECIMAL DEFAULT 0,
  donation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Logs (Audit Trail)
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR,
  entity_type VARCHAR,
  entity_id VARCHAR,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_charities_updated_at BEFORE UPDATE ON charities FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RLS Policies

-- Charities: Public can read
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view charities" ON charities FOR SELECT USING (true);
CREATE POLICY "Admins can manage charities" ON charities FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
);

-- Users: Users can read/write their own record
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
);

-- Scores: Users can manage own scores
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own scores" ON scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all scores" ON scores FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
);

-- Subscriptions: Users can view own
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
);

-- Winners: Users can view own
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own winnings" ON winners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all winnings" ON winners FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
);

-- Draws: Public can view published
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published draws" ON draws FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage draws" ON draws FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
);
