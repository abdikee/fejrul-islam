-- ============================================================================
-- SAMPLE DATA FOR ADMIN TESTING
-- Add sample courses, announcements, and resources for testing
-- ============================================================================

-- Ensure we have sectors first
INSERT INTO sectors (code, name, description, color, is_active) VALUES
('qirat-ilm', 'Qirat & Ilm', 'Quranic Recitation and Islamic Knowledge', 'emerald', true),
('literature', 'Literature & History', 'Islamic Heritage and Creative Expression', 'amber', true),
('dawah', 'Dawah & Comparative Religion', 'Outreach and Interfaith Dialogue', 'blue', true),
('tarbiya', 'Tarbiya & Idad', 'Character Building and Leadership', 'rose', true),
('ziyara', 'Ziyara', 'Student Welfare and Community Support', 'purple', true)
ON CONFLICT (code) DO NOTHING;

-- Add sample courses
INSERT INTO courses (code, title, description, sector_id, difficulty_level, estimated_weeks, is_active, created_at) VALUES
('PRG-001', 'Introduction to Dawah', 'Learn the fundamentals of Islamic outreach and invitation to Islam', 3, 'Beginner', 8, true, NOW()),
('PRG-002', 'Quranic Recitation Basics', 'Master the basics of proper Quranic recitation with Tajweed', 1, 'Beginner', 12, true, NOW()),
('PRG-003', 'Islamic Leadership Development', 'Develop leadership skills based on Islamic principles', 4, 'Intermediate', 10, true, NOW()),
('PRG-004', 'Interfaith Dialogue Techniques', 'Learn effective methods for interfaith communication', 3, 'Advanced', 6, true, NOW()),
('PRG-005', 'Islamic History and Heritage', 'Explore the rich history of Islamic civilization', 2, 'Intermediate', 14, true, NOW())
ON CONFLICT (code) DO NOTHING;

-- Add sample announcements
INSERT INTO announcements (title, content, announcement_type, target_audience, priority, is_active, created_at) VALUES
('Welcome to New Semester', 'Assalamu Alaikum! Welcome to the new academic semester. All programs are now open for enrollment.', 'general', 'all', 'high', true, NOW()),
('Ramadan Schedule Update', 'Please note the updated schedule for all programs during the blessed month of Ramadan.', 'schedule', 'all', 'normal', true, NOW()),
('New Qirat Program Launch', 'We are excited to announce the launch of our advanced Quranic recitation program.', 'program', 'students', 'high', true, NOW()),
('Weekly Dawah Training', 'Join us every Friday for practical dawah training sessions. All levels welcome.', 'event', 'all', 'normal', true, NOW()),
('System Maintenance Notice', 'The platform will undergo maintenance this weekend. Please save your progress.', 'system', 'all', 'low', true, NOW())
ON CONFLICT DO NOTHING;

-- Add sample resources
INSERT INTO resources (title, description, resource_type, file_path, sector_id, access_level, file_size, is_active, created_at) VALUES
('Dawah Handbook PDF', 'Comprehensive guide to effective Islamic outreach', 'PDF', '/resources/dawah-handbook.pdf', 3, 'public', 2048000, true, NOW()),
('Tajweed Rules Video', 'Video tutorial covering essential Tajweed rules', 'Video', '/resources/tajweed-tutorial.mp4', 1, 'public', 15728640, true, NOW()),
('Leadership in Islam', 'Islamic principles of leadership and management', 'PDF', '/resources/islamic-leadership.pdf', 4, 'members', 1536000, true, NOW()),
('Interfaith Dialogue Guide', 'Best practices for interfaith communication', 'Document', '/resources/interfaith-guide.docx', 3, 'public', 512000, true, NOW()),
('Islamic History Timeline', 'Interactive timeline of Islamic civilization', 'Interactive', '/resources/history-timeline.html', 2, 'public', 1024000, true, NOW())
ON CONFLICT DO NOTHING;

-- Update any existing data to ensure consistency
UPDATE courses SET 
  difficulty_level = COALESCE(difficulty_level, level, 'Beginner'),
  estimated_weeks = COALESCE(estimated_weeks, duration_weeks, 8),
  is_active = COALESCE(is_active, true)
WHERE difficulty_level IS NULL OR estimated_weeks IS NULL;

UPDATE announcements SET 
  is_active = COALESCE(is_active, true),
  announcement_type = COALESCE(announcement_type, 'general'),
  target_audience = COALESCE(target_audience, 'all'),
  priority = COALESCE(priority, 'normal')
WHERE is_active IS NULL;

UPDATE resources SET 
  is_active = COALESCE(is_active, true),
  access_level = COALESCE(access_level, 'public'),
  resource_type = COALESCE(resource_type, 'PDF')
WHERE is_active IS NULL;

-- Verify the data
SELECT 'Courses' as table_name, COUNT(*) as count FROM courses WHERE is_active = true
UNION ALL
SELECT 'Announcements' as table_name, COUNT(*) as count FROM announcements WHERE is_active = true  
UNION ALL
SELECT 'Resources' as table_name, COUNT(*) as count FROM resources WHERE is_active = true
UNION ALL
SELECT 'Sectors' as table_name, COUNT(*) as count FROM sectors WHERE is_active = true;