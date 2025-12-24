-- Setup script for enrollment system
-- Run this to ensure all required tables and data exist

-- 1. Create sectors table if it doesn't exist
CREATE TABLE IF NOT EXISTS sectors (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  focus_areas TEXT,
  icon VARCHAR(50),
  color VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create sector_levels table if it doesn't exist
CREATE TABLE IF NOT EXISTS sector_levels (
  id SERIAL PRIMARY KEY,
  sector_id INTEGER REFERENCES sectors(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL CHECK (level_number IN (1, 2, 3)),
  level_name VARCHAR(100) NOT NULL,
  description TEXT,
  requirements TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(sector_id, level_number)
);

-- 3. Create student_sector_enrollments table if it doesn't exist
CREATE TABLE IF NOT EXISTS student_sector_enrollments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sector_id INTEGER REFERENCES sectors(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP DEFAULT NOW(),
  current_level_id INTEGER REFERENCES sector_levels(id),
  sector_status VARCHAR(50) DEFAULT 'active', -- active, completed, suspended
  completion_date TIMESTAMP,
  motivation TEXT,
  study_hours_per_week VARCHAR(20),
  previous_knowledge TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, sector_id)
);

-- 4. Insert the 5 main sectors
INSERT INTO sectors (code, name, description, focus_areas, icon, color, display_order) VALUES
(
  'qirat-ilm',
  'Qirat & Ilm',
  'Quranic Recitation & Islamic Knowledge',
  'Quranic recitation, Islamic sciences, memorization, tajweed',
  'BookOpen',
  'emerald',
  1
),
(
  'literature-history',
  'Literature & History',
  'Islamic Heritage & Creative Expression',
  'Islamic literature, history, poetry, creative writing',
  'FileText',
  'amber',
  2
),
(
  'dawah-comparative-religion',
  'Dawah & Comparative Religion',
  'Outreach, Dialogue & Intellectual Defense',
  'Dawah methods, comparative religion, interfaith dialogue, apologetics',
  'MessageSquare',
  'blue',
  3
),
(
  'tarbiya-idad',
  'Tarbiya & Idad',
  'Character Building & Leadership Training',
  'Character development, spiritual purification, leadership training',
  'Heart',
  'rose',
  4
),
(
  'ziyara',
  'Ziyara',
  'Student Welfare & Community Support',
  'Student welfare, community support, social services, counseling',
  'Heart',
  'purple',
  5
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  focus_areas = EXCLUDED.focus_areas,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- 5. Create basic sector levels for each sector (3 levels each)
INSERT INTO sector_levels (sector_id, level_number, level_name, description, requirements) 
SELECT 
  s.id,
  level_num,
  CASE 
    WHEN level_num = 1 THEN 'Foundation'
    WHEN level_num = 2 THEN 'Intermediate' 
    WHEN level_num = 3 THEN 'Advanced'
  END,
  CASE 
    WHEN level_num = 1 THEN 'Basic introduction and foundational concepts'
    WHEN level_num = 2 THEN 'Intermediate study with practical application'
    WHEN level_num = 3 THEN 'Advanced mastery and leadership preparation'
  END,
  CASE 
    WHEN level_num = 1 THEN 'Basic Islamic knowledge'
    WHEN level_num = 2 THEN 'Completion of Foundation level'
    WHEN level_num = 3 THEN 'Completion of Intermediate level'
  END
FROM sectors s
CROSS JOIN (SELECT 1 as level_num UNION SELECT 2 UNION SELECT 3) levels
ON CONFLICT (sector_id, level_number) DO NOTHING;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_sector_user ON student_sector_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_student_sector_sector ON student_sector_enrollments(sector_id);
CREATE INDEX IF NOT EXISTS idx_student_sector_status ON student_sector_enrollments(sector_status);
CREATE INDEX IF NOT EXISTS idx_sectors_code ON sectors(code);
CREATE INDEX IF NOT EXISTS idx_sectors_active ON sectors(is_active);

-- 7. Create update trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_sectors_updated_at ON sectors;
CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_student_sector_enrollments_updated_at ON student_sector_enrollments;
CREATE TRIGGER update_student_sector_enrollments_updated_at BEFORE UPDATE ON student_sector_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Verify the setup
SELECT 'Setup completed successfully!' as status;
SELECT 'Sectors created:' as info, COUNT(*) as count FROM sectors;
SELECT 'Sector levels created:' as info, COUNT(*) as count FROM sector_levels;

-- Show the sectors that were created
SELECT code, name, description FROM sectors ORDER BY display_order;