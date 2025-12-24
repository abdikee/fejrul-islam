# Unified Login System with Gender-Specific Registration

## System Overview

The authentication system now provides:
- **One unified login page** for all users (students, mentors, admins)
- **Gender-specific registration** (Brothers and Sisters portals)
- **Automatic role-based routing** after login
- **Seamless enrollment integration**

## Authentication Flow

### 1. Registration (Gender-Specific)
- **Brothers Registration**: `/auth/signup/male`
- **Sisters Registration**: `/auth/signup/female`
- **Gender Selection**: `/auth/signup` (shows both options)

### 2. Login (Unified)
- **Single Login Page**: `/auth/login`
- **Automatic Routing**: Based on user role and gender
- **Return URL Support**: Preserves intended destination

### 3. Dashboard Routing
After successful login, users are automatically redirected to:
- **Students**: `/dashboard/male` or `/dashboard/female`
- **Mentors**: `/mentor/dashboard`
- **Admins**: `/admin/dashboard`

## Enrollment Integration

### Homepage Enrollment Flow
1. User clicks "Quick Enroll" on any sector
2. If not authenticated → Redirected to `/auth/login`
3. After login → Automatic enrollment + redirect to dashboard
4. Success message shown with enrolled sector

### Enrollment Button Behavior
```javascript
// Unified login redirect
if (!user) {
  router.push(`/auth/login?returnUrl=${currentUrl}`);
}
```

### Protected Content Access
```javascript
// EnrollmentGate component
<EnrollmentGate
  programType="sector"
  programId="qirat-ilm"
  programName="Qirat & Ilm"
>
  {/* Protected content */}
</EnrollmentGate>
```

## User Experience

### For New Users
1. **Homepage** → Click "Quick Enroll"
2. **Login Page** → Click "Create Account"
3. **Gender Selection** → Choose Brothers/Sisters portal
4. **Registration** → Complete gender-specific form
5. **Email Verification** → Verify account
6. **Auto-redirect** → Back to enrollment flow
7. **Dashboard** → See enrolled sector with success message

### For Existing Users
1. **Homepage** → Click "Quick Enroll"
2. **Login Page** → Enter credentials
3. **Auto-enrollment** → Sector added automatically
4. **Dashboard** → Redirected with success message

## Technical Implementation

### Login API Response
```javascript
{
  success: true,
  user: { id, email, role, gender, ... },
  redirectUrl: "/dashboard/male" | "/mentor/dashboard" | "/admin/dashboard"
}
```

### Enrollment API Integration
```javascript
// POST /api/enrollment/enroll
{
  programType: "sector",
  programId: "qirat-ilm",
  enrollmentData: { source: "homepage_quick_enroll" }
}
```

### Database Structure
- **Users Table**: Includes role and gender fields
- **Sectors Table**: Program definitions with codes
- **Student_Sector_Enrollments**: Enrollment records

## Benefits

### 1. Simplified Login
- One login form for all user types
- No confusion about which portal to use
- Automatic routing based on user profile

### 2. Preserved Gender Separation
- Brothers and Sisters have separate registration
- Gender-specific dashboards maintained
- Islamic organizational structure respected

### 3. Seamless Enrollment
- One-click enrollment from homepage
- Automatic authentication handling
- Return URL preservation

### 4. Role-Based Access
- Students → Gender-specific dashboards
- Mentors → Mentor portal
- Admins → Admin panel

## File Structure

### Authentication Pages
```
/auth/
├── login/page.js          # Unified login
├── signup/page.js         # Gender selection
├── signup/male/page.js    # Brothers registration
└── signup/female/page.js  # Sisters registration
```

### Enrollment Components
```
/components/enrollment/
├── EnrollmentButton.js    # Quick enrollment button
└── EnrollmentGate.js      # Content protection
```

### API Routes
```
/api/
├── auth/login/route.js    # Unified login API
├── enrollment/enroll/     # Enrollment creation
└── enrollment/status/     # Enrollment checking
```

## Usage Examples

### Homepage Sector Cards
```javascript
<EnrollmentButton
  programType="sector"
  programId="qirat-ilm"
  programName="Qirat & Ilm"
  variant="outline"
>
  Quick Enroll
</EnrollmentButton>
```

### Protected Sector Content
```javascript
<EnrollmentGate
  programType="sector"
  programId="tarbiya-idad"
  programName="Tarbiya & Idad Academy"
  requiresForm={true}
  formFields={[...]}
>
  <SectorMaterials />
</EnrollmentGate>
```

### Header Navigation
```javascript
<Link href="/auth/login">Sign In</Link>
<Link href="/auth/signup">Get Started</Link>
```

This system provides the best of both worlds: simplified login experience while maintaining the Islamic organizational structure with gender-specific registration and dashboards.