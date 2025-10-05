-- Create or replace user_points table
DROP TABLE IF EXISTS user_points;

CREATE TABLE user_points (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  tasks_completed INTEGER DEFAULT 0
);

-- Disable RLS for now to avoid permission issues
ALTER TABLE user_points DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON user_points TO authenticated;
GRANT ALL ON user_points TO anon;
