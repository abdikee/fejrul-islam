#!/bin/bash

# ============================================
# HUMSJ LMS Database Setup Script
# ============================================

echo "🚀 HUMSJ LMS Database Setup"
echo "================================"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: PostgreSQL (psql) is not installed"
    echo "Please install PostgreSQL first"
    exit 1
fi

# Get database credentials
read -p "Enter database host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter database port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Enter database name: " DB_NAME
if [ -z "$DB_NAME" ]; then
    echo "❌ Database name is required"
    exit 1
fi

read -p "Enter database user: " DB_USER
if [ -z "$DB_USER" ]; then
    echo "❌ Database user is required"
    exit 1
fi

read -sp "Enter database password: " DB_PASS
echo ""

# Export password for psql
export PGPASSWORD=$DB_PASS

echo ""
echo "📊 Setting up database..."
echo ""

# Run database scripts
echo "1️⃣ Creating database structure..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/create-complete-lms-structure.sql

if [ $? -eq 0 ]; then
    echo "✅ Database structure created successfully"
else
    echo "❌ Error creating database structure"
    exit 1
fi

echo ""
echo "2️⃣ Seeding initial data..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/seed-users-and-data.sql

if [ $? -eq 0 ]; then
    echo "✅ Initial data seeded successfully"
else
    echo "❌ Error seeding data"
    exit 1
fi

# Unset password
unset PGPASSWORD

echo ""
echo "================================"
echo "✅ Database setup complete!"
echo ""
echo "📝 Default Login Credentials:"
echo "   Password for all users: password123"
echo ""
echo "   Male Admin:   admin.male@humsj.org"
echo "   Female Admin: admin.female@humsj.org"
echo ""
echo "   Male Mentor:   mentor.male1@humsj.org"
echo "   Female Mentor: mentor.female1@humsj.org"
echo ""
echo "   Male Student:   student.male1@humsj.org"
echo "   Female Student: student.female1@humsj.org"
echo ""
echo "🔐 Remember to change these passwords in production!"
echo "================================"
