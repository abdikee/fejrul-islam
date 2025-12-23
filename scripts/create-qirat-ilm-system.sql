-- Qirat and Ilm Course System Database Schema

-- 1. Course Levels Table
CREATE TABLE IF NOT EXISTS qirat_levels (
  id SERIAL PRIMARY KEY,
  level_number INTEGER NOT NULL UNIQUE CHECK (level_number IN (1, 2, 3)),
  level_name VARCHAR(100) NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Books Table (10 books per level across 6 categories)
CREATE TABLE IF NOT EXISTS qirat_books (
  id SERIAL PRIMARY KEY,
  level_id INTEGER NOT NULL REFERENCES qirat_levels(id),
  book_number INTEGER NOT NULL CHECK (book_number BETWEEN 1 AND 10),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Aqida', 'Hadis', 'Musxalah', 'Fiqh', 'Nahw', 'Sira')),
  description TEXT,
  content TEXT,
  pdf_url VARCHAR(500),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(level_id, book_number)
);

-- 3. Daily Tests Table
CREATE TABLE IF NOT EXISTS qirat_daily_tests (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES qirat_books(id) ON DELETE CASCADE,
  test_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  questions JSONB NOT NULL, -- Array of 10 questions with options
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(book_id, test_number)
);

-- 4. Assignments Table
CREATE TABLE IF NOT EXISTS qirat_assignments (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES qirat_books(id) ON DELETE CASCADE,
  assignment_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMP,
  max_score INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(book_id, assignment_number)
);

-- 5. Mid Exams Table (25 questions per level)
CREATE TABLE IF NOT EXISTS qirat_mid_exams (
  id SERIAL PRIMARY KEY,
  level_id INTEGER NOT NULL REFERENCES qirat_levels(id),
  title VARCHAR(255) NOT NULL,
  questions JSONB NOT NULL, -- Array of 25 questions
  passing_score INTEGER DEFAULT 70,
  duration_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Final Exams Table (50 questions per level)
CREATE TABLE IF NOT EXISTS qirat_final_exams (
  id SERIAL PRIMARY KEY,
  level_id INTEGER NOT NULL REFERENCES qirat_levels(id),
  title VARCHAR(255) NOT NULL,
  questions JSONB NOT NULL, -- Array of 50 questions
  passing_score INTEGER DEFAULT 70,
  duration_minutes INTEGER DEFAULT 120,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. User Progress Table
CREATE TABLE IF NOT EXISTS qirat_user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 3),
  current_book INTEGER DEFAULT 1 CHECK (current_book BETWEEN 1 AND 10),
  level_1_completed BOOLEAN DEFAULT false,
  level_2_completed BOOLEAN DEFAULT false,
  level_3_completed BOOLEAN DEFAULT false,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- 8. Daily Test Submissions
CREATE TABLE IF NOT EXISTS qirat_daily_test_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id INTEGER NOT NULL REFERENCES qirat_daily_tests(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, test_id)
);

-- 9. Assignment Submissions
CREATE TABLE IF NOT EXISTS qirat_assignment_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id INTEGER NOT NULL REFERENCES qirat_assignments(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_url VARCHAR(500),
  score INTEGER,
  feedback TEXT,
  graded_by UUID REFERENCES users(id),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  graded_at TIMESTAMP,
  UNIQUE(user_id, assignment_id)
);

-- 10. Mid Exam Submissions
CREATE TABLE IF NOT EXISTS qirat_mid_exam_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id INTEGER NOT NULL REFERENCES qirat_mid_exams(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id)
);

-- 11. Final Exam Submissions
CREATE TABLE IF NOT EXISTS qirat_final_exam_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id INTEGER NOT NULL REFERENCES qirat_final_exams(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id)
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_qirat_books_level ON qirat_books(level_id);
CREATE INDEX IF NOT EXISTS idx_qirat_books_category ON qirat_books(category);
CREATE INDEX IF NOT EXISTS idx_qirat_user_progress_user ON qirat_user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_qirat_daily_submissions_user ON qirat_daily_test_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_qirat_assignment_submissions_user ON qirat_assignment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_qirat_mid_submissions_user ON qirat_mid_exam_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_qirat_final_submissions_user ON qirat_final_exam_submissions(user_id);

-- Insert Default Levels
INSERT INTO qirat_levels (level_number, level_name, description, passing_score) VALUES
(1, 'Level 1 - Foundation', 'Introduction to Islamic Sciences', 70),
(2, 'Level 2 - Intermediate', 'Deepening Islamic Knowledge', 70),
(3, 'Level 3 - Advanced', 'Mastery of Islamic Sciences', 70)
ON CONFLICT (level_number) DO NOTHING;

SELECT 'Qirat and Ilm Course System tables created successfully!' as status;
