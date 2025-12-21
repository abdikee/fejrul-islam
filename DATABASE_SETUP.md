# HUMSJ Database Setup Guide

This guide will help you set up the PostgreSQL database for the HUMSJ Islamic Education Platform.

## Prerequisites

1. **PostgreSQL Installation**
   - Install PostgreSQL 12 or higher
   - Make sure PostgreSQL service is running

2. **Node.js Dependencies**
   - Run `npm install` to install required packages

## Quick Setup

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
- Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE humsj_db;

# Create user
CREATE USER humsj_user WITH PASSWORD 'humsj_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE humsj_db TO humsj_user;

# Exit PostgreSQL
\q
```

### 3. Configure Environment Variables

Update your `.env.local` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=humsj_db
DB_USER=humsj_user
DB_PASSWORD=humsj_password
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 4. Run Database Setup Script

```bash
node scripts/setup-database.js
```

## Manual Setup (Alternative)

If the automated script doesn't work, you can set up manually:

### 1. Create Schema

```bash
psql -h localhost -U humsj_user -d humsj_db -f lib/db/schema.sql
```

### 2. Insert Seed Data

```bash
psql -h localhost -U humsj_user -d humsj_db -f lib/db/seed.sql
```

## Default Login Credentials

After setup, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | ahmed.hassan@student.edu | password123 |
| Mentor | sheikh.abdullah@humsj.edu | password123 |
| Admin | admin@humsj.edu | password123 |

⚠️ **Important:** Change these passwords in production!

## Database Schema Overview

The database includes the following main tables:

### Core Tables
- `users` - Student, mentor, and admin accounts
- `learning_sectors` - Four main learning areas (Dawah, Irshad, Tarbiya, Idad)
- `courses` - Individual courses within sectors
- `user_progress` - Student progress tracking

### Islamic Content
- `quran_verses` - Quranic verses with translations
- `hadith_collection` - Authentic hadith collection
- `prayer_times` - Location-based prayer schedules
- `islamic_events` - Islamic calendar events

### Learning Management
- `assignments` - Course assignments
- `idad_submissions` - Student video/audio submissions
- `user_assignments` - Assignment tracking
- `daily_habits` - Tarbiya habit tracking

### Communication
- `messages` - Internal messaging system
- `mentorship` - Mentor-student relationships
- `counseling_sessions` - Counseling appointments
- `announcements` - System announcements

### Resources
- `resources` - Downloadable materials and PDFs

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL Status:**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Verify Database Exists:**
   ```bash
   psql -U humsj_user -d humsj_db -c "SELECT version();"
   ```

3. **Check User Permissions:**
   ```bash
   psql -U postgres -c "\du"
   ```

### Common Errors

**Error: `ECONNREFUSED`**
- PostgreSQL is not running
- Wrong host/port in configuration
- Firewall blocking connection

**Error: `authentication failed`**
- Wrong username/password
- User doesn't have database access
- Check pg_hba.conf configuration

**Error: `database does not exist`**
- Database wasn't created
- Wrong database name in configuration

### Reset Database

To completely reset the database:

```bash
# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS humsj_db;"
sudo -u postgres psql -c "CREATE DATABASE humsj_db;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE humsj_db TO humsj_user;"

# Run setup script again
node scripts/setup-database.js
```

## Production Considerations

1. **Security:**
   - Use strong, unique passwords
   - Enable SSL connections
   - Restrict database access by IP
   - Regular security updates

2. **Performance:**
   - Configure appropriate memory settings
   - Set up connection pooling
   - Monitor query performance
   - Regular VACUUM and ANALYZE

3. **Backup:**
   - Set up automated backups
   - Test restore procedures
   - Store backups securely off-site

4. **Monitoring:**
   - Monitor database performance
   - Set up alerts for issues
   - Log slow queries
   - Track resource usage

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review PostgreSQL logs: `/var/log/postgresql/`
3. Verify environment variables in `.env.local`
4. Ensure all dependencies are installed

For additional help, consult the PostgreSQL documentation or contact the development team.