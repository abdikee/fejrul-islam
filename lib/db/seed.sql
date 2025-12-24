-- HUMSJ Database Seed Data
-- Sample data for development and testing

-- Insert learning sectors
INSERT INTO learning_sectors (name, description, icon, color) VALUES
('Dawah & Comparative Religion', 'Outreach, Logic, Intellectual Defense', 'MessageCircle', 'blue'),
('Irshad (Qirat & Ilm)', 'Knowledge, Learning, Academic Faith Development', 'BookOpen', 'emerald'),
('Tarbiya & Character', 'Character, Spiritual Growth, Leadership Training', 'Heart', 'rose'),
('Idad Leadership', 'Leadership Training and Development', 'GraduationCap', 'purple');

-- Insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name, gender, department, academic_year, role, level, bio, email_verified) VALUES
('ahmed.hassan@student.edu', '$2b$10$MqZo1deSvaH7Nwm99TuMlu7P4WlNz2OXiOj/jACAZ3BioSNsjzozu', 'Ahmed', 'Hassan', 'male', 'Computer Science', 3, 'student', 'Level 2: Learner', 'Seeking knowledge and striving to be a better Muslim every day.', false),
('fatima.mohammed@student.edu', '$2b$10$MqZo1deSvaH7Nwm99TuMlu7P4WlNz2OXiOj/jACAZ3BioSNsjzozu', 'Fatima', 'Mohammed', 'female', 'Medicine', 4, 'student', 'Level 3: Practitioner', 'Dedicated to serving the community through medicine and faith.', false),
('abdurehman@gmail.com', '$2b$10$MqZo1deSvaH7Nwm99TuMlu7P4WlNz2OXiOj/jACAZ3BioSNsjzozu', 'Abdurahman', 'Omar', 'male', NULL, NULL, 'mentor', 'Senior Mentor', 'Islamic scholar and mentor with 15 years of teaching experience.', true),
('abdikedir@gmail.com', '$2b$10$MqZo1deSvaH7Nwm99TuMlu7P4WlNz2OXiOj/jACAZ3BioSNsjzozu', 'Abdike', 'Administrator', 'male', NULL, NULL, 'admin', 'Administrator', 'System administrator for HUMSJ platform.', true);

-- Insert sample Quran verses
INSERT INTO quran_verses (surah_number, surah_name_arabic, surah_name_english, verse_number, arabic_text, english_translation, revelation_type) VALUES
(20, 'طه', 'Ta-Ha', 114, 'وَقُل رَّبِّ زِدْنِي عِلْمًا', 'And say: My Lord, increase me in knowledge', 'meccan'),
(35, 'فاطر', 'Fatir', 28, 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ', 'Only those fear Allah, from among His servants, who have knowledge', 'meccan'),
(2, 'البقرة', 'Al-Baqarah', 269, 'وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا', 'And whoever is given wisdom has certainly been given much good', 'medinan'),
(13, 'الرعد', 'Ar-Rad', 11, 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ', 'Indeed, Allah will not change the condition of a people until they change what is in themselves', 'meccan');

-- Insert sample Hadith
INSERT INTO hadith_collection (collection_name, hadith_number, arabic_text, english_translation, narrator, grade, topic) VALUES
('Ibn Majah', 224, 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', 'The seeking of knowledge is obligatory upon every Muslim.', 'Anas ibn Malik', 'Hasan', 'Knowledge'),
('Muslim', 2699, 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ', 'Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.', 'Abu Hurairah', 'Sahih', 'Knowledge'),
('Muslim', 2742, 'الدُّنْيَا خَضِرَةٌ حُلْوَةٌ وَإِنَّ اللَّهَ مُسْتَخْلِفُكُمْ فِيهَا', 'The world is green and beautiful, and Allah has appointed you as His stewards over it.', 'Abdullah ibn Amr', 'Sahih', 'Environment');

-- Insert sample courses
INSERT INTO courses (sector_id, title, description, level, duration_weeks, learning_objectives) VALUES
(1, 'Introduction to Dawah', 'Basic principles of Islamic outreach and dialogue', 'Beginner', 8, ARRAY['Understand dawah methodology', 'Learn effective communication', 'Practice dialogue techniques']),
(2, 'Quran Recitation Basics', 'Fundamental Tajweed rules and Quranic recitation', 'Beginner', 12, ARRAY['Master basic Tajweed', 'Improve recitation quality', 'Memorize selected verses']),
(3, 'Character Development', 'Islamic ethics and moral development', 'Intermediate', 10, ARRAY['Understand Islamic ethics', 'Develop good character', 'Practice self-reflection']),
(4, 'Leadership in Islam', 'Islamic principles of leadership and management', 'Advanced', 16, ARRAY['Learn Islamic leadership', 'Develop management skills', 'Practice team building']);

-- Insert user progress
INSERT INTO user_progress (user_id, sector_id, progress_percentage, completed_modules, total_modules) VALUES
((SELECT id FROM users WHERE email = 'ahmed.hassan@student.edu'), 1, 60, 3, 5),
((SELECT id FROM users WHERE email = 'ahmed.hassan@student.edu'), 2, 80, 4, 5),
((SELECT id FROM users WHERE email = 'ahmed.hassan@student.edu'), 3, 40, 2, 5),
((SELECT id FROM users WHERE email = 'ahmed.hassan@student.edu'), 4, 20, 1, 5);

-- Insert mentorship relationships
INSERT INTO mentorship (mentor_id, student_id, usrah_group) VALUES
((SELECT id FROM users WHERE email = 'abdurehman@gmail.com'), (SELECT id FROM users WHERE email = 'ahmed.hassan@student.edu'), 'Tarbiya Circle Alpha'),
((SELECT id FROM users WHERE email = 'abdurehman@gmail.com'), (SELECT id FROM users WHERE email = 'fatima.mohammed@student.edu'), 'Tarbiya Circle Alpha');

-- Insert sample daily habits
INSERT INTO daily_habits (user_id, habit_date, morning_adhkar, quran_reading, evening_adhkar, sadaqah) VALUES
((SELECT id FROM users WHERE email = 'ahmed.hassan@student.edu'), CURRENT_DATE, false, true, false, true),
((SELECT id FROM users WHERE email = 'ahmed.hassan@student.edu'), CURRENT_DATE - INTERVAL '1 day', true, true, true, false);

-- Insert sample assignments
INSERT INTO assignments (course_id, instructor_id, title, description, assignment_type, due_date, priority) VALUES
((SELECT id FROM courses WHERE title = 'Leadership in Islam'), (SELECT id FROM users WHERE email = 'abdurehman@gmail.com'), 'Weekly Khutbah Practice', 'Prepare and record a 10-15 minute khutbah on "Youth and Technology in Islam"', 'khutbah', CURRENT_DATE + INTERVAL '7 days', 'high'),
((SELECT id FROM courses WHERE title = 'Quran Recitation Basics'), (SELECT id FROM users WHERE email = 'abdurehman@gmail.com'), 'Tajweed Assessment', 'Record recitation of Surah Al-Mulk with proper tajweed rules', 'quran', CURRENT_DATE + INTERVAL '10 days', 'medium');

-- Insert sample submissions
INSERT INTO idad_submissions (user_id, instructor_id, submission_type, title, description, duration_seconds, review_status, score, feedback) VALUES
((SELECT id FROM users WHERE email = 'ahmed.hassan@student.edu'), (SELECT id FROM users WHERE email = 'abdurehman@gmail.com'), 'khutbah', 'Friday Khutbah: The Importance of Seeking Knowledge', 'Weekly khutbah practice submission', 750, 'reviewed', 85, 'Excellent content and structure. Work on voice modulation and eye contact.'),
((SELECT id FROM users WHERE email = 'ahmed.hassan@student.edu'), (SELECT id FROM users WHERE email = 'abdurehman@gmail.com'), 'quran', 'Surah Al-Baqarah (Verses 1-10)', 'Tajweed practice submission', 525, 'pending', NULL, NULL);

-- Insert sample prayer times for Addis Ababa
INSERT INTO prayer_times (location, date, fajr, dhuhr, asr, maghrib, isha) VALUES
('Addis Ababa, Ethiopia', CURRENT_DATE, '05:30', '12:15', '15:45', '18:20', '19:45'),
('Addis Ababa, Ethiopia', CURRENT_DATE + INTERVAL '1 day', '05:31', '12:15', '15:45', '18:20', '19:44');

-- Insert sample Islamic events
INSERT INTO islamic_events (event_name, event_type, hijri_date, gregorian_date, description) VALUES
('Mawlid an-Nabi', 'holiday', '12 Rabi al-Awwal', '2025-09-05', 'Birthday of Prophet Muhammad (peace be upon him)'),
('Laylat al-Qadr', 'holiday', '27 Ramadan', '2025-04-25', 'The Night of Power'),
('Weekly Halaqah', 'lecture', NULL, CURRENT_DATE + INTERVAL '3 days', 'Weekly Islamic study circle');

-- Insert sample announcements
INSERT INTO announcements (title, content, announcement_type, target_audience, priority, created_by) VALUES
('New Semester Registration Open', 'Registration for the new semester is now open. Please complete your course selection by the deadline.', 'academic', 'students', 'high', (SELECT id FROM users WHERE email = 'abdikedir@gmail.com')),
('Ramadan Schedule Changes', 'Please note the adjusted class schedule during the holy month of Ramadan.', 'general', 'all', 'normal', (SELECT id FROM users WHERE email = 'abdikedir@gmail.com'));

-- Insert sample resources
INSERT INTO resources (title, description, resource_type, sector_id, access_level, uploaded_by) VALUES
('Tajweed Rules Guide', 'Comprehensive guide to Quranic recitation rules', 'pdf', 2, 'student', (SELECT id FROM users WHERE email = 'abdurehman@gmail.com')),
('Dawah Methodology Handbook', 'Practical guide for Islamic outreach', 'pdf', 1, 'student', (SELECT id FROM users WHERE email = 'abdurehman@gmail.com')),
('Character Development Workbook', 'Interactive exercises for spiritual growth', 'pdf', 3, 'student', (SELECT id FROM users WHERE email = 'abdurehman@gmail.com'));

-- Seed editable website pages (blank by default)
INSERT INTO site_pages (slug, title, content, updated_by) VALUES
('home', 'Home', '', (SELECT id FROM users WHERE email = 'abdikedir@gmail.com')),
('about', 'About', '', (SELECT id FROM users WHERE email = 'abdikedir@gmail.com')),
('sectors', 'Sectors', '', (SELECT id FROM users WHERE email = 'abdikedir@gmail.com')),
('knowledge-series', 'Knowledge Series', '', (SELECT id FROM users WHERE email = 'abdikedir@gmail.com'));