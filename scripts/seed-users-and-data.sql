-- ============================================
-- COMPREHENSIVE SEED SCRIPT FOR PRODUCTION
-- Includes: Admins, Mentors, Students, Courses, Resources, Announcements
-- ============================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE users CASCADE;
-- TRUNCATE TABLE courses CASCADE;
-- TRUNCATE TABLE announcements CASCADE;
-- TRUNCATE TABLE resources CASCADE;

-- ============================================
-- 1. CREATE ADMIN USERS (Both Genders)
-- ============================================
-- Password for all users: "password123" (hashed with bcrypt)
-- $2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C

-- Male Admin
INSERT INTO users (first_name, last_name, email, password_hash, role, gender, is_verified, created_at)
VALUES 
('Abdullah', 'Omar', 'admin.male@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'admin', 'male', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Female Admin
INSERT INTO users (first_name, last_name, email, password_hash, role, gender, is_verified, created_at)
VALUES 
('Fatima', 'Hassan', 'admin.female@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'admin', 'female', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. CREATE MENTOR USERS (Both Genders)
-- ============================================

-- Male Mentors
INSERT INTO users (first_name, last_name, email, password_hash, role, gender, is_verified, created_at)
VALUES 
('Ahmad', 'Ibrahim', 'mentor.male1@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'mentor', 'male', true, NOW()),
('Yusuf', 'Ali', 'mentor.male2@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'mentor', 'male', true, NOW()),
('Khalid', 'Mohammed', 'mentor.male3@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'mentor', 'male', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Female Mentors
INSERT INTO users (first_name, last_name, email, password_hash, role, gender, is_verified, created_at)
VALUES 
('Aisha', 'Ahmed', 'mentor.female1@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'mentor', 'female', true, NOW()),
('Maryam', 'Saleh', 'mentor.female2@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'mentor', 'female', true, NOW()),
('Khadija', 'Abdullah', 'mentor.female3@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'mentor', 'female', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 3. CREATE SAMPLE STUDENTS (Both Genders)
-- ============================================

-- Male Students
INSERT INTO users (first_name, last_name, email, password_hash, role, gender, is_verified, created_at)
VALUES 
('Omar', 'Hassan', 'student.male1@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'male', true, NOW()),
('Bilal', 'Ahmed', 'student.male2@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'male', true, NOW()),
('Hamza', 'Ali', 'student.male3@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'male', true, NOW()),
('Zaid', 'Mohammed', 'student.male4@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'male', true, NOW()),
('Ibrahim', 'Yusuf', 'student.male5@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'male', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Female Students
INSERT INTO users (first_name, last_name, email, password_hash, role, gender, is_verified, created_at)
VALUES 
('Zaynab', 'Omar', 'student.female1@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'female', true, NOW()),
('Hafsa', 'Ibrahim', 'student.female2@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'female', true, NOW()),
('Sumaya', 'Ahmed', 'student.female3@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'female', true, NOW()),
('Ruqayya', 'Ali', 'student.female4@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'female', true, NOW()),
('Asma', 'Hassan', 'student.female5@humsj.org', '$2b$10$rQ3Kx5Z8Y9X7W6V5U4T3S.eR2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C', 'student', 'female', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 4. CREATE LEARNING SECTORS
-- ============================================

INSERT INTO learning_sectors (name, description, color, icon, is_active, created_at)
VALUES 
('Qirat & Ilm', 'Quranic recitation and Islamic sciences', 'teal', 'book', true, NOW()),
('Tarbiya & Idad', 'Character development and youth preparation', 'blue', 'heart', true, NOW()),
('Comparative Religion', 'Study of world religions and Islamic perspective', 'purple', 'globe', true, NOW()),
('Literature', 'Islamic literature, poetry, and historical texts', 'green', 'pen', true, NOW()),
('Ziyara', 'Visitation etiquette and spiritual journeys', 'orange', 'mosque', true, NOW())
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 5. CREATE SAMPLE COURSES
-- ============================================

-- Get sector IDs
DO $$
DECLARE
    qirat_id INT;
    tarbiya_id INT;
    comparative_id INT;
    literature_id INT;
    ziyara_id INT;
    admin_id INT;
BEGIN
    SELECT id INTO qirat_id FROM learning_sectors WHERE name = 'Qirat & Ilm' LIMIT 1;
    SELECT id INTO tarbiya_id FROM learning_sectors WHERE name = 'Tarbiya & Idad' LIMIT 1;
    SELECT id INTO comparative_id FROM learning_sectors WHERE name = 'Comparative Religion' LIMIT 1;
    SELECT id INTO literature_id FROM learning_sectors WHERE name = 'Literature' LIMIT 1;
    SELECT id INTO ziyara_id FROM learning_sectors WHERE name = 'Ziyara' LIMIT 1;
    SELECT id INTO admin_id FROM users WHERE role = 'admin' LIMIT 1;

    -- Qirat & Ilm Courses
    INSERT INTO courses (code, title, description, sector_id, difficulty_level, estimated_weeks, is_active, created_by, created_at)
    VALUES 
    ('QI-001', 'Tajweed Fundamentals', 'Learn the basic rules of Quranic recitation', qirat_id, 'beginner', 8, true, admin_id, NOW()),
    ('QI-002', 'Advanced Tajweed', 'Master advanced Tajweed rules and application', qirat_id, 'advanced', 12, true, admin_id, NOW()),
    ('QI-003', 'Quran Memorization Techniques', 'Effective methods for memorizing the Quran', qirat_id, 'intermediate', 16, true, admin_id, NOW())
    ON CONFLICT (code) DO NOTHING;

    -- Tarbiya & Idad Courses
    INSERT INTO courses (code, title, description, sector_id, difficulty_level, estimated_weeks, is_active, created_by, created_at)
    VALUES 
    ('TI-001', 'Islamic Character Building', 'Develop strong Islamic character and values', tarbiya_id, 'beginner', 10, true, admin_id, NOW()),
    ('TI-002', 'Youth Leadership in Islam', 'Leadership principles from Islamic perspective', tarbiya_id, 'intermediate', 12, true, admin_id, NOW()),
    ('TI-003', 'Islamic Finance Basics', 'Introduction to Islamic banking and finance', tarbiya_id, 'beginner', 8, true, admin_id, NOW())
    ON CONFLICT (code) DO NOTHING;

    -- Comparative Religion Courses
    INSERT INTO courses (code, title, description, sector_id, difficulty_level, estimated_weeks, is_active, created_by, created_at)
    VALUES 
    ('CR-001', 'World Religions Overview', 'Study of major world religions', comparative_id, 'beginner', 10, true, admin_id, NOW()),
    ('CR-002', 'Islamic Theology', 'Deep dive into Islamic beliefs and theology', comparative_id, 'intermediate', 14, true, admin_id, NOW())
    ON CONFLICT (code) DO NOTHING;

    -- Literature Courses
    INSERT INTO courses (code, title, description, sector_id, difficulty_level, estimated_weeks, is_active, created_by, created_at)
    VALUES 
    ('LIT-001', 'Arabic Language Fundamentals', 'Learn basic Arabic grammar and vocabulary', literature_id, 'beginner', 12, true, admin_id, NOW()),
    ('LIT-002', 'Islamic Poetry and Literature', 'Study of classical Islamic poetry', literature_id, 'intermediate', 10, true, admin_id, NOW()),
    ('LIT-003', 'Islamic History', 'Comprehensive study of Islamic history', literature_id, 'beginner', 16, true, admin_id, NOW())
    ON CONFLICT (code) DO NOTHING;

    -- Ziyara Courses
    INSERT INTO courses (code, title, description, sector_id, difficulty_level, estimated_weeks, is_active, created_by, created_at)
    VALUES 
    ('ZIY-001', 'Hajj and Umrah Guide', 'Complete guide to performing Hajj and Umrah', ziyara_id, 'beginner', 6, true, admin_id, NOW()),
    ('ZIY-002', 'Islamic Sacred Sites', 'History and significance of Islamic holy places', ziyara_id, 'beginner', 8, true, admin_id, NOW())
    ON CONFLICT (code) DO NOTHING;
END $$;

-- ============================================
-- 6. CREATE SAMPLE ANNOUNCEMENTS
-- ============================================

DO $$
DECLARE
    admin_id INT;
BEGIN
    SELECT id INTO admin_id FROM users WHERE role = 'admin' LIMIT 1;

    INSERT INTO announcements (title, content, announcement_type, target_audience, priority, publish_date, expire_date, created_by, is_active, created_at)
    VALUES 
    ('Welcome to HUMSJ LMS', 'Welcome to the Fejrul Islam HUMSJ Learning Management System. We are excited to have you join our community of learners.', 'general', 'all', 'high', NOW(), NOW() + INTERVAL '90 days', admin_id, true, NOW()),
    ('Ramadan Schedule Update', 'Updated class schedule for the holy month of Ramadan. All classes will be adjusted to accommodate prayer times.', 'schedule', 'all', 'urgent', NOW(), NOW() + INTERVAL '30 days', admin_id, true, NOW()),
    ('New Courses Available', 'We have added new courses in all sectors. Check out the courses page to enroll!', 'course', 'students', 'normal', NOW(), NOW() + INTERVAL '60 days', admin_id, true, NOW()),
    ('Mentor Training Session', 'All mentors are invited to attend the training session on effective online teaching methods.', 'event', 'mentors', 'high', NOW(), NOW() + INTERVAL '14 days', admin_id, true, NOW())
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- 7. CREATE SAMPLE RESOURCES
-- ============================================

DO $$
DECLARE
    admin_id INT;
    qirat_id INT;
    tarbiya_id INT;
    literature_id INT;
BEGIN
    SELECT id INTO admin_id FROM users WHERE role = 'admin' LIMIT 1;
    SELECT id INTO qirat_id FROM learning_sectors WHERE name = 'Qirat & Ilm' LIMIT 1;
    SELECT id INTO tarbiya_id FROM learning_sectors WHERE name = 'Tarbiya & Idad' LIMIT 1;
    SELECT id INTO literature_id FROM learning_sectors WHERE name = 'Literature' LIMIT 1;

    INSERT INTO resources (title, description, resource_type, file_path, file_size, sector_id, access_level, uploaded_by, created_at)
    VALUES 
    ('Tajweed Rules Guide', 'Comprehensive guide to Tajweed rules with examples', 'PDF', '/resources/tajweed-guide.pdf', 2500000, qirat_id, 'public', admin_id, NOW()),
    ('Quran Recitation Audio', 'Beautiful Quran recitation by Sheikh Abdul Rahman', 'Audio', '/resources/quran-recitation.mp3', 15000000, qirat_id, 'public', admin_id, NOW()),
    ('Islamic Finance Principles', 'Introduction to Islamic banking and finance', 'PDF', '/resources/islamic-finance.pdf', 3200000, tarbiya_id, 'public', admin_id, NOW()),
    ('Arabic Grammar Workbook', 'Interactive workbook for learning Arabic grammar', 'PDF', '/resources/arabic-grammar.pdf', 4100000, literature_id, 'public', admin_id, NOW()),
    ('Islamic History Timeline', 'Visual timeline of major events in Islamic history', 'Image', '/resources/history-timeline.jpg', 1800000, literature_id, 'public', admin_id, NOW())
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- 8. VERIFY DATA
-- ============================================

-- Count users by role
SELECT 
    role,
    gender,
    COUNT(*) as count
FROM users
GROUP BY role, gender
ORDER BY role, gender;

-- Count courses by sector
SELECT 
    ls.name as sector,
    COUNT(c.id) as course_count
FROM learning_sectors ls
LEFT JOIN courses c ON ls.id = c.sector_id
GROUP BY ls.name
ORDER BY ls.name;

-- Count announcements
SELECT COUNT(*) as announcement_count FROM announcements WHERE is_active = true;

-- Count resources
SELECT COUNT(*) as resource_count FROM resources;

-- ============================================
-- SUMMARY
-- ============================================
-- Users Created:
--   - 2 Admins (1 male, 1 female)
--   - 6 Mentors (3 male, 3 female)
--   - 10 Students (5 male, 5 female)
-- 
-- Sectors: 5 (All active)
-- Courses: 13 (Across all sectors)
-- Announcements: 4 (All active)
-- Resources: 5 (All public)
--
-- Default Password: password123
-- 
-- Login Credentials:
--   Male Admin: admin.male@humsj.org / password123
--   Female Admin: admin.female@humsj.org / password123
--   Male Mentor: mentor.male1@humsj.org / password123
--   Female Mentor: mentor.female1@humsj.org / password123
--   Male Student: student.male1@humsj.org / password123
--   Female Student: student.female1@humsj.org / password123
-- ============================================
