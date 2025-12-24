-- Insert the 5 main sectors from the homepage
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

-- Create basic sector levels for each sector (3 levels each)
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