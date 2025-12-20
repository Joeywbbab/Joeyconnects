-- =====================================================
-- Supabase Row Level Security (RLS) Policies
-- =====================================================
-- Run these SQL commands in your Supabase SQL Editor
-- to protect your database from unauthorized access
-- =====================================================

-- 1. ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comics ENABLE ROW LEVEL SECURITY;

-- 2. MEMOS TABLE POLICIES
-- =====================================================

-- Allow EVERYONE to READ memos (public viewing)
DROP POLICY IF EXISTS "Public can view memos" ON memos;
CREATE POLICY "Public can view memos" ON memos
  FOR SELECT
  USING (true);

-- Only AUTHENTICATED users can INSERT memos
DROP POLICY IF EXISTS "Authenticated users can insert memos" ON memos;
CREATE POLICY "Authenticated users can insert memos" ON memos
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only AUTHENTICATED users can UPDATE memos
DROP POLICY IF EXISTS "Authenticated users can update memos" ON memos;
CREATE POLICY "Authenticated users can update memos" ON memos
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only AUTHENTICATED users can DELETE memos
DROP POLICY IF EXISTS "Authenticated users can delete memos" ON memos;
CREATE POLICY "Authenticated users can delete memos" ON memos
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- 3. COMICS TABLE POLICIES
-- =====================================================

-- Allow EVERYONE to READ comics (public viewing)
DROP POLICY IF EXISTS "Public can view comics" ON comics;
CREATE POLICY "Public can view comics" ON comics
  FOR SELECT
  USING (true);

-- Only AUTHENTICATED users can INSERT comics
DROP POLICY IF EXISTS "Authenticated users can insert comics" ON comics;
CREATE POLICY "Authenticated users can insert comics" ON comics
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only AUTHENTICATED users can UPDATE comics
DROP POLICY IF EXISTS "Authenticated users can update comics" ON comics;
CREATE POLICY "Authenticated users can update comics" ON comics
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only AUTHENTICATED users can DELETE comics
DROP POLICY IF EXISTS "Authenticated users can delete comics" ON comics;
CREATE POLICY "Authenticated users can delete comics" ON comics
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- 4. STORAGE BUCKET POLICIES
-- =====================================================

-- Public READ access to storage (anyone can view images)
DROP POLICY IF EXISTS "Public can view storage" ON storage.objects;
CREATE POLICY "Public can view storage" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'memos');

-- Only AUTHENTICATED users can UPLOAD to storage
DROP POLICY IF EXISTS "Authenticated can upload to storage" ON storage.objects;
CREATE POLICY "Authenticated can upload to storage" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'memos' AND
    auth.uid() IS NOT NULL
  );

-- Only AUTHENTICATED users can DELETE from storage
DROP POLICY IF EXISTS "Authenticated can delete from storage" ON storage.objects;
CREATE POLICY "Authenticated can delete from storage" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'memos' AND
    auth.uid() IS NOT NULL
  );

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify policies are active:

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('memos', 'comics');

-- List all policies
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- =====================================================
-- NOTES
-- =====================================================
-- With these policies:
-- ✅ Anyone can VIEW content (memos, comics, images)
-- ❌ Only logged-in users can CREATE/EDIT/DELETE
--
-- To add more granular control (e.g., admin-only delete),
-- you can modify the policies to check user email or role
-- =====================================================
