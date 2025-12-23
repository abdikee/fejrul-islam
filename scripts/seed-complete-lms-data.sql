-- ============================================================================
-- FEJRUL ISLAM HUMSJ - COMPLETE LMS SEED DATA
-- 5 Sectors × 3 Levels × 5-7 Courses = Comprehensive Islamic Curriculum
-- ============================================================================

-- ============================================================================
-- 1. INSERT SECTORS
-- ============================================================================

INSERT INTO sectors (code, name, description, focus_areas, icon, color, display_order) VALUES
('QIRAT_ILM', 'Qirat & Ilm', 
 'Comprehensive Quranic studies and core Islamic sciences focusing on proper recitation, fundamental beliefs, and essential worship practices.',
 'Tajweed & Qiraat, Aqida, Fiqh al-Ibadat, Hadith selections, Mustalah basics, Short Seerah, Akhlaq',
 'BookOpen', 'emerald', 1),

('TARBIYA_IDAD', 'Tarbiya & Idad',
 'Character development and youth preparation program focusing on Islamic personality building and practical life skills.',
 'Aqida for youth, Akhlaq & Tazkiyah, Seerah stories, Fiqh of daily life, Contemporary youth issues',
 'Users', 'blue', 2),

('DAWAH_COMPARATIVE', 'Dawah & Comparative Religion',
 'Islamic propagation and interfaith understanding, equipping students with knowledge to present Islam and address misconceptions.',
 'Usul ad-Dawah, Aqida/Tawheed, Comparative religion basics, Shubuhat and refutations, Communication skills',
 'MessageCircle', 'purple', 3),

('LITERATURE_HISTORY', 'Literature & History',
 'In-depth study of Islamic history, prophetic biography, and Arabic literature for comprehensive cultural understanding.',
 'Detailed Seerah, Islamic history, Stories of prophets & sahaba, Arabic literature & Nahw for reading',
 'BookMarked', 'amber', 4),

('ZIYARA_KHIDMA', 'Ziyara & Khidma',
 'Practical service and visitation etiquettes according to Sunnah, focusing on community engagement and spiritual practices.',
 'Fiqh of visiting graves & masajid per Sunnah, Adhkar/Dua, Community service, Funerals & consolation, Practical khidma',
 'Heart', 'rose', 5);

-- ============================================================================
-- 2. INSERT SECTOR LEVELS (3 levels per sector = 15 levels total)
-- ============================================================================

-- QIRAT & ILM LEVELS
INSERT INTO sector_levels (sector_id, level_number, level_name, description, estimated_duration_weeks, min_pass_percentage) VALUES
((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'), 1, 'Beginner - Foundation',
 'Introduction to Quranic recitation basics, fundamental Islamic beliefs, and essential worship practices.',
 12, 60.00),
((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'), 2, 'Intermediate - Development',
 'Advanced Tajweed rules, deeper understanding of Aqida, comprehensive Fiqh, and Hadith studies.',
 16, 65.00),
((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'), 3, 'Advanced - Specialization',
 'Mastery of Qiraat variations, scholarly Aqida discussions, advanced Fiqh rulings, and Hadith authentication.',
 20, 70.00);

-- TARBIYA & IDAD LEVELS
INSERT INTO sector_levels (sector_id, level_number, level_name, description, estimated_duration_weeks, min_pass_percentage) VALUES
((SELECT id FROM sectors WHERE code = 'TARBIYA_IDAD'), 1, 'Beginner - Character Building',
 'Basic Islamic character traits, youth-friendly Aqida, and practical daily life Fiqh.',
 12, 60.00),
((SELECT id FROM sectors WHERE code = 'TARBIYA_IDAD'), 2, 'Intermediate - Personal Development',
 'Advanced character refinement, spiritual purification, and contemporary youth challenges.',
 14, 65.00),
((SELECT id FROM sectors WHERE code = 'TARBIYA_IDAD'), 3, 'Advanced - Leadership & Mentorship',
 'Islamic leadership principles, mentoring skills, and community engagement strategies.',
 16, 70.00);

-- DAWAH & COMPARATIVE RELIGION LEVELS
INSERT INTO sector_levels (sector_id, level_number, level_name, description, estimated_duration_weeks, min_pass_percentage) VALUES
((SELECT id FROM sectors WHERE code = 'DAWAH_COMPARATIVE'), 1, 'Beginner - Dawah Basics',
 'Introduction to Islamic propagation, basic Tawheed, and simple comparative religion concepts.',
 12, 60.00),
((SELECT id FROM sectors WHERE code = 'DAWAH_COMPARATIVE'), 2, 'Intermediate - Apologetics',
 'Addressing common misconceptions, refuting doubts, and effective communication techniques.',
 16, 65.00),
((SELECT id FROM sectors WHERE code = 'DAWAH_COMPARATIVE'), 3, 'Advanced - Scholarly Dawah',
 'Advanced comparative theology, philosophical arguments, and professional dawah strategies.',
 20, 70.00);

-- LITERATURE & HISTORY LEVELS
INSERT INTO sector_levels (sector_id, level_number, level_name, description, estimated_duration_weeks, min_pass_percentage) VALUES
((SELECT id FROM sectors WHERE code = 'LITERATURE_HISTORY'), 1, 'Beginner - Historical Foundations',
 'Introduction to Seerah, early Islamic history, and basic Arabic reading skills.',
 12, 60.00),
((SELECT id FROM sectors WHERE code = 'LITERATURE_HISTORY'), 2, 'Intermediate - Historical Analysis',
 'Detailed Seerah study, Sahaba biographies, and intermediate Arabic literature.',
 16, 65.00),
((SELECT id FROM sectors WHERE code = 'LITERATURE_HISTORY'), 3, 'Advanced - Scholarly Research',
 'Critical historical analysis, advanced Arabic literature, and research methodologies.',
 20, 70.00);

-- ZIYARA & KHIDMA LEVELS
INSERT INTO sector_levels (sector_id, level_number, level_name, description, estimated_duration_weeks, min_pass_percentage) VALUES
((SELECT id FROM sectors WHERE code = 'ZIYARA_KHIDMA'), 1, 'Beginner - Service Basics',
 'Introduction to Islamic service etiquettes, basic adhkar, and community engagement.',
 10, 60.00),
((SELECT id FROM sectors WHERE code = 'ZIYARA_KHIDMA'), 2, 'Intermediate - Practical Service',
 'Advanced service practices, funeral rites, and comprehensive dua collections.',
 14, 65.00),
((SELECT id FROM sectors WHERE code = 'ZIYARA_KHIDMA'), 3, 'Advanced - Community Leadership',
 'Leading community services, advanced spiritual practices, and organizational khidma.',
 16, 70.00);

-- ============================================================================
-- 3. INSERT COURSES (5-7 courses per level)
-- ============================================================================

-- QIRAT & ILM - LEVEL 1 (Beginner)
INSERT INTO courses (sector_id, level_id, code, title, description, category, estimated_weeks, difficulty_level, display_order) VALUES
((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 1),
 'QI-L1-TJW101', 'Tajweed Fundamentals', 'Basic rules of Quranic recitation including Makharij al-Huruf and essential Tajweed principles.', 'Tajweed', 4, 'Beginner', 1),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 1),
 'QI-L1-AQD101', 'Aqida Basics', 'Introduction to Islamic creed covering the six pillars of Iman and fundamental beliefs.', 'Aqida', 3, 'Beginner', 2),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 1),
 'QI-L1-FQH101', 'Fiqh of Worship', 'Essential rulings of Salah, Wudu, Ghusl, and basic acts of worship.', 'Fiqh', 4, 'Beginner', 3),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 1),
 'QI-L1-HDT101', 'Hadith Introduction', 'Selected authentic Hadiths covering basic Islamic teachings and prophetic guidance.', 'Hadith', 3, 'Beginner', 4),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 1),
 'QI-L1-SRH101', 'Seerah Overview', 'Brief biography of Prophet Muhammad (PBUH) covering major events and lessons.', 'Seerah', 3, 'Beginner', 5),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 1),
 'QI-L1-AKH101', 'Islamic Manners', 'Basic Islamic etiquettes, character traits, and moral conduct.', 'Akhlaq', 2, 'Beginner', 6);

-- QIRAT & ILM - LEVEL 2 (Intermediate)
INSERT INTO courses (sector_id, level_id, code, title, description, category, estimated_weeks, difficulty_level, display_order) VALUES
((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 2),
 'QI-L2-TJW201', 'Advanced Tajweed', 'Detailed study of Tajweed rules including Idgham, Iqlab, Ikhfa, and Qalqalah.', 'Tajweed', 5, 'Intermediate', 1),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 2),
 'QI-L2-AQD201', 'Aqida in Depth', 'Comprehensive study of Islamic theology, Names and Attributes of Allah, and theological debates.', 'Aqida', 4, 'Intermediate', 2),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 2),
 'QI-L2-FQH201', 'Comprehensive Fiqh', 'Detailed rulings of Zakah, Sawm, Hajj, and transactions.', 'Fiqh', 5, 'Intermediate', 3),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 2),
 'QI-L2-HDT201', 'Hadith Sciences', 'Introduction to Mustalah al-Hadith and authentication principles.', 'Hadith', 4, 'Intermediate', 4),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 2),
 'QI-L2-TFS201', 'Tafsir Basics', 'Introduction to Quranic exegesis with selected Surahs.', 'Tafsir', 4, 'Intermediate', 5),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 2),
 'QI-L2-ARB201', 'Arabic Grammar for Quran', 'Essential Nahw rules for understanding Quranic Arabic.', 'Arabic', 4, 'Intermediate', 6);

-- QIRAT & ILM - LEVEL 3 (Advanced)
INSERT INTO courses (sector_id, level_id, code, title, description, category, estimated_weeks, difficulty_level, display_order) VALUES
((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 3),
 'QI-L3-QRT301', 'Qiraat Variations', 'Study of the seven/ten Qiraat and their transmission chains.', 'Qiraat', 6, 'Advanced', 1),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 3),
 'QI-L3-AQD301', 'Scholarly Aqida', 'Advanced theological discussions, refutations of deviant beliefs.', 'Aqida', 5, 'Advanced', 2),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 3),
 'QI-L3-USL301', 'Usul al-Fiqh', 'Principles of Islamic jurisprudence and legal theory.', 'Usul al-Fiqh', 6, 'Advanced', 3),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 3),
 'QI-L3-HDT301', 'Advanced Hadith Studies', 'Critical analysis of Hadith chains, narrator criticism, and authentication.', 'Hadith', 5, 'Advanced', 4),

((SELECT id FROM sectors WHERE code = 'QIRAT_ILM'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'QIRAT_ILM') AND level_number = 3),
 'QI-L3-TFS301', 'Advanced Tafsir', 'Comprehensive Tafsir methodology and detailed exegesis.', 'Tafsir', 6, 'Advanced', 5);

-- Continue with other sectors...
