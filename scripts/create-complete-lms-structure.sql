-- ============================================================================
-- FEJRUL ISLAM HUMSJ - COMPLETE LMS DATABASE STRUCTURE
-- Senior LMS Architecture with Islamic Curriculum Design
-- ============================================================================

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS student_exam_attempts CASCADE;
DROP TABLE IF EXISTS student_course_progress CASCADE;
DROP TABLE IF EXISTS student_level_enrollments CASCADE;
DROP TABLE IF EXISTS student_sector_enrollments CASCADE;
DROP TABLE IF EXISTS course_exams CASCADE;
DROP TABLE IF EXISTS course_books CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS sector_levels CASCADE;
DROP TABLE IF EXISTS sectors CASCADE;

-- ============================================================================
-- 1. SECTORS TABLE
-- ============================================================================
CREATE TABLE sectors (
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

-- ============================================================================
-- 2. SECTOR LEVELS TABLE (3 levels per sector)
-- ============================================================================
CREATE TABLE sector_levels (
  id SERIAL PRIMARY KEY,
  sector_id INTEGER REFERENCES sectors(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL CHECK (level_number IN (1, 2, 3)),
  level_name VARCHAR(100) NOT NULL, -- Beginner, Intermediate, Advanced
  description TEXT,
  prerequisites TEXT,
  learning_outcomes TEXT,
  estimated_duration_weeks INTEGER,
  min_pass_percentage DECIMAL(5,2) DEFAULT 60.00,
  has_level_final_exam BOOLEAN DEFAULT false,
  level_final_exam_questions INTEGER,
  level_final_exam_pass_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(sector_id, level_number)
);

-- ============================================================================
-- 3. COURSES TABLE
-- ============================================================================
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  sector_id INTEGER REFERENCES sectors(id) ON DELETE CASCADE,
  level_id INTEGER REFERENCES sector_levels(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- Aqida, Hadith, Fiqh, etc.
  credit_hours INTEGER DEFAULT 3,
  estimated_weeks INTEGER DEFAULT 8,
  difficulty_level VARCHAR(50), -- Beginner, Intermediate, Advanced
  language VARCHAR(50) DEFAULT 'English',
  prerequisites TEXT,
  learning_objectives TEXT,
  syllabus TEXT,
  instructor_notes TEXT,
  
  -- Course Pass Rules
  min_overall_pass_percentage DECIMAL(5,2) DEFAULT 60.00,
  require_all_exams_attempted BOOLEAN DEFAULT true,
  require_final_exam_pass BOOLEAN DEFAULT true,
  
  -- Display & Status
  thumbnail_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 4. COURSE BOOKS/RESOURCES TABLE
-- ============================================================================
CREATE TABLE course_books (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  author VARCHAR(200),
  language VARCHAR(50) DEFAULT 'English',
  book_type VARCHAR(50), -- Primary, Reference, Supplementary
  isbn VARCHAR(50),
  publisher VARCHAR(200),
  publication_year INTEGER,
  pages INTEGER,
  download_url VARCHAR(500),
  purchase_url VARCHAR(500),
  notes TEXT,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 5. COURSE EXAMS TABLE (4 types per course)
-- ============================================================================
CREATE TABLE course_exams (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  exam_type VARCHAR(50) NOT NULL, -- test, mid, assignment, final
  exam_title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Exam Configuration
  question_count INTEGER NOT NULL,
  duration_minutes INTEGER,
  min_pass_percentage DECIMAL(5,2) NOT NULL,
  exam_weight DECIMAL(5,2) NOT NULL, -- Percentage of final grade (e.g., 20.00 for 20%)
  max_attempts INTEGER DEFAULT 1,
  
  -- Exam Content
  instructions TEXT,
  question_bank_id INTEGER, -- Reference to question bank (future)
  
  -- Scheduling
  available_from TIMESTAMP,
  available_until TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(course_id, exam_type),
  CHECK (exam_type IN ('test', 'mid', 'assignment', 'final')),
  CHECK (exam_weight >= 0 AND exam_weight <= 100)
);

-- ============================================================================
-- 6. STUDENT SECTOR ENROLLMENTS
-- ============================================================================
CREATE TABLE student_sector_enrollments (
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

-- ============================================================================
-- 7. STUDENT LEVEL ENROLLMENTS
-- ============================================================================
CREATE TABLE student_level_enrollments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sector_id INTEGER REFERENCES sectors(id) ON DELETE CASCADE,
  level_id INTEGER REFERENCES sector_levels(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP DEFAULT NOW(),
  level_status VARCHAR(50) DEFAULT 'in_progress', -- not_started, in_progress, completed
  completion_date TIMESTAMP,
  overall_grade DECIMAL(5,2),
  level_final_exam_score DECIMAL(5,2),
  level_final_exam_passed BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);

-- ============================================================================
-- 8. STUDENT COURSE PROGRESS
-- ============================================================================
CREATE TABLE student_course_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP DEFAULT NOW(),
  
  -- Progress Tracking
  course_status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, completed, failed
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER,
  
  -- Exam Scores
  test_score DECIMAL(5,2),
  test_passed BOOLEAN,
  mid_score DECIMAL(5,2),
  mid_passed BOOLEAN,
  assignment_score DECIMAL(5,2),
  assignment_passed BOOLEAN,
  final_score DECIMAL(5,2),
  final_passed BOOLEAN,
  
  -- Overall Grade Calculation
  overall_grade DECIMAL(5,2),
  course_passed BOOLEAN DEFAULT false,
  completion_date TIMESTAMP,
  
  -- Timestamps
  last_accessed TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, course_id)
);

-- ============================================================================
-- 9. STUDENT EXAM ATTEMPTS
-- ============================================================================
CREATE TABLE student_exam_attempts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  exam_id INTEGER REFERENCES course_exams(id) ON DELETE CASCADE,
  
  -- Attempt Details
  attempt_number INTEGER NOT NULL,
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  
  -- Scoring
  score DECIMAL(5,2),
  max_score DECIMAL(5,2),
  percentage DECIMAL(5,2),
  passed BOOLEAN,
  
  -- Exam Data
  answers JSONB, -- Store student answers
  grading_details JSONB, -- Store detailed grading info
  
  -- Status
  attempt_status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, submitted, graded
  graded_by UUID REFERENCES users(id),
  graded_at TIMESTAMP,
  feedback TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, exam_id, attempt_number)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Sector and Level indexes
CREATE INDEX idx_sectors_code ON sectors(code);
CREATE INDEX idx_sectors_active ON sectors(is_active);
CREATE INDEX idx_sector_levels_sector ON sector_levels(sector_id);
CREATE INDEX idx_sector_levels_level ON sector_levels(level_number);

-- Course indexes
CREATE INDEX idx_courses_sector ON courses(sector_id);
CREATE INDEX idx_courses_level ON courses(level_id);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_active ON courses(is_active);

-- Enrollment indexes
CREATE INDEX idx_student_sector_user ON student_sector_enrollments(user_id);
CREATE INDEX idx_student_sector_sector ON student_sector_enrollments(sector_id);
CREATE INDEX idx_student_sector_status ON student_sector_enrollments(sector_status);

CREATE INDEX idx_student_level_user ON student_level_enrollments(user_id);
CREATE INDEX idx_student_level_level ON student_level_enrollments(level_id);
CREATE INDEX idx_student_level_status ON student_level_enrollments(level_status);

CREATE INDEX idx_student_course_user ON student_course_progress(user_id);
CREATE INDEX idx_student_course_course ON student_course_progress(course_id);
CREATE INDEX idx_student_course_status ON student_course_progress(course_status);

CREATE INDEX idx_exam_attempts_user ON student_exam_attempts(user_id);
CREATE INDEX idx_exam_attempts_exam ON student_exam_attempts(exam_id);
CREATE INDEX idx_exam_attempts_status ON student_exam_attempts(attempt_status);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sector_levels_updated_at BEFORE UPDATE ON sector_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_exams_updated_at BEFORE UPDATE ON course_exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_sector_enrollments_updated_at BEFORE UPDATE ON student_sector_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_level_enrollments_updated_at BEFORE UPDATE ON student_level_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_course_progress_updated_at BEFORE UPDATE ON student_course_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT 'Complete LMS structure created successfully!' as message;
