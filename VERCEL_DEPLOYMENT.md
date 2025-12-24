
# 🚀 Vercel Deployment Guide

Complete guide for deploying HUMSJ LMS to Vercel

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database** - Use one of these:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (Recommended)
   - [Neon](https://neon.tech) (Free tier available)
   - [Supabase](https://supabase.com) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)

---

## 🗄️ Step 1: Setup Database

### Option A: Vercel Postgres (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose your region
5. Click "Create"
6. Copy the connection string

### Option B: Neon (Free Tier)

1. Go to [Neon Console](https://console.neon.tech)
2. Create new project
3. Copy the connection string
4. Format: `postgresql://user:password@host/database?sslmode=require`

### Option C: Supabase (Free Tier)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (Transaction mode)
5. Replace `[YOUR-PASSWORD]` with your actual password

---

## 📊 Step 2: Initialize Database

### Using Vercel Postgres

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables (includes DATABASE_URL)
vercel env pull .env.local

# Run database scripts
npm install -g @vercel/postgres
vercel postgres connect

# Then run these commands in the SQL console:
# Copy and paste content from:
# 1. scripts/create-complete-lms-structure.sql
# 2. scripts/seed-users-and-data.sql
```

### Using External Database (Neon/Supabase/Railway)

```bash
# Set your DATABASE_URL
export DATABASE_URL="your-connection-string-here"

# Run database scripts
psql $DATABASE_URL -f scripts/create-complete-lms-structure.sql
psql $DATABASE_URL -f scripts/seed-users-and-data.sql
```

---

## 🔐 Step 3: Generate JWT Secret

```bash
# Generate a secure random string (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output - this is your JWT_SECRET
```

---

## ⚙️ Step 4: Configure Environment Variables

### In Vercel Dashboard

1. Go to your project → Settings → Environment Variables
2. Add these variables:

```env
# Database (automatically added if using Vercel Postgres)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# JWT Secret (use the generated value from Step 3)
JWT_SECRET=your-generated-secret-here-minimum-32-characters

# App URL (will be your Vercel domain)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app

# Node Environment
NODE_ENV=production
```

### Important Notes:
- ✅ Set all variables for **Production**, **Preview**, and **Development**
- ✅ For `NEXT_PUBLIC_APP_URL`, use your actual Vercel domain after first deployment
- ✅ Keep `JWT_SECRET` secure and never commit it to Git

---

## 📦 Step 5: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

```bash
# Navigate to your project
cd app

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Method 2: Using Git Integration

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your repository
   - Configure project:
     - Framework Preset: **Next.js**
     - Root Directory: **app** (if your code is in app folder)
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Add environment variables (from Step 4)
   - Click "Deploy"

### Method 3: Using Vercel Desktop App

1. Download [Vercel Desktop](https://vercel.com/download)
2. Drag your `app` folder into Vercel
3. Configure environment variables
4. Click "Deploy"

---

## ✅ Step 6: Verify Deployment

After deployment completes:

### 1. Check Build Logs
- Look for any errors in the build process
- Verify all environment variables are set

### 2. Test the Application

Visit your Vercel URL and test:

```
✅ Homepage loads
✅ Login page accessible
✅ Can login as admin (admin.male@humsj.org / password123)
✅ Can login as mentor (mentor.male1@humsj.org / password123)
✅ Can login as student (student.male1@humsj.org / password123)
✅ Admin can create course
✅ Student sees course within 10 seconds
✅ Toast notifications appear (no browser alerts)
✅ Real-time updates work
```

### 3. Check Database Connection

```bash
# Using Vercel CLI
vercel logs --follow

# Look for successful database connections
# Should see: "Database connected successfully"
```

---

## 🔧 Step 7: Post-Deployment Configuration

### Update App URL

1. Copy your Vercel deployment URL (e.g., `https://humsj-lms.vercel.app`)
2. Go to Vercel Dashboard → Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` with your actual URL
4. Redeploy:
   ```bash
   vercel --prod
   ```

### Setup Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., `lms.humsj.org`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Redeploy

---

## 🔒 Step 8: Security Checklist

After deployment:

- [ ] Change all default passwords
- [ ] Verify HTTPS is enabled (automatic on Vercel)
- [ ] Test role-based access control
- [ ] Verify JWT authentication works
- [ ] Check that admin pages require admin role
- [ ] Test user impersonation security
- [ ] Review audit logs functionality

---

## 📊 Step 9: Monitor Your Application

### Vercel Analytics (Built-in)

1. Go to your project → Analytics
2. Monitor:
   - Page views
   - Response times
   - Error rates
   - Geographic distribution

### Check Logs

```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs

# Filter by function
vercel logs --filter=/api/auth/login
```

### Performance Monitoring

1. Go to project → Speed Insights
2. Monitor Core Web Vitals
3. Check for slow pages
4. Optimize as needed

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found`
```bash
# Solution: Install missing dependencies
npm install
npm run build  # Test locally first
```

**Error:** `Environment variable not found`
```bash
# Solution: Add missing environment variables in Vercel Dashboard
# Settings → Environment Variables
```

### Database Connection Issues

**Error:** `Connection refused`
```bash
# Solution: Check DATABASE_URL format
# Should include ?sslmode=require for most providers
postgresql://user:password@host:5432/database?sslmode=require
```

**Error:** `SSL required`
```bash
# Solution: Add SSL mode to connection string
# Add: ?sslmode=require
```

### Runtime Errors

**Error:** `JWT_SECRET not defined`
```bash
# Solution: Add JWT_SECRET in Vercel environment variables
# Must be at least 32 characters
```

**Error:** `Cannot find module`
```bash
# Solution: Check package.json dependencies
npm install
vercel --prod
```

---

## 🔄 Updating Your Deployment

### For Code Changes

```bash
# Method 1: Using CLI
git add .
git commit -m "Update feature"
git push origin main
# Vercel auto-deploys if Git integration is set up

# Method 2: Manual deployment
vercel --prod
```

### For Environment Variable Changes

1. Update in Vercel Dashboard
2. Redeploy:
   ```bash
   vercel --prod
   ```

### For Database Changes

```bash
# Connect to your database
psql $DATABASE_URL

# Run your SQL updates
\i path/to/your/migration.sql
```

---

## 📱 Step 10: Test on Mobile

After deployment, test on:

- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] iPad
- [ ] Android Tablet

Check:
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Forms are usable
- [ ] Navigation is smooth

---

## 🎯 Deployment Checklist

Before going live:

### Pre-Deployment
- [ ] Database created and seeded
- [ ] Environment variables configured
- [ ] JWT_SECRET generated (32+ characters)
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests pass

### Deployment
- [ ] Deployed to Vercel
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled (automatic)
- [ ] Environment variables set in Vercel

### Post-Deployment
- [ ] All login credentials tested
- [ ] Admin portal accessible
- [ ] Student dashboard working
- [ ] Mentor portal working
- [ ] Real-time updates verified
- [ ] Toast notifications working
- [ ] Mobile responsive checked
- [ ] Default passwords changed
- [ ] Monitoring enabled

---

## 📞 Quick Commands Reference

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Deploy to production
vercel --prod

# View logs
vercel logs --follow

# List deployments
vercel ls

# Remove deployment
vercel rm deployment-url
```

---

## 🎉 Success!

Your HUMSJ LMS is now live on Vercel! 🚀

### Next Steps:

1. **Share the URL** with your team
2. **Change default passwords** immediately
3. **Monitor the application** for the first 24 hours
4. **Collect user feedback**
5. **Plan next features**

### Default Login Credentials:

**Remember to change these!**

```
Admin (Male): admin.male@humsj.org / password123
Admin (Female): admin.female@humsj.org / password123

Mentor (Male): mentor.male1@humsj.org / password123
Mentor (Female): mentor.female1@humsj.org / password123

Student (Male): student.male1@humsj.org / password123
Student (Female): student.female1@humsj.org / password123
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Need Help?**

- Check `TROUBLESHOOTING.md` for common issues
- Review Vercel logs: `vercel logs --follow`
- Contact support: support@vercel.com

---

**Deployment Date:** December 23, 2024  
**Status:** ✅ READY FOR VERCEL DEPLOYMENT
