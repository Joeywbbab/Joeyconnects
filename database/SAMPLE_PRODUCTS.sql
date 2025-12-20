-- =====================================================
-- Sample Products for Joey's Store
-- =====================================================
-- Run this AFTER you've run STORE_TABLES.sql
-- Replace YOUR_USER_ID with your actual auth.users ID
-- =====================================================

-- First, get your user ID by running this query:
-- SELECT id, email FROM auth.users;

-- Then replace 'YOUR_USER_ID' below with your actual ID
-- Replace 'YOUR_EMAIL' with your email

-- =====================================================
-- FlowTree - Prototype Flow Management Tool
-- =====================================================
INSERT INTO products (
  title,
  description,
  creator_id,
  creator_email,
  actual_days,
  product_url,
  created_at
) VALUES (
  'FlowTree 🌳',
  'A powerful prototype interaction flow management tool with hotspot annotations and parallel step display. Features: Interactive flow management, Jump hotspots, Comment markers, Parallel/Linear layouts, IndexedDB storage, Import/Export, High-quality preview. Tech: Pure HTML/CSS/JavaScript, IndexedDB API, No server required.',
  'YOUR_USER_ID', -- Replace with your actual user ID
  'YOUR_EMAIL',    -- Replace with your email
  14,
  'https://github.com/yourusername/flowtree', -- Update with actual repo URL
  NOW()
);

-- Optional: Add an idea that FlowTree was built from
INSERT INTO ideas (
  title,
  description,
  expected_days,
  creator_id,
  creator_email,
  created_at
) VALUES (
  'Prototype Flow Visualization Tool',
  'A tool to help designers and PMs visualize and document user flow prototypes. Should support adding screenshots, marking clickable areas, and showing navigation paths between screens. Must work offline and handle large image files.',
  14,
  'YOUR_USER_ID', -- Replace with your actual user ID
  'YOUR_EMAIL',    -- Replace with your email
  NOW() - INTERVAL '20 days' -- Created 20 days ago
);

-- Link the product to the idea (optional)
-- First, get the IDs:
-- SELECT id, title FROM ideas WHERE title LIKE '%Prototype%';
-- SELECT id, title FROM products WHERE title LIKE '%FlowTree%';

-- Then update the product with the idea_id:
-- UPDATE products
-- SET idea_id = 'IDEA_ID_HERE'
-- WHERE title = 'FlowTree 🌳';

-- =====================================================
-- How to find your user ID:
-- =====================================================
-- 1. Sign in to your app with Google OAuth
-- 2. Go to Supabase Dashboard → Authentication → Users
-- 3. Find your email and copy the UUID
-- 4. Replace YOUR_USER_ID in this file with that UUID
-- 5. Run this SQL script in Supabase SQL Editor

-- =====================================================
-- Example of completed insertion:
-- =====================================================
-- INSERT INTO products (
--   title, description, creator_id, creator_email, actual_days, product_url
-- ) VALUES (
--   'FlowTree 🌳',
--   'A powerful prototype interaction flow management tool...',
--   '12345678-1234-1234-1234-123456789abc', -- Your actual UUID
--   'joeybab5207@gmail.com',                 -- Your actual email
--   14,
--   'https://github.com/yourusername/flowtree'
-- );
