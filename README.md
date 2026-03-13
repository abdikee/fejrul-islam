# Fejrul Islam - Dawah & Irshad Platform

Islamic Dawah and Irshad (Outreach & Guidance) Platform - A sector of Haramaya University Muslim Students Jem'a (HUMSJ)

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
- User management (participants, dais, admins)
- Program management (CRUD)
- Announcement management
- Resource management
- Sector management
- Audit logs
- Real-time updates

### Participant Dashboard
- Program enrollment
- Real-time announcements (15s polling)
- Real-time resources (30s polling)
- Real-time programs (10s polling)
- Progress tracking
- Gender-specific dashboards

### Dai (Mentor) Portal
- Participant management
- Dashboard with stats
- Guidance sessions
- Community engagement
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

## 🌐 Making This Repository Public

To change this repository's visibility from **private** to **public** on GitHub:

1. Go to your repository on GitHub.
2. Click **Settings** (top-right tab in the repository).
3. Scroll down to the **Danger Zone** section at the bottom.
4. Click **Change visibility** → **Change to public**.
5. Type the repository name to confirm, then click **I understand, make this repository public**.

> **Before making the repository public**, verify that:
> - No real credentials or secrets are committed (check your `.env` files are in `.gitignore`).
> - The `.env.example` file only contains placeholder/example values, not real secrets.
> - Any sensitive configuration is loaded from environment variables (e.g., `process.env.JWT_SECRET`).

---

## 📞 Support

For issues or questions, contact the development team.

---

## 📄 License

Proprietary - Fejrul Islam HUMSJ

---

**Version:** 1.0.0  
**Last Updated:** December 23, 2024
