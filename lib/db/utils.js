import pool from './connection.js';
import bcrypt from 'bcryptjs';

// User authentication functions
export async function createUser(userData) {
  const {
    email,
    password,
    firstName,
    lastName,
    gender,
    department,
    academicYear,
    role = 'student'
  } = userData;

  try {
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, gender, department, academic_year, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name, gender, department, academic_year, role, level, created_at
    `;

    const values = [email, passwordHash, firstName, lastName, gender, department, academicYear, role];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

export async function authenticateUser(email, password) {
  try {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, gender, department, 
             academic_year, role, level, profile_photo, bio, is_active
      FROM users 
      WHERE email = $1 AND is_active = true
    `;

    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null; // User not found
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return null; // Invalid password
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Remove password hash from returned user object
    delete user.password_hash;
    
    return user;
  } catch (error) {
    throw new Error(`Error authenticating user: ${error.message}`);
  }
}

export async function getUserById(userId) {
  try {
    const query = `
      SELECT id, email, first_name, last_name, gender, department, academic_year, 
             role, level, profile_photo, bio, phone, enrollment_date, last_login
      FROM users 
      WHERE id = $1 AND is_active = true
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}

// Progress tracking functions
export async function getUserProgress(userId) {
  try {
    const query = `
      SELECT 
        ls.name as sector_name,
        ls.id as sector_id,
        up.progress_percentage,
        up.completed_modules,
        up.total_modules,
        up.last_accessed
      FROM user_progress up
      JOIN learning_sectors ls ON up.sector_id = ls.id
      WHERE up.user_id = $1
      ORDER BY ls.id
    `;

    const result = await pool.query(query, [userId]);
    
    // Convert to object format expected by frontend
    const progress = {
      dawah: 0,
      irshad: 0,
      tarbiya: 0,
      idad: 0
    };

    result.rows.forEach(row => {
      const sectorName = row.sector_name.toLowerCase();
      if (sectorName.includes('dawah')) {
        progress.dawah = row.progress_percentage;
      } else if (sectorName.includes('irshad') || sectorName.includes('qirat')) {
        progress.irshad = row.progress_percentage;
      } else if (sectorName.includes('tarbiya')) {
        progress.tarbiya = row.progress_percentage;
      } else if (sectorName.includes('idad')) {
        progress.idad = row.progress_percentage;
      }
    });

    return progress;
  } catch (error) {
    throw new Error(`Error fetching user progress: ${error.message}`);
  }
}

// Habit tracking functions
export async function getDailyHabits(userId, date = null) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT morning_adhkar, quran_reading, evening_adhkar, sadaqah, additional_notes
      FROM daily_habits 
      WHERE user_id = $1 AND habit_date = $2
    `;

    const result = await pool.query(query, [userId, targetDate]);
    
    if (result.rows.length === 0) {
      // Return default habits if none exist for the date
      return {
        morningAdhkar: false,
        quranReading: false,
        eveningAdhkar: false,
        sadaqah: false
      };
    }

    const habits = result.rows[0];
    return {
      morningAdhkar: habits.morning_adhkar,
      quranReading: habits.quran_reading,
      eveningAdhkar: habits.evening_adhkar,
      sadaqah: habits.sadaqah,
      additionalNotes: habits.additional_notes
    };
  } catch (error) {
    throw new Error(`Error fetching daily habits: ${error.message}`);
  }
}

export async function updateDailyHabits(userId, habits, date = null) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const query = `
      INSERT INTO daily_habits (user_id, habit_date, morning_adhkar, quran_reading, evening_adhkar, sadaqah)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, habit_date)
      DO UPDATE SET
        morning_adhkar = EXCLUDED.morning_adhkar,
        quran_reading = EXCLUDED.quran_reading,
        evening_adhkar = EXCLUDED.evening_adhkar,
        sadaqah = EXCLUDED.sadaqah,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      userId,
      targetDate,
      habits.morningAdhkar,
      habits.quranReading,
      habits.eveningAdhkar,
      habits.sadaqah
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating daily habits: ${error.message}`);
  }
}

// Mentorship functions
export async function getUserMentor(userId) {
  try {
    const query = `
      SELECT 
        u.first_name,
        u.last_name,
        u.email,
        u.bio,
        m.usrah_group,
        m.assigned_date
      FROM mentorship m
      JOIN users u ON m.mentor_id = u.id
      WHERE m.student_id = $1 AND m.is_active = true
    `;

    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const mentor = result.rows[0];
    return {
      name: `${mentor.first_name} ${mentor.last_name}`,
      contact: mentor.email,
      usrahGroup: mentor.usrah_group,
      assignedDate: mentor.assigned_date
    };
  } catch (error) {
    throw new Error(`Error fetching user mentor: ${error.message}`);
  }
}

// Submission functions
export async function getUserSubmissions(userId) {
  try {
    const query = `
      SELECT 
        s.id,
        s.submission_type,
        s.title,
        s.description,
        s.duration_seconds,
        s.submission_date,
        s.review_status,
        s.score,
        s.feedback,
        u.first_name || ' ' || u.last_name as instructor_name
      FROM idad_submissions s
      LEFT JOIN users u ON s.instructor_id = u.id
      WHERE s.user_id = $1
      ORDER BY s.submission_date DESC
    `;

    const result = await pool.query(query, [userId]);
    
    return result.rows.map(row => ({
      id: row.id,
      type: row.submission_type,
      title: row.title,
      description: row.description,
      submittedAt: row.submission_date.toISOString().split('T')[0],
      status: row.review_status,
      score: row.score,
      feedback: row.feedback,
      instructor: row.instructor_name,
      duration: formatDuration(row.duration_seconds)
    }));
  } catch (error) {
    throw new Error(`Error fetching user submissions: ${error.message}`);
  }
}

// Assignment functions
export async function getUserAssignments(userId) {
  try {
    const query = `
      SELECT 
        a.id,
        a.title,
        a.description,
        a.assignment_type,
        a.due_date,
        a.priority,
        ua.status
      FROM assignments a
      JOIN user_assignments ua ON a.id = ua.assignment_id
      WHERE ua.user_id = $1 AND a.is_active = true
      ORDER BY a.due_date ASC
    `;

    const result = await pool.query(query, [userId]);
    
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.assignment_type,
      dueDate: row.due_date.toISOString().split('T')[0],
      priority: row.priority,
      status: row.status
    }));
  } catch (error) {
    throw new Error(`Error fetching user assignments: ${error.message}`);
  }
}

// Islamic content functions
export async function getDailyVerse() {
  try {
    const query = `
      SELECT arabic_text, english_translation, surah_name_english, verse_number
      FROM quran_verses
      ORDER BY RANDOM()
      LIMIT 1
    `;

    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      return null;
    }

    const verse = result.rows[0];
    return {
      arabic: verse.arabic_text,
      translation: verse.english_translation,
      reference: `Quran ${verse.surah_name_english} ${verse.verse_number}`
    };
  } catch (error) {
    throw new Error(`Error fetching daily verse: ${error.message}`);
  }
}

export async function getDailyHadith() {
  try {
    const query = `
      SELECT english_translation, collection_name, narrator
      FROM hadith_collection
      ORDER BY RANDOM()
      LIMIT 1
    `;

    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      return null;
    }

    const hadith = result.rows[0];
    return {
      text: hadith.english_translation,
      reference: hadith.collection_name,
      narrator: hadith.narrator
    };
  } catch (error) {
    throw new Error(`Error fetching daily hadith: ${error.message}`);
  }
}

// Prayer times functions
export async function getPrayerTimes(location = 'Addis Ababa, Ethiopia', date = null) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT fajr, dhuhr, asr, maghrib, isha
      FROM prayer_times
      WHERE location = $1 AND date = $2
    `;

    const result = await pool.query(query, [location, targetDate]);
    
    if (result.rows.length === 0) {
      // Return default prayer times if not found
      return {
        fajr: '05:30',
        dhuhr: '12:15',
        asr: '15:45',
        maghrib: '18:20',
        isha: '19:45',
        location: location
      };
    }

    const times = result.rows[0];
    return {
      fajr: times.fajr,
      dhuhr: times.dhuhr,
      asr: times.asr,
      maghrib: times.maghrib,
      isha: times.isha,
      location: location
    };
  } catch (error) {
    throw new Error(`Error fetching prayer times: ${error.message}`);
  }
}

// Utility functions
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Database initialization
export async function initializeDatabase() {
  try {
    // Check if tables exist
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);

    if (result.rows.length === 0) {
      console.log('Database tables not found. Please run the schema.sql file first.');
      return false;
    }

    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}