-- Add sample courses for all sectors Level 1 so enrollment works

-- TARBIYA & IDAD - Level 1 (Add 3 sample courses)
INSERT INTO courses (sector_id, level_id, code, title, description, category, estimated_weeks, difficulty_level, display_order) VALUES
((SELECT id FROM sectors WHERE code = 'TARBIYA_IDAD'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'TARBIYA_IDAD') AND level_number = 1),
 'TI-L1-AQD101', 'Youth-Friendly Aqida', 'Introduction to Islamic beliefs tailored for young Muslims.', 'Aqida', 3, 'Beginner', 1),

((SELECT id FROM sectors WHERE code = 'TARBIYA_IDAD'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'TARBIYA_IDAD') AND level_number = 1),
 'TI-L1-AKH101', 'Character Foundations', 'Building strong Islamic character and moral values.', 'Akhlaq', 3, 'Beginner', 2),

((SELECT id FROM sectors WHERE code = 'TARBIYA_IDAD'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'TARBIYA_IDAD') AND level_number = 1),
 'TI-L1-SRH101', 'Seerah Stories for Youth', 'Engaging stories from the life of Prophet Muhammad (PBUH).', 'Seerah', 3, 'Beginner', 3);

-- DAWAH & COMPARATIVE RELIGION - Level 1 (Add 3 sample courses)
INSERT INTO courses (sector_id, level_id, code, title, description, category, estimated_weeks, difficulty_level, display_order) VALUES
((SELECT id FROM sectors WHERE code = 'DAWAH_COMPARATIVE'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'DAWAH_COMPARATIVE') AND level_number = 1),
 'DC-L1-DWH101', 'Introduction to Dawah', 'Basics of Islamic propagation and calling to Islam.', 'Dawah', 3, 'Beginner', 1),

((SELECT id FROM sectors WHERE code = 'DAWAH_COMPARATIVE'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'DAWAH_COMPARATIVE') AND level_number = 1),
 'DC-L1-TWD101', 'Tawheed Essentials', 'Understanding the oneness of Allah and its implications.', 'Aqida', 3, 'Beginner', 2),

((SELECT id FROM sectors WHERE code = 'DAWAH_COMPARATIVE'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'DAWAH_COMPARATIVE') AND level_number = 1),
 'DC-L1-CMP101', 'World Religions Overview', 'Introduction to major world religions from Islamic perspective.', 'Comparative Religion', 3, 'Beginner', 3);

-- LITERATURE & HISTORY - Level 1 (Add 3 sample courses)
INSERT INTO courses (sector_id, level_id, code, title, description, category, estimated_weeks, difficulty_level, display_order) VALUES
((SELECT id FROM sectors WHERE code = 'LITERATURE_HISTORY'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'LITERATURE_HISTORY') AND level_number = 1),
 'LH-L1-SRH101', 'Makkan Period Seerah', 'Detailed study of the Makkan period of Prophet Muhammad (PBUH).', 'Seerah', 4, 'Beginner', 1),

((SELECT id FROM sectors WHERE code = 'LITERATURE_HISTORY'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'LITERATURE_HISTORY') AND level_number = 1),
 'LH-L1-SRH102', 'Madinan Period Seerah', 'Comprehensive study of the Madinan period.', 'Seerah', 4, 'Beginner', 2),

((SELECT id FROM sectors WHERE code = 'LITERATURE_HISTORY'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'LITERATURE_HISTORY') AND level_number = 1),
 'LH-L1-HIS101', 'Early Islamic History', 'History of Islam from the Prophet to the Rightly Guided Caliphs.', 'History', 4, 'Beginner', 3);

-- ZIYARA & KHIDMA - Level 1 (Add 3 sample courses)
INSERT INTO courses (sector_id, level_id, code, title, description, category, estimated_weeks, difficulty_level, display_order) VALUES
((SELECT id FROM sectors WHERE code = 'ZIYARA_KHIDMA'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'ZIYARA_KHIDMA') AND level_number = 1),
 'ZK-L1-ADH101', 'Daily Adhkar & Duas', 'Essential daily remembrances and supplications.', 'Adhkar', 2, 'Beginner', 1),

((SELECT id FROM sectors WHERE code = 'ZIYARA_KHIDMA'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'ZIYARA_KHIDMA') AND level_number = 1),
 'ZK-L1-VIS101', 'Visiting Masajid Etiquette', 'Proper etiquettes for visiting mosques according to Sunnah.', 'Fiqh', 2, 'Beginner', 2),

((SELECT id FROM sectors WHERE code = 'ZIYARA_KHIDMA'),
 (SELECT id FROM sector_levels WHERE sector_id = (SELECT id FROM sectors WHERE code = 'ZIYARA_KHIDMA') AND level_number = 1),
 'ZK-L1-SRV101', 'Community Service Basics', 'Introduction to Islamic community service and volunteering.', 'Khidma', 2, 'Beginner', 3);

SELECT 'Sample courses added for all sectors!' as message;
