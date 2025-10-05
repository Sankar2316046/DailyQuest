-- Test if we can connect to user_points table

-- Simple select to check table access
SELECT COUNT(*) as total_records FROM user_points;

-- Check if we can insert a test record (run this, then delete it)
-- INSERT INTO user_points (user_id, points, tasks_completed, streak, badges)
-- VALUES ('00000000-0000-0000-0000-000000000000', 0, 0, 0, '[]');
-- DELETE FROM user_points WHERE user_id = '00000000-0000-0000-0000-000000000000';
