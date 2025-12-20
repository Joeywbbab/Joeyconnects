-- Sample Idea: Death Wishing List
-- A bucket list app that helps you track things you want to do before you die

INSERT INTO ideas (
  title,
  description,
  expected_days,
  creator_id,
  creator_email
) VALUES (
  'Death Wishing List',
  'A bucket list application where users can create and track their life goals and wishes before they die. Features include: categorizing wishes (travel, experiences, achievements), marking items as completed with photos/notes, sharing wishes with friends and family, setting deadlines and reminders, and visualizing progress with beautiful charts. The app should have a thoughtful, inspiring design that motivates users to live their best life.',
  14,
  NULL,
  'system@joeyconnects.world'
)
ON CONFLICT DO NOTHING;

-- Verify the idea was inserted
SELECT id, title, expected_days, creator_email, created_at
FROM ideas
WHERE title = 'Death Wishing List';
