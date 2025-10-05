-- Test queries to debug the 400 error

-- 1. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_points'
ORDER BY ordinal_position;

-- 2. Check if RLS is really disabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_points';

-- 3. Try a simple select
SELECT * FROM user_points LIMIT 1;

-- 4. Try inserting a test row (replace YOUR_USER_ID with actual UUID)
-- INSERT INTO user_points (user_id, points) VALUES ('YOUR_USER_ID', 0);
