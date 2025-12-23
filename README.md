# HUMSJ Learning Management System

Islamic Learning Management System for Fejrul Islam HUMSJ

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Run database scripts in order:
psql -U your_user -d your_db -f scripts/create-complete-lms-structure.sql
psql -U your_user -d your_db -f scripts/seed-users-and-data.sql
```

### 3. Configure Environment
Create `.env.local`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/humsj_lms
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 👥 Default Login Credentials

**Password for all users:** `password123`

### Admins
- Male: `admin.male@humsj.org`
- Female: `admin.female@humsj.org`

### Mentors
- Male: `mentor.male1@humsj.org`
- Female: `mentor.female1@humsj.org`

### Students
- Male: `student.male1@humsj.org`
- Female: `student.female1@humsj.org`

---

## 📁 Project Structure

```
app/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin portal
│   ├── mentor/            # Mentor portal
│   ├── dashboard/         # Student dashboard
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # React components
├── lib/                   # Utilities and helpers
├── scripts/               # Database scripts
└── public/                # Static files
```

---

## 🎯 Features

### Admin Portal
- User management (students, mentors, admins)
- Course management (CRUD)
- Announcement management
- Resource management
- Sector management
- Audit logs
- Real-time updates

### Student Dashboard
- Course enrollment
- Real-time announcements (15s polling)
- Real-time resources (30s polling)
- Real-time courses (10s polling)
- Progress tracking
- Gender-specific dashboards

### Mentor Portal
- Student management
- Dashboard with stats
- Assignments (structure ready)
- Sessions management
- Analytics

---

## 🔧 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

---

## 📦 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t humsj-lms .
docker run -p 3000:3000 --env-file .env humsj-lms
```

### PM2
```bash
npm run build
pm2 start npm --name "humsj-lms" -- start
```

---

## 📚 Documentation

- `DATABASE_SETUP.md` - Database schema and setup
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `TROUBLESHOOTING.md` - Common issues and solutions

---

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection

---

## 📞 Support

For issues or questions, contact the development team.

---

## 📄 License

Proprietary - Fejrul Islam HUMSJ

---

**Version:** 1.0.0  
**Last Updated:** December 23, 2024
