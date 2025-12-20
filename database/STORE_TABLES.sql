-- =====================================================
-- Store App Database Schema
-- =====================================================
-- Ideas, Products, Claims, and Does Work For Me tracking
-- =====================================================

-- 1. IDEAS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  expected_days INTEGER NOT NULL CHECK (expected_days IN (7, 14, 21)),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  creator_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);

-- 2. CLAIMS TABLE (tracks who claimed which idea)
-- =====================================================
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  UNIQUE(idea_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_claims_idea_id ON claims(idea_id);
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);

-- 3. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  creator_email TEXT,
  actual_days INTEGER,
  product_url TEXT,
  app_path TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_idea_id ON products(idea_id);

-- 4. DOES_WORK_FOR_ME TABLE (tracks user feedback)
-- =====================================================
CREATE TABLE IF NOT EXISTS does_work_for_me (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_dwfm_product_id ON does_work_for_me(product_id);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE does_work_for_me ENABLE ROW LEVEL SECURITY;

-- IDEAS POLICIES
-- Anyone can view ideas
CREATE POLICY "Anyone can view ideas" ON ideas
  FOR SELECT USING (true);

-- Authenticated users can create ideas
CREATE POLICY "Authenticated users can create ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own ideas
CREATE POLICY "Users can update their own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = creator_id);

-- Users can delete their own ideas
CREATE POLICY "Users can delete their own ideas" ON ideas
  FOR DELETE USING (auth.uid() = creator_id);

-- CLAIMS POLICIES
-- Anyone can view claims
CREATE POLICY "Anyone can view claims" ON claims
  FOR SELECT USING (true);

-- Authenticated users can create claims
CREATE POLICY "Authenticated users can create claims" ON claims
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own claims
CREATE POLICY "Users can update their own claims" ON claims
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own claims
CREATE POLICY "Users can delete their own claims" ON claims
  FOR DELETE USING (auth.uid() = user_id);

-- PRODUCTS POLICIES
-- Anyone can view products
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Authenticated users can create products
CREATE POLICY "Authenticated users can create products" ON products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own products
CREATE POLICY "Users can update their own products" ON products
  FOR UPDATE USING (auth.uid() = creator_id);

-- Users can delete their own products
CREATE POLICY "Users can delete their own products" ON products
  FOR DELETE USING (auth.uid() = creator_id);

-- DOES_WORK_FOR_ME POLICIES
-- Anyone can view feedback
CREATE POLICY "Anyone can view dwfm" ON does_work_for_me
  FOR SELECT USING (true);

-- Authenticated users can add feedback
CREATE POLICY "Authenticated users can add dwfm" ON does_work_for_me
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can delete their own feedback
CREATE POLICY "Users can delete their own dwfm" ON does_work_for_me
  FOR DELETE USING (auth.uid() = user_id);
