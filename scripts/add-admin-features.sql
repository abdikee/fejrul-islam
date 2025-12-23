-- Add role column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student';

-- Create audit_logs table for tracking all system actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action_type VARCHAR(50) NOT NULL,
  action_description TEXT NOT NULL,
  target_type VARCHAR(50),
  target_id VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create system_settings table for global configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string',
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create content_management table for homepage and global content
CREATE TABLE IF NOT EXISTS content_management (
  id SERIAL PRIMARY KEY,
  content_key VARCHAR(100) UNIQUE NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  image_url VARCHAR(500),
  metadata JSONB,
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create impersonation_sessions table for admin impersonation tracking
CREATE TABLE IF NOT EXISTS impersonation_sessions (
  id SERIAL PRIMARY KEY,
  admin_id UUID REFERENCES users(id) NOT NULL,
  target_user_id UUID REFERENCES users(id) NOT NULL,
  reason TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  ip_address VARCHAR(45),
  actions_performed JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_impersonation_admin_id ON impersonation_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_impersonation_target_user_id ON impersonation_sessions(target_user_id);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
  ('site_name', 'Fejrul Islam HUMSJ', 'string', 'Website name'),
  ('site_description', 'Islamic Education Platform', 'string', 'Website description'),
  ('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
  ('registration_enabled', 'true', 'boolean', 'Allow new user registrations'),
  ('max_upload_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default homepage content
INSERT INTO content_management (content_key, content_type, title, content, status) VALUES
  ('homepage_hero_title', 'text', 'Welcome to Fejrul Islam HUMSJ', 'Empowering Muslim Youth Through Islamic Education', 'published'),
  ('homepage_hero_subtitle', 'text', 'Join Our Community', 'Learn, Grow, and Serve with Purpose', 'published'),
  ('about_us_content', 'html', 'About Us', '<p>Fejrul Islam HUMSJ is dedicated to providing comprehensive Islamic education...</p>', 'published'),
  ('knowledge_series_intro', 'html', 'Knowledge Series', '<p>Explore our curated collection of Islamic knowledge...</p>', 'published')
ON CONFLICT (content_key) DO NOTHING;

-- Update existing admin user (if exists)
UPDATE users SET role = 'admin' WHERE email LIKE '%admin%' OR id = (SELECT id FROM users LIMIT 1);

-- Create function to log actions automatically
CREATE OR REPLACE FUNCTION log_user_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action_type, action_description, target_type, target_id, metadata)
  VALUES (
    NEW.id,
    TG_OP,
    'User ' || TG_OP || ' operation',
    TG_TABLE_NAME,
    NEW.id::TEXT,
    row_to_json(NEW)::JSONB
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE audit_logs IS 'Tracks all user actions for security and auditing';
COMMENT ON TABLE system_settings IS 'Global system configuration settings';
COMMENT ON TABLE content_management IS 'Manages homepage and global content';
COMMENT ON TABLE impersonation_sessions IS 'Tracks admin impersonation sessions for security';
