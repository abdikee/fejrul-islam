-- Create messaging system tables for Fejrul Islam
-- Simplified version to avoid foreign key issues

-- Messages table for storing all messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'direct' CHECK (message_type IN ('direct', 'admin_broadcast', 'system', 'support')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    parent_message_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL
);

-- Conversations table for organizing messages
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    conversation_type VARCHAR(50) DEFAULT 'direct' CHECK (conversation_type IN ('direct', 'group', 'support', 'admin')),
    created_by INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin message templates
CREATE TABLE IF NOT EXISTS admin_message_templates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    template_type VARCHAR(50) DEFAULT 'general' CHECK (template_type IN ('general', 'welcome', 'announcement', 'reminder', 'warning')),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);

-- Insert default admin message templates
INSERT INTO admin_message_templates (title, subject, content, template_type, created_by) VALUES
(
    'Welcome Message',
    'Welcome to Fejrul Islam - Dawah & Irshad Sector',
    'Assalamu Alaikum and welcome to Fejrul Islam!

We are delighted to have you join our community dedicated to spreading the beautiful message of Islam through wisdom and good counsel.

As a member of our Dawah & Irshad sector, you now have access to:
- Educational programs and courses
- Mentorship opportunities
- Community events and activities
- Islamic resources and materials
- Direct communication with mentors and administrators

If you have any questions or need assistance, please don''t hesitate to reach out to our admin team.

May Allah bless your journey with us.

Barakallahu feeki/feek,
Fejrul Islam Admin Team',
    'welcome',
    1
),
(
    'Course Enrollment Confirmation',
    'Course Enrollment Confirmed',
    'Assalamu Alaikum,

This message confirms your successful enrollment in: {COURSE_NAME}

Course Details:
- Start Date: {START_DATE}
- Duration: {DURATION}
- Instructor: {INSTRUCTOR}
- Sector: {SECTOR}

You can access your course materials through your dashboard. If you have any questions about the course content or schedule, please contact your assigned mentor.

Barakallahu feeki/feek,
Fejrul Islam Admin Team',
    'general',
    1
),
(
    'System Maintenance Notice',
    'Scheduled System Maintenance',
    'Assalamu Alaikum,

We would like to inform you about scheduled system maintenance:

Date: {MAINTENANCE_DATE}
Time: {MAINTENANCE_TIME}
Duration: {MAINTENANCE_DURATION}

During this time, the platform may be temporarily unavailable. We apologize for any inconvenience and appreciate your patience.

If you have urgent matters, please contact us via alternative communication methods.

Jazakallahu khairan,
Fejrul Islam Technical Team',
    'announcement',
    1
)
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_message_templates_updated_at ON admin_message_templates;
CREATE TRIGGER update_admin_message_templates_updated_at BEFORE UPDATE ON admin_message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample messages for testing (optional)
INSERT INTO messages (sender_id, recipient_id, subject, content, message_type, priority) VALUES
(1, 2, 'Welcome to Fejrul Islam', 'Assalamu Alaikum! Welcome to our Islamic learning platform. We are excited to have you join our community.', 'admin_broadcast', 'normal'),
(1, 3, 'Course Assignment Available', 'Your new course assignment for Qirat & Ilm is now available. Please check your dashboard for details.', 'system', 'normal')
ON CONFLICT DO NOTHING;

COMMIT;